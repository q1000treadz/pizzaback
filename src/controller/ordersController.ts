import { Request, Response } from 'express';
import { FindManyOptions } from 'typeorm';
import { isNumber } from 'util';
import connection from '../connection';
import Catalog from '../entity/catalog';
import Orders from '../entity/orders';
import OrderLists from '../entity/orderslists';
import Users from '../entity/users';
import MailService from '../services/mailServices';
import { calculatePrice } from '../services/orderService';
import { orderState } from '../types';

class OrdersController {
  public getOrdersList(req: Request, res: Response) {
    const { limit, pizzeria, page } = req.query;
    connection
      .then(async (connection) => {
        const take = isNumber(limit) ? isNumber(page) ? page * limit : limit : NaN;
        const data: FindManyOptions<Orders> = { take };
        if (pizzeria !== undefined) data.where = { pizzeria };
        let OrdersResult = await connection.manager.find(Orders, data);
        if (isNumber(limit) && isNumber(page)) {
          OrdersResult = OrdersResult.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
        }
        res.status(200).json(OrdersResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public calculateOrder(req: Request, res: Response) {
    const { order } = req.body;
    connection
      .then(async (connection) => {
        const CatalogElements = await connection.manager.find(Catalog);
        const { summ, discount } = calculatePrice(CatalogElements, order, undefined);
        res.status(200).json({ summ, discount });
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(500).json(error);
      });
  }

  public addOrder(req: Request, res: Response) {
    const { client, pizzeria, order } = req.body;
    connection
      .then(async (connection) => {
        const user: Users | undefined = await connection.manager.findOne(Users, client);
        if (user === undefined) { res.status(400).json({ message: 'cant find user' }); }
        const CatalogElements = await connection.manager.find(Catalog);
        const { summ, discount } = calculatePrice(CatalogElements, order, user!.birthday);
        const order1 = new Orders();
        order1.client = client;
        order1.pizzeria = pizzeria;
        order1.summ = summ;
        order1.discount = discount;
        order1.orderState = orderState.RECIEVED;
        order1.createdAt = new Date(new Date(Date.now()).toISOString());
        order1.updatedAt = new Date(new Date(Date.now()).toISOString());
        const newOrder = await connection.manager.save(order1);
        const orderList = new OrderLists();
        orderList.orderId = newOrder.id;
        orderList.order = order;
        const newOrderList = await connection.manager.save(orderList);
        for (let i = 0; i < order.length; i++) {
          order[i].name = CatalogElements.find((catalogElem) => catalogElem.id === order[i]!.itemId)!.title;
        }
        if (user!.email !== undefined) {
          const mail = new MailService();
          mail.sendMail(user!.email, { summ, discount, order });
        }
        res.status(201).json(order1);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public getOrderById(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        const OrdersResult = await connection.manager.findOne(Orders, id);
        res.status(200).json(OrdersResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public updateOrder(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        const order = new Orders();
        const {
          client, pizzeria, summ, discount, orderState, createdAt, updatedAt,
        } = req.body;
        if (client !== undefined) order.client = client;
        if (pizzeria !== undefined) order.pizzeria = pizzeria;
        if (summ !== undefined) order.summ = summ;
        if (discount !== undefined) order.discount = discount;
        if (orderState !== undefined) order.orderState = orderState;
        if (createdAt !== undefined) order.createdAt = createdAt;
        if (updatedAt !== undefined) {
          order.updatedAt = updatedAt;
        } else {
          order.updatedAt = new Date(new Date(Date.now()).toISOString());
        }

        const updatedOrder = await connection.manager.update(Orders, id, { ...order });
        res.status(200).json(updatedOrder);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public deleteOrder(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        await connection.manager.delete(Orders, id);
        res.status(200).json({ deleted: true });
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }
}
export default OrdersController;
