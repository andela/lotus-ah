import { Router } from 'express';
import users from './users';
import auth from './auth';
import bookmark from './bookmark';
import tag from './tag';
import articleRating from './articleRatings';
import search from './search';
import admin from './admin';
import notification from './notification';
import profiles from './profiles';


// Import fixtures
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
router.use('/', notification);


router.use('/', users);
router.use('/auth', socialAuth);
router.use('/profile', followRoute);
router.use('/profiles', profiles);

export default router;
