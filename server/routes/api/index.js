import { Router } from 'express';
import users from './users';
import auth from './auth';

// Import fixtures
import createUser from '../../fixtures/user';
import articles from './articles';
import ArticleFixture from '../../fixtures/ArticleFixture';

const router = Router();
router.use('/', users);
router.use('/', auth);

/*       ******** Fixture routes ****************

 +++++ Start Fixture routes
*/
router.post('/users/create', createUser);
router.use('/', articles);
router.post('/articles/create', ArticleFixture.createArticle);
router.put('/articles/:id', ArticleFixture.updateArticle);

/*      ********* End fixture routes *************   */

export default router;
