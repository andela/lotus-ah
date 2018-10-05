import { Router } from 'express';
import users from './users';
import auth from './auth';
import createUser from '../../fixtures/user';

const router = Router();
router.use('/', users);
router.use('/', auth);
router.post('/users/create', createUser);

export default router;
