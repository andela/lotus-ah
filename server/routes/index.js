import { Router } from 'express';
import route from './api/index';
import userRoute from './api/users';


const routes = Router();
routes.get('/', (request, response) => response.status(200).json({
  message: 'Welcome to Authors Haven',
}));
routes.use('/api/v1', route);
routes.use('/api/v1/users', userRoute);
export default routes;
