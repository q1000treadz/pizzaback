import { Application } from 'express';
import {
  celebrate, Segments,
} from 'celebrate';
import { ValidationError } from 'joi';
import DateExtension from '@joi/date';
import * as JoiImport from 'joi';
import { errorHandler } from '../middlewares/errors';

import { verifyAccessToken, verifyRefreshToken } from '../controller/token';
import UsersController from '../controller/usersContoller';

const Joi = JoiImport.extend(DateExtension);

class UsersRoutes {
  private controller: UsersController;

  constructor() {
    this.controller = new UsersController();
  }

  public routes(app: Application): void {
    app.route('/users/register').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required().error(new ValidationError('', 'Name is required and has to be a string!', {})),
        surname: Joi.string().required().error(new ValidationError('', 'Surname is required and has to be a string!', {})),
        phone: Joi.string().required().error(new ValidationError('', 'Phone is required and has to be a string!', {})),
        password: Joi.string().min(6).required().error(new ValidationError('', 'Password is required and has to be a string!', {})),
      }),
    }), errorHandler, this.controller.registerNewUser);

    app.route('/users/auth').post(celebrate({
      [Segments.BODY]: Joi.object().keys({
        phone: Joi.string().required().error(new ValidationError('', 'Phone is required and has to be a string!', {})),
        password: Joi.string().required().error(new ValidationError('', 'Password is required and has to be a string!', {})),
      }),
    }), errorHandler, this.controller.authorizeUser);

    app.route('/users/logout').post(celebrate({
      [Segments.COOKIES]: Joi.object().keys({
        refreshToken: Joi.string().required()
          .error(new ValidationError('', 'RefreshToken is required in cookie and has to be a string!', {})),
      }),
    }), errorHandler, verifyRefreshToken, this.controller.logoutUser);
    app.route('/users/refresh').post(celebrate({
      [Segments.COOKIES]: Joi.object().keys({
        refreshToken: Joi.string().required()
          .error(new ValidationError('', 'RefreshToken is required in cookie and has to be a string!', {})),
      }),
    }), errorHandler, verifyRefreshToken, this.controller.refreshToken);

    app.route('/users/').get(celebrate({
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, this.controller.getCurrentUser);

    app.route('/users/').patch(celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().error(new ValidationError('', 'Name has to be a string!', {})),
        surname: Joi.string().error(new ValidationError('', 'Surname has to be a string!', {})),
        phone: Joi.string().error(new ValidationError('', 'Phone has to be a string!', {})),
        password: Joi.string().error(new ValidationError('', 'Password has to be a string!', {})),
        email: Joi.string().error(new ValidationError('', 'Email has to be a string and have @!', {})),
        city: Joi.string().error(new ValidationError('', 'City has to be a string!', {})),
        address: Joi.string().error(new ValidationError('', 'Address has to be a string!', {})),
        birthday: Joi.date().format('DD-MM-YYYY').error(new ValidationError('', 'Birthday has to be a date!', {})),
      }),
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, this.controller.updateCurrentUser);

    app.route('/users/orders').get(celebrate({
      [Segments.HEADERS]: Joi.object().keys({
        authorization: Joi.string().required().error(new ValidationError('', 'Missing token', {})),
      }).unknown(),
    }), errorHandler, verifyAccessToken, this.controller.getCurrentUserOrders);
  }
}

export default UsersRoutes;
