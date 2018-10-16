import { Router } from 'express';
import ArticleController from '../../controllers/ArticleController';
import TagController from '../../controllers/TagController';
import multerUploads from '../../config/multer/multerConfig';
import {
  articleValidation,
  schemas,
  tagValidation
} from '../../middlewares/inputValidator';
import auth from '../../middlewares/TokenVerification';

const articleRoute = Router();
articleRoute.post('/articles',
  auth.verifyUserToken,
  multerUploads,
  articleValidation(schemas.articleSchema),
  ArticleController.createArticle);
articleRoute.put('/articles/user/:articleId', auth.verifyUserToken, ArticleController.updateArticle);
articleRoute.delete('/articles/user/:articleId', auth.verifyUserToken, ArticleController.deleteArticle);
articleRoute.get('/articles/', ArticleController.getAllArticles);
articleRoute.get('/articles/user', auth.verifyUserToken, ArticleController.getUserArticles);
articleRoute.get('/articles/user/:articleId', auth.verifyUserToken, ArticleController.getSingleArticle);

// Favourite an article routes
articleRoute.post('/articles/:id/favourite',
  auth.verifyUserToken, ArticleController.addFavourite);
articleRoute.delete('/articles/:id/favourite',
  auth.verifyUserToken, ArticleController.removeFavourite);
articleRoute.get('/articles/favourite',
  auth.verifyUserToken, ArticleController.getAllFavorite);

// Route for Tags
articleRoute.post('/tags', auth.verifyUserToken, tagValidation, TagController.createTag);
articleRoute.get('/alltags', auth.verifyUserToken, TagController.getAllTag);
articleRoute.get('/articlebytagid/tag/:id', auth.verifyUserToken, TagController.getArticleByTagId);
articleRoute.get('/articlebytagname/:name', auth.verifyUserToken, TagController.getArticleByTagName);

export default articleRoute;
