// THIRD-PARTY LIBRARY
import { Router } from 'express';
import uploads from '../../helpers/imageUploader';

// modules import
import ArticleController from '../../controllers/ArticleController';
import CommentController from '../../controllers/CommentController';
import HighlightTextController from '../../controllers/HighlightTextController';
import LikesController from '../../controllers/LikesController';
import ReportController from '../../controllers/ReportController';
import ReadingStatController from '../../controllers/ReadingStatController';

// middelwares
import CommentValidation from '../../middlewares/CommentValidation';
import getUser from '../../middlewares/fetchUser';
import getArticle from '../../middlewares/fetchArticle';
import {
  articleValidation,
  reportValidation,
  schemas,
} from '../../middlewares/inputValidator';
import Auth from '../../middlewares/TokenVerification';
import getComment from '../../middlewares/fetchComment';

const ArticleRoute = Router();

// Article routes

ArticleRoute.post('/',
  Auth.verifyUserToken,
  getUser,
  uploads,
  articleValidation(schemas.articleSchema),
  ArticleController.createArticle);

ArticleRoute.get('/all/:page', ArticleController.getAllArticles);

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
ArticleRoute.post('/:slug/highlights',
  Auth.verifyUserToken,
  getUser,
  getArticle,
  CommentValidation.validateBody,
  HighlightTextController.highlightArticleText);

ArticleRoute.get('/:slug/highlights',
  Auth.verifyUserToken,
  getUser,
  getArticle,
  HighlightTextController.getHighlightTedText);

// Route for comments
ArticleRoute.post('/:slug/comments',
  Auth.verifyUserToken, getUser, getArticle,
  CommentValidation.validateComment, CommentController.addCommentToArticle);
ArticleRoute.put('/:slug/comments/:commentId/edit',
  Auth.verifyUserToken,
  CommentValidation.validateUpdateComment,
  CommentValidation.validateComment,
  CommentController.updateComment);

// Report routes

ArticleRoute.post('/:slug/report',
  Auth.verifyUserToken,
  reportValidation(schemas.reportSchema),
  getUser,
  getArticle,
  ReportController.reportArticle);

ArticleRoute.get('/reports',
  Auth.verifyUserToken,
  getUser,
  ReportController.fetchAllReportedArticle);

ArticleRoute.get('/report/:slug',
  Auth.verifyUserToken,
  getUser,
  getArticle,
  ReportController.fetchReportForASingleArticle);

ArticleRoute.put('/:slug/report/resolve',
  Auth.verifyUserToken,
  getUser,
  getArticle,
  ReportController.resolveReport);

ArticleRoute.get('/:slug',
  Auth.passiveTokenValidation,
  ArticleController.getSingleArticle,
  ReadingStatController.recordReadingStat);

ArticleRoute.get('/user/reading/statistics',
  Auth.verifyUserToken,
  ReadingStatController.getReadingStat);

// // Like or this Dislike a comment

ArticleRoute.post('/comments/:commentId/:likeType',
  Auth.verifyUserToken,
  getUser,
  getComment,
  LikesController.likeComment);

ArticleRoute.get('/comments/:commentId/like',
  Auth.verifyUserToken,
  LikesController.getUserLikedComments);

ArticleRoute.get('/comments/:commentId/dislike',
  Auth.verifyUserToken,
  LikesController.getUserDislikedComments);


// Route to fetch commentHistory
ArticleRoute.get('/:slug/comments/:commentId',
  Auth.verifyUserToken, getArticle,
  CommentController.fetchCommentHistory);

// Favourite an article routes

ArticleRoute.post('/:slug/favourite',
  Auth.verifyUserToken,
  getArticle,
  ArticleController.addFavourite)
  .delete('/:slug/favourite',
    getArticle,
    Auth.verifyUserToken,
    ArticleController.removeFavourite);

// Like or this Dislike an article

ArticleRoute.post('/:articleId/:likeType',
  Auth.verifyUserToken,
  getUser,
  LikesController.likeArticle);

ArticleRoute.get('/:articleId/like',
  Auth.verifyUserToken,
  LikesController.getLikeCountForArticle);

ArticleRoute.get('/:articleId/dislike',
  LikesController.getDislikeCountForArticle);

export default ArticleRoute;
