// third-party libraries
import { Router } from 'express';

// moduler importaions
import UserController from '../../controllers/UserController';

// middlewares
import UserValidation from '../../middlewares/UserValidation';
import AuthController from '../../middlewares/TokenVerification';

const userRoute = Router();
userRoute.post('/', UserValidation.checkEmail, UserController.createUser);
userRoute.get('/', AuthController.verifyUserToken, UserController.activateUser);
userRoute.put('/', AuthController.verifyUserToken, UserValidation.checkRequiredDetails, UserController.updateUser);

export default userRoute;
