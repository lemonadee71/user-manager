import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const UsersRouter = Router();

UsersRouter.get('/', UserController.getAllUsers);
UsersRouter.get('/:id', UserController.getUser);
UsersRouter.post('/', UserController.createUser);
UsersRouter.put('/:id', UserController.updateUser);
UsersRouter.delete('/:id', UserController.deleteUser);

export default UsersRouter;
