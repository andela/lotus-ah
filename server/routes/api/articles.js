// THIRD-PARTY LIBRARY
import { Router } from 'express';
import multerUploads from '../../config/multer/multerConfig';

// modules import
import ArticleController from '../../controllers/ArticleController';
import CommentController from '../../controllers/CommentController';
import HighlightTextController from '../../controllers/HighlightTextController';

// middelwares
import CommentValidation from '../../middlewares/CommentValidation';
import getUser from '../../middlewares/fetchUser';
import getArticle from '../../middlewares/fetchArticle';
import {
  articleValidation,
  schemas,
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

// Route for comments
ArticleRoute.post('/:slug/comments',
  Auth.verifyUserToken, getUser, getArticle,
  CommentValidation.validateComment, CommentController.addCommentToArticle);
ArticleRoute.put('/comments/:id',
  Auth.verifyUserToken,
  CommentValidation.validateUpdateComment,
  CommentValidation.validateComment, CommentController.updateComment);

// Route for highlights
ArticleRoute.post('/:slug/highlights', Auth.verifyUserToken, getUser, getArticle, CommentValidation.validateBody, HighlightTextController.highlightArticleText);

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

export default ArticleRoute;
