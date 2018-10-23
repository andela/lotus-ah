// THIRD-PARTY LIBRARY
import { Router } from 'express';
import multerUploads from '../../config/multer/multerConfig';

// modules import
import ArticleController from '../../controllers/ArticleController';
import CommentController from '../../controllers/CommentController';
import HighlightTextController from '../../controllers/HighlightTextController';
import LikesController from '../../controllers/LikesController';

// middelwares
import CommentValidation from '../../middlewares/CommentValidation';
import getUser from '../../middlewares/fetchUser';
import getArticle from '../../middlewares/fetchArticle';
import {
  articleValidation,
  schemas,
} from '../../middlewares/inputValidator';
import Auth from '../../middlewares/TokenVerification';
import getComment from '../../middlewares/fetchComment';

const ArticleRoute = Router();

// Article routes

ArticleRoute.post('/',
  Auth.verifyUserToken,
  multerUploads,
  articleValidation(schemas.articleSchema),
  ArticleController.createArticle)

  .get('/', ArticleController.getAllArticles);

ArticleRoute.get('/user',
  Auth.verifyUserToken,
  ArticleController.getUserArticles);

ArticleRoute.get('/favourite',
  Auth.verifyUserToken,
  ArticleController.getAllFavorite);

ArticleRoute.put('/user/:slug',
  Auth.verifyUserToken,
  ArticleController.updateArticle)

  .delete('/user/:slug',
    Auth.verifyUserToken,
    ArticleController.deleteArticle);

// Route for highlights
ArticleRoute.post('/:slug/highlights', Auth.verifyUserToken, getUser, getArticle, CommentValidation.validateBody, HighlightTextController.highlightArticleText);
ArticleRoute.get('/:slug/highlights', Auth.verifyUserToken, getUser, getArticle, HighlightTextController.getHighlightTedText);

// Route for comments
ArticleRoute.post('/:slug/comments',
  Auth.verifyUserToken, getUser, getArticle,
  CommentValidation.validateComment, CommentController.addCommentToArticle);
ArticleRoute.put('/comments/:id',
  Auth.verifyUserToken,
  CommentValidation.validateUpdateComment,
  CommentValidation.validateComment, CommentController.updateComment);

ArticleRoute.get('/:slug',
  ArticleController.getSingleArticle);


// // Like or this Dislike a comment

ArticleRoute.post('/comments/:commentId/:likeType',
  Auth.verifyUserToken,
  getComment,
  LikesController.likeComment);

ArticleRoute.get('/comments/:commentId/like',
  Auth.verifyUserToken,
  LikesController.getUserLikedComments);

ArticleRoute.get('/comments/:commentId/dislike',
  Auth.verifyUserToken,
  LikesController.getUserDislikedComments);

// Favourite an article routes

ArticleRoute.post('/:id/favourite',
  Auth.verifyUserToken,
  ArticleController.addFavourite)
  .delete('/:id/favourite',
    Auth.verifyUserToken,
    ArticleController.removeFavourite);

// Like or this Dislike an article

ArticleRoute.post('/:articleId/:likeType',
  Auth.verifyUserToken,
  LikesController.likeArticle);

ArticleRoute.get('/:articleId/like',
  Auth.verifyUserToken,
  LikesController.getLikeCountForArticle);

ArticleRoute.get('/:articleId/dislike',
  LikesController.getDislikeCountForArticle);

export default ArticleRoute;
