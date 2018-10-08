import { Router } from 'express';
import users from './users';
import auth from './auth';
import bookmark from './bookmark';
import tag from './tag';
import articleRating from './articleRatings';
import search from './search';
import admin from './admin';


// Import fixtures
import createUser from '../../fixtures/user';
import articles from './articles';
import socialAuth from './socialAuthRoutes';
import followRoute from './follow';

const router = Router();
router.use('/admin', admin);
router.use('/', bookmark);
router.use('/', articleRating);
router.use('/users', users);
router.use('/', auth);
router.use('/articles', articles);
router.use('/', tag);
router.use('/', search);

/*       ******** Fixture routes ****************
*/
router.post('/create_dummy_user', createUser);

/*      ********* End fixture routes *************   */


/*       ******** Fixture routes ****************
*/
router.post('/users/create', createUser);

/*      ********* End fixture routes *************   */

router.use('/', users);
router.use('/auth', socialAuth);
router.use('/profiles', followRoute);

export default router;
