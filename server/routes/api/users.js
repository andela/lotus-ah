import { Router } from 'express';
import UserController from '../../controllers/UserController';

const userRoute =  Router();
userRoute.get('/createuser', UserController.createUser)

export default userRoute;