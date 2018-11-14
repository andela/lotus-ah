// third-party libraries
import { Router } from 'express';

// moduler importaions
import UserController from '../../controllers/UserController';

// middlewares
import UserValidation from '../../middlewares/UserValidation';
import AuthController from '../../middlewares/TokenVerification';
import upload from '../../helpers/imageUploader';
import checkRole from '../../middlewares/checkRole';

const profileRoute = Router();

profileRoute.get('/:id',
  AuthController.verifyUserToken,
  UserValidation.checkProfileId,
  UserController.getUserProfile);
profileRoute.put('/:id',
  AuthController.verifyUserToken,
  UserValidation.checkProfileId,
  UserValidation.compareId,
  upload,
  UserValidation.checkUserDetails,
  UserController.updateUser);
profileRoute.get('/all/:page',
  AuthController.verifyUserToken,
  checkRole,
  UserController.getAllUserProfile);

export default profileRoute;
