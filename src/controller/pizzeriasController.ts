import { Request, Response } from 'express';
import { FindManyOptions } from 'typeorm';
import { isNumber } from 'util';
import connection from '../connection';
import Pizzerias from '../entity/pizzerias';

class PizzeriasController {
  public getPizzeriasList(req: Request, res: Response) {
    const { limit, city, page } = req.query;
    connection
      .then(async (connection) => {
        const take = isNumber(limit) ? isNumber(page) ? page * limit : limit : NaN;
        const data: FindManyOptions<Pizzerias> = { take };
        if (city !== undefined) data.where = { city };
        let PizzeriaResult = await connection.manager.find(Pizzerias, data);
        if (isNumber(limit) && isNumber(page)) {
          PizzeriaResult = PizzeriaResult.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
        }
        res.status(200).json(PizzeriaResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public addPizzeria(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const pizzeria = new Pizzerias();
        const { title, city, address } = req.body;
        pizzeria.title = title;
        pizzeria.city = city;
        pizzeria.address = address;
        await connection.manager.save(pizzeria);
        res.status(201).json(pizzeria);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public getPizzeriaById(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        const CatalogResult = await connection.manager.findOne(Pizzerias, id);
        res.status(200).json(CatalogResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public updatePizzeria(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        const pizzeria = new Pizzerias();
        const { title, city, address } = req.body;
        if (title !== undefined) pizzeria.title = title;
        if (city !== undefined) pizzeria.city = city;
        if (address !== undefined) pizzeria.address = address;
        const updatedPizzeria = await connection.manager.update(Pizzerias, id, { ...pizzeria });
        res.status(200).json(updatedPizzeria);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public deletePizzeria(req: Request, res: Response) {
    const { id } = req.params;
    connection
      .then(async (connection) => {
        await connection.manager.delete(Pizzerias, id);
        res.status(200).json({ deleted: true });
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }
}
export default PizzeriasController;
