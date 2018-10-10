import { Router } from 'express';
import ArticleController from '../../controllers/ArticleController';
// import upload from '../../helpers/imageUploader';
import multerUploads from '../../config/multer/multerConfig';
import {
  articleValidation,
  schemas
} from '../../middlewares/inputValidator';
import auth from '../../middlewares/TokenVerification';

const userRoute = Router();
userRoute.post('/articles',
  auth.verifyUserToken,
  multerUploads,
  articleValidation(schemas.articleSchema),
  ArticleController.createArticle);
userRoute.put('/articles/user/:articleId', auth.verifyUserToken, ArticleController.updateArticle);
userRoute.delete('/articles/user/:articleId', auth.verifyUserToken, ArticleController.deleteArticle);
userRoute.get('/articles/', ArticleController.getAllArticles);
userRoute.get('/articles/user', auth.verifyUserToken, ArticleController.getUserArticles);
userRoute.get('/articles/user/:articleId', auth.verifyUserToken, ArticleController.getSingleArticle);

export default userRoute;
