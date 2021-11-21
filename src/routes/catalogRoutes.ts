import { Application } from 'express';
import {
  celebrate, Joi, Segments,
} from 'celebrate';
import { ValidationError } from 'joi';
import CatalogController from '../controller/catalogController';
import { checkAdminPermission, errorHandler } from '../middlewares/errors';
import { verifyAccessToken } from '../controller/token';
import uploadPicture from '../middlewares/multer';

class CatalogRoutes {
  private controller: CatalogController;

  constructor() {
    this.controller = new CatalogController();
  }

  public routes(app : Application): void {
    app.route('/catalog/').get(celebrate({
      [Segments.QUERY]: Joi.object().keys({
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        type: Joi.string(),
      }),
    }), errorHandler, this.controller.getCatalogList);

    app.route('/catalog/:id').get(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
    }), errorHandler, this.controller.getCatalogElementById);

    app.route('/catalog/').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().error(new ValidationError('', 'Title is required and has to be a string!', {})),
        description: Joi.string().required().error(new ValidationError('', 'Description is required and has to be a string!', {})),
        type: Joi.string().required().error(new ValidationError('', 'Type is required and has to be a string!', {})),
        price: Joi.number().integer().required().error(new ValidationError('', 'Price is required and has to be a integer!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.addCatalogElement);

    app.route('/catalog/picture/:id').post(uploadPicture, celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.BODY]: Joi.object().keys({
        picture: Joi.string().error(new ValidationError('', 'Picture has to be a string!', {})),
      }),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.setPicture);

    app.route('/catalog/:id').patch(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().error(new ValidationError('', 'Title has to be a string!', {})),
        description: Joi.string().error(new ValidationError('', 'Description has to be a string!', {})),
        picture: Joi.string().error(new ValidationError('', 'Picture has to be a string!', {})),
        type: Joi.string().error(new ValidationError('', 'Type has to be a string!', {})),
        price: Joi.number().integer().error(new ValidationError('', 'Price has to be a integer!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.updateCatalogElement);

    app.route('/catalog/:id').delete(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.deleteCatalogElement);
  }
}

export default CatalogRoutes;
