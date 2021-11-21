import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';

export default function uploadPicture(req: Request, res: Response, next: NextFunction) {
  const upload = multer({ dest: 'uploads/' }).single('picture');

  upload(req, res, (err : any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        req.body.picture = undefined;
        next();
        return;
      }
      return res.status(200).json({
        statusCode: 402,
        message: 'multerError',
      });
    } if (err) {
      return res.status(200).json({
        statusCode: 402,
        message: err,
      });
    }
    req.body.picture = req.file!.filename;
    next();
  });
}
