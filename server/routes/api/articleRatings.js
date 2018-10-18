import { Router } from 'express';
import ArticleRatingCointroller from '../../controllers/ArticleRatingController';
import Auth from '../../middlewares/TokenVerification';
import ratingValidator from '../../middlewares/ratingValidator';
import getUser from '../../middlewares/fetchUser';
import getArticle from '../../middlewares/fetchArticle';

const articleRatingRouter = Router();
articleRatingRouter.post('/articles/:slug/rating',
  Auth.verifyUserToken,
  getUser,
  getArticle,
  ratingValidator.validate,
  ArticleRatingCointroller.addRating);


export default articleRatingRouter;
