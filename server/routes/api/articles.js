// THIRD-PARTY LIBRARY
import { Router } from 'express';
import ArticleController from '../../controllers/ArticleController';
import TagController from '../../controllers/TagController';
import multerUploads from '../../config/multer/multerConfig';
import {
  articleValidation,
  schemas,
  tagValidation
} from '../../middlewares/inputValidator';
import Auth from '../../middlewares/TokenVerification';

const ArticleRoute = Router();
ArticleRoute.post('/',
  Auth.verifyUserToken,
  multerUploads,
  articleValidation(schemas.articleSchema),
  ArticleController.createArticle)

  .get('/', ArticleController.getAllArticles);

ArticleRoute.get('/user',
  Auth.verifyUserToken,
  ArticleController.getUserArticles);

ArticleRoute.put('/user/:articleId',
  Auth.verifyUserToken,
  ArticleController.updateArticle)

  .delete('/user/:articleId',
    Auth.verifyUserToken,
    ArticleController.deleteArticle)

  .get('/user/:articleId',
    Auth.verifyUserToken,
    ArticleController.getSingleArticle);

// Favourite an article routes

ArticleRoute.post('/:id/favourite',
  Auth.verifyUserToken,
  ArticleController.addFavourite)
  .delete('/:id/favourite',
    Auth.verifyUserToken,
    ArticleController.removeFavourite);

ArticleRoute.get('/favourite',
  Auth.verifyUserToken,
  ArticleController.getAllFavorite);

// Like or this Dislike an article

ArticleRoute.post('/:articleId/:likeType',
  Auth.verifyUserToken,
  ArticleController.like);

ArticleRoute.get('/:articleId/like',
  Auth.verifyUserToken,
  ArticleController.getUserLikedArticles);

ArticleRoute.get('/:articleId/dislike',
  Auth.verifyUserToken,
  ArticleController.getUserDislikedArticles);

// Route for Tags

ArticleRoute.post('/tags',
  Auth.verifyUserToken,
  tagValidation,
  TagController.createTag);

ArticleRoute.get('/alltags',
  Auth.verifyUserToken,
  TagController.getAllTag);

ArticleRoute.get('/articlebytagid/tag/:id',
  Auth.verifyUserToken,
  TagController.getArticleByTagId);

ArticleRoute.get('/articlebytagname/:name',
  Auth.verifyUserToken,
  TagController.getArticleByTagName);

export default ArticleRoute;
