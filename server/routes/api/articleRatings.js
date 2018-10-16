import { Router } from 'express';
import ArticleRatingCointroller from '../../controllers/ArticleRatingController';
import Auth from '../../middlewares/TokenVerification';
import ratingValidator from '../../middlewares/ratingValidator';

const articleRatingRouter = Router();
articleRatingRouter.post('/articles/:slug/rating',
  Auth.verifyUserToken,
  ratingValidator.validate,
  ArticleRatingCointroller.addRating);


export default articleRatingRouter;
