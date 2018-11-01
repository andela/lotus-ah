
// Express main app
import { Router } from 'express';

// Authcontroller
import AuthController from '../../controllers/AuthController';

// Midleware for authentication
import validator from '../../middlewares/authValidator';

const authRouter = Router();
authRouter.post('/auth/forgot_password', AuthController.forgotPassword);
authRouter.put(
  '/auth/reset_password',
  validator.verifyRestPasswordToken,
  validator.checkPassword,
  AuthController.resetPassword
);

authRouter.get(
  '/auth/forgot_password/verifyEmail',
  validator.verifyRestPasswordToken,
  AuthController.verifyUserEmail
);


export default authRouter;
