import { Application } from 'express';
import {
  celebrate, Joi, Segments,
} from 'celebrate';
import { ValidationError } from 'joi';
import PizzeriasController from '../controller/pizzeriasController';
import { checkAdminPermission, errorHandler } from '../middlewares/errors';
import { verifyAccessToken } from '../controller/token';

class PizzeriasRoutes {
  private controller: PizzeriasController;

  constructor() {
    this.controller = new PizzeriasController();
  }

  public routes(app : Application): void {
    app.route('/pizzerias/').get(celebrate({
      [Segments.QUERY]: Joi.object().keys({
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        city: Joi.string(),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.getPizzeriasList);

    app.route('/pizzerias/:id').get(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
    }), errorHandler, this.controller.getPizzeriaById);

    app.route('/pizzerias/').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().error(new ValidationError('', 'Title is required and has to be a string!', {})),
        city: Joi.string().required().error(new ValidationError('', 'City is required and has to be a string!', {})),
        address: Joi.string().required().error(new ValidationError('', 'Address is required and has to be a string!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.addPizzeria);

    app.route('/pizzerias/:id').patch(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().error(new ValidationError('', 'Title has to be a string!', {})),
        city: Joi.string().error(new ValidationError('', 'City has to be a string!', {})),
        address: Joi.string().error(new ValidationError('', 'Address has to be a string!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.updatePizzeria);

    app.route('/pizzerias/:id').delete(celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required().error(new ValidationError('', 'Id is required and has to be a integer!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, checkAdminPermission, this.controller.deletePizzeria);
  }
}

export default PizzeriasRoutes;
