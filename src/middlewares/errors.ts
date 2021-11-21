import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { isCelebrateError } from 'celebrate';
import { roles } from '../types';

export function errorHandler(err: ValidationError, req: Request, res: Response, next : NextFunction) {
  if (isCelebrateError(err)) {
    return res.status(200).json({
      statusCode: 402,
      message: err.details.get('body') || err.details.get('headers'),
    });
  }

  return next();
}

export function checkAdminPermission(req: Request, res: Response, next : NextFunction) {
  if (req.body.user.type !== roles.ADMIN) {
    res.status(200).json({
      statusCode: 400,
      message: 'Permission denied',
    });
  }
  return next();
}
