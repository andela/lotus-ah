import { Router } from 'express';
import route from './api/index';

const routes = Router();
routes.get('/', (request, response) => response.status(200).json({
  message: 'Welcome to Authors Haven',
}));
routes.use('/api', route);
export default routes;
