import { Request, Response } from 'express';
import { FindManyOptions } from 'typeorm';
import { isNumber } from 'util';
import connection from '../connection';
import Catalog from '../entity/catalog';

class CatalogController {
  public getCatalogList(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { type, limit, page } = req.query;
        const take = isNumber(limit) ? isNumber(page) ? page * limit : limit : NaN;
        const data: FindManyOptions<Catalog> = { take };
        if (type !== undefined) data.where = { type };
        let CatalogResult = await connection.manager.find(Catalog, data);
        if (isNumber(limit) && isNumber(page)) {
          CatalogResult = CatalogResult.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
        }
        res.status(200).json(CatalogResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public addCatalogElement(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const cathalog = new Catalog();
        const {
          title, description, type, picture, price,
        } = req.body;
        cathalog.title = title;
        cathalog.description = description;
        cathalog.picture = picture;
        cathalog.type = type;
        cathalog.price = price;
        await connection.manager.save(cathalog);
        res.status(201).json(cathalog);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public getCatalogElementById(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { id } = req.params;
        const CatalogResult = await connection.manager.findOne(Catalog, id);
        res.status(200).json(CatalogResult);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public updateCatalogElement(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { id } = req.params;
        const cathalog = new Catalog();
        const {
          title, description, type, picture, price,
        } = req.body;
        if (title !== undefined) cathalog.title = title;
        if (description !== undefined) cathalog.description = description;
        if (picture !== undefined) cathalog.picture = picture;
        if (type !== undefined) cathalog.type = type;
        if (price !== undefined) cathalog.price = price;
        const updatedCatalog = await connection.manager.update(Catalog, id, { ...cathalog });
        res.status(200).json(updatedCatalog);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public deleteCatalogElement(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { id } = req.params;
        await connection.manager.delete(Catalog, id);
        res.status(200).json({});
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }
}
export default CatalogController;
