import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../services/UserService.js';
import { UserSchema } from '../models/User.js';

export default class UserController {
  public static async getAllUsers(this: void, req: Request, res: Response) {
    const users = await getAllUsers();
    res.status(200).json(users);
  }

  public static async getUser(this: void, req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw createHttpError(400, 'Invalid id format');

    const user = await getUser(id);

    if (!user) throw createHttpError(404, 'User not found');

    res.status(200).json(user);
  }

  public static async createUser(this: void, req: Request, res: Response) {
    // duplicate since JsonTable already validates
    const body = UserSchema.omit({ id: true }).parse(req.body);

    const user = await createUser(body);

    res.status(200).json({
      success: true,
      message: 'User created',
      user,
    });
  }

  public static async updateUser(this: void, req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw createHttpError(400, 'Invalid id format');

    const body = UserSchema.omit({ id: true }).partial().parse(req.body);

    const user = await updateUser(id, body);

    if (!user) throw createHttpError(404, 'User not found');

    res.status(200).json({
      success: true,
      message: 'User updated',
      user,
    });
  }

  public static async deleteUser(this: void, req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) throw createHttpError(400, 'Invalid id format');

    const user = await deleteUser(id);

    if (!user) throw createHttpError(404, 'User not found');

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  }
}
