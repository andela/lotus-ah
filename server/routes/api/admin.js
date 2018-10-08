// third-party libraries
import { Router } from 'express';

// moduler importaions
import AdminController from '../../controllers/AdminController';

// middlewares
import AdminValidation from '../../middlewares/AdminValidation';
import UserValidation from '../../middlewares/UserValidation';
import AuthController from '../../middlewares/TokenVerification';

const adminRoute = Router();

// admin routes
adminRoute.get('/all', AuthController.verifyUserToken, AdminValidation.checkAdmin, AdminController.fetchAll);
adminRoute.get('/role/change/admin/:id', AuthController.verifyUserToken, UserValidation.checkProfileId, AdminValidation.checkAdmin, AdminValidation.checkUser, AdminController.makeAdmin);
adminRoute.get('/role/change/user/:id', AuthController.verifyUserToken, UserValidation.checkProfileId, AdminValidation.checkAdmin, AdminValidation.checkUser, AdminController.stripAdmin);
adminRoute.get('/suspend/:id', AuthController.verifyUserToken, UserValidation.checkProfileId, AdminValidation.checkAdmin, AdminValidation.checkUser, AdminController.suspendUser);


export default adminRoute;
