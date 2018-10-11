import { Router } from 'express';
import route from './api/index';
import userRoute from './api/users';

const routes = Router();
routes.use('/api/v1', route);
routes.use('/api/v1/users', userRoute);

export default routes;
