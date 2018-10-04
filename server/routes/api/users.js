import { Router } from 'express';
import UserController from '../../controllers/UserController';
import TestController from '../../fixtures/EmailTestController';

const userRoute = Router();
userRoute.post('/createuser', UserController.createUser);
userRoute.get('/verificationemail', TestController.sendvalidationEmail);


export default userRoute;
