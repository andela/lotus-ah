import { Router } from 'express';
import route from './api/index';
import userRoute from './api/users';
import commentRoute from './api/comments';
import articleRoute from './api/articles';

const routes = Router();
routes.use('/api/v1', route);
routes.use('/api/v1/articles', commentRoute);
routes.use('/api/v1/users', userRoute);
routes.use('/api/v1/articles', articleRoute);

export default routes;
