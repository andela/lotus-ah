import { Router } from 'express';
import route from './api/index';


const routes = Router();
routes.use('/api/v1', route);


export default routes;
