import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import connection from '../connection';
import Tokens from '../entity/tokens';
import config from '../config';

export function generateToken(data : any) {
  const accessToken = jwt.sign(
    data,
    config.ACCESS_TOKEN_KEY,
    {
      expiresIn: '2h',
    },
  );
  const refreshToken = jwt.sign(
    data,
    config.REFRESH_TOKEN_KEY,
    {
      expiresIn: '30d',
    },
  );
  return { accessToken, refreshToken };
}

export function saveToken(userId : number, refreshToken : string) {
  connection
    .then(async (connection) => {
      const tokenData = await connection.manager.findOne(Tokens, { userId });
      if (tokenData) {
        tokenData.token = refreshToken;
        await connection.manager.save(tokenData);
        return tokenData;
      }
      const newToken = new Tokens();
      newToken.userId = userId;
      newToken.token = refreshToken;
      const token = await connection.manager.save(newToken);
      return token;
    })
    .catch((error) => {
      console.error('Error ', error);
    });
}

export function verifyAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization!.split(' ')[1];

  if (!token) {
    return res.status(403).send({ error: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_KEY);
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
  return next();
}
export function verifyRefreshToken(req:Request, res:Response, next:NextFunction) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(403).send({ error: 'A token is required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, config.REFRESH_TOKEN_KEY);
    req.body.user = decoded;
  } catch (err) {
    return res.status(401).send({ error: 'Invalid Token' });
  }
  return next();
}
