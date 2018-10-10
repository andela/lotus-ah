// third-party libraries
import { Router } from 'express';

// moduler importaions
import UserController from '../../controllers/UserController';

// middlewares
import UserValidation from '../../middlewares/UserValidation';
import AuthController from '../../middlewares/TokenVerification';
import upload from '../../config/cloudinary';

const userRoute = Router();
userRoute.post('/createuser', UserController.createUser);
userRoute.post('/', UserValidation.checkEmail, UserController.createUser);
userRoute.post('/login', UserValidation.checkEmail, UserValidation.checkPassword, UserController.loginUser);
userRoute.get('/', AuthController.verifyUserToken, UserController.activateUser);
userRoute.put('/', AuthController.verifyUserToken, upload.single('file'), UserValidation.checkRequiredDetails, UserController.updateUser);

// User profile route
userRoute.get('/profile/:id', UserValidation.checkProfileId, UserController.getUserProfile);
userRoute.put('/profile/:id', AuthController.verifyUserToken, UserValidation.checkProfileId, UserValidation.compareId, upload.single('file'), UserValidation.checkUserDetails, UserController.updateUser);


export default userRoute;
