import express from 'express';
import { getOwnInfo } from '../controller/UserController.js';

const UserRouter = express.Router();

UserRouter.get('/me', getOwnInfo);

export default UserRouter;