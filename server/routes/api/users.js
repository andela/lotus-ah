import { Router } from 'express';
import UserController from '../../controllers/UserController';
import UserValidation from '../../middlewares/UserValidation';
import AuthController from '../../middlewares/TokenVerification';

const userRoute = Router();
userRoute.post('/', UserValidation.checkEmail, UserController.createUser);
userRoute.get('/', AuthController.verifyUserToken, UserController.activateUser);
userRoute.put('/', AuthController.verifyUserToken, UserValidation.checkRequiredDetails, UserController.updateUser);

export default userRoute;
