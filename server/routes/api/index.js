import { Router } from 'express';
import users from './users';
import auth from './auth';

// Import fixtures
import createUser from '../../fixtures/user';
import articles from './articles';
import socialAuth from './socialAuthRoutes';

const router = Router();
router.use('/', users);
router.use('/', auth);
router.use('/', articles);


/*       ******** Fixture routes ****************
*/
router.post('/users/create', createUser);

/*      ********* End fixture routes *************   */

router.use('/', users);
router.use('/auth', socialAuth);

export default router;
