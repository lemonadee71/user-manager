import { Router } from 'express';
import UsersRouter from './users.js';

const ApiRouter = Router();

ApiRouter.use('/users', UsersRouter);

export default ApiRouter;
