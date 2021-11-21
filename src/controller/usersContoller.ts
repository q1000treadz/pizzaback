import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import connection from '../connection';
import Users from '../entity/users';
import { generateToken, saveToken } from './token';
import Orders from '../entity/orders';
import Tokens from '../entity/tokens';

class UsersController {
  public registerNewUser(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const {
          name, surname, phone, password,
        } = req.body;
        const oldUser = await connection.manager.findOne(Users, { where: { phone } });

        if (oldUser) {
          return res.status(409).send('User Already Exist. Please Login');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users();
        newUser.name = name;
        newUser.surname = surname;
        newUser.phone = phone;
        newUser.password = encryptedPassword;
        newUser.type = 0;
        await connection.manager.save(newUser);
        const user = await connection.manager.findOne(Users, { where: { phone } });

        const tokens = generateToken({ id: user!.id, phone: user!.phone, type: user!.type });
        saveToken(user!.id, tokens.refreshToken);
        const userData = {
          name,
          surname,
          phone,
          tokens,
        };
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.status(201).json(userData);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public authorizeUser(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { phone, password } = req.body;

        const user = await connection.manager.findOne(Users, { phone });

        if (user && await bcrypt.compare(password, user.password)) {
          const tokens = generateToken({ id: user.id, phone: user.phone, type: user.type });
          saveToken(user.id, tokens.refreshToken);
          const outputData = { ...user, tokens };
          res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
          res.status(200).json(outputData);
        } else {
          res.status(400).send('Invalid Credentials');
        }
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public logoutUser(req: Request, res:Response) {
    connection
      .then(async (connection) => {
        const { refreshToken } = req.cookies;
        const result = await connection.manager.delete(Tokens, { token: refreshToken });
        res.clearCookie('refreshToken');
        res.status(200).json({ logout: true });
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public refreshToken(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { refreshToken } = req.cookies;
        const { id, phone, type } = req.body.user;
        const tokens = generateToken({ id, phone, type });
        saveToken(id, tokens.refreshToken);
        const outputData = {
          id, phone, type, tokens,
        };
        res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.status(200).json(outputData);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public getCurrentUser(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { id, phone, type } = req.body.user;
        const user = await connection.manager.findOne(Users, id);
        res.status(200).json(user);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public updateCurrentUser(req: Request, res: Response) {
    console.log(req.body);
    connection
      .then(async (connection) => {
        const user = new Users();
        const { id } = req.body.user;
        const {
          name, surname, phone, password, city, address, birthday, email,
        } = req.body;
        if (name !== undefined) user.name = name;
        if (surname !== undefined) user.surname = surname;
        if (phone !== undefined) user.phone = phone;
        if (password !== undefined) user.password = await bcrypt.hash(password, 10);
        if (city !== undefined) user.city = city;
        if (address !== undefined) user.address = address;
        if (birthday !== undefined) user.birthday = birthday;
        if (email !== undefined) user.birthday = birthday;
        const updatedUser = await connection.manager.update(Users, id, { ...user });
        res.status(200).json(updatedUser);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }

  public getCurrentUserOrders(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const { id, phone, type } = req.body.user;
        const userOrders = await connection.manager.find(Orders, { where: { client: id } });
        res.status(200).json(userOrders);
      })
      .catch((error) => {
        console.error('Error ', error);
        res.status(400).json(error);
      });
  }
}
export default UsersController;
