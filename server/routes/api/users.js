import { Router } from 'express';
import UserController from '../../controllers/UserController';

const userRoute = Router();
userRoute.post('/createuser', UserController.createUser);


export default userRoute;
