import { Application } from 'express';
import { celebrate, Segments } from 'celebrate';
import { ValidationError } from 'joi';
import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
import { verifyAccessToken } from '../controller/token';
import { checkAdminPermission, errorHandler } from '../middlewares/errors';
import OrdersController from '../controller/ordersController';

const Joi = JoiImport.extend(DateExtension);
class OrdersRoutes {
  private controller: OrdersController;

  constructor() {
    this.controller = new OrdersController();
  }

  public routes(app : Application): void {
    app.route('/orders/').get(celebrate({
      [Segments.QUERY]: Joi.object().keys({
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        pizzeria: Joi.string(),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, this.controller.getOrdersList);

    app.route('/orders/calculate').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        order: Joi.array().items(Joi.object().keys({
          itemId: Joi.number().integer().required().error(new ValidationError('', 'ItemId is required and has to be a integer!', {})),
          count: Joi.number().integer().required().error(new ValidationError('', 'Count is required and has to be a integer!', {})),
        })).required().error(new ValidationError('', 'Order is required!', {})),
      }),
    }), errorHandler, this.controller.calculateOrder);

    app.route('/orders/').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        client: Joi.number().integer().required().error(new ValidationError('', 'Price is required and has to be a integer!', {})),
        pizzeria: Joi.number().integer().required().error(new ValidationError('', 'Price is required and has to be a integer!', {})),
        order: Joi.array().items(Joi.object().keys({
          itemId: Joi.number().integer().required().error(new ValidationError('', 'ItemId is required and has to be a integer!', {})),
          count: Joi.number().integer().required().error(new ValidationError('', 'Count is required and has to be a integer!', {})),
        })).required().error(new ValidationError('', 'Order is required!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, this.controller.addOrder);

    app.route('/orders/:id').get(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
    }), errorHandler, this.controller.getOrderById);

    app.route('/orders/:id').patch(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.BODY]: Joi.object().keys({
        client: Joi.number().integer().error(new ValidationError('', 'Client has to be a integer!', {})),
        pizzeria: Joi.number().integer().error(new ValidationError('', 'Pizzeria has to be a integer!', {})),
        summ: Joi.number().integer().error(new ValidationError('', 'Summ has to be a integer!', {})),
        discount: Joi.number().integer().error(new ValidationError('', 'Discount has to be a integer!', {})),
        orderState: Joi.number().integer().error(new ValidationError('', 'OrderState has to be a integer!', {})),
        createdAt: Joi.date().format('DD-MM-YYYY HH-MM-SS').error(new ValidationError('', 'createdAt has to be a date!', {})),
        updatedAt: Joi.date().format('DD-MM-YYYY HH-MM-SS').error(new ValidationError('', 'updatedAt has to be a date!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.updateOrder);

    app.route('/orders/:id').delete(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.deleteOrder);
  }
}

export default OrdersRoutes;
