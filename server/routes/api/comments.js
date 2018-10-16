// third-party libraries
import { Router } from 'express';

// modules importation
import CommentController from '../../controllers/CommentController';

// middlewares
import AuthController from '../../middlewares/TokenVerification';
import CommentValidation from '../../middlewares/CommentValidation';
import getUser from '../../middlewares/fetchUser';
import getArticle from '../../middlewares/fetchArticle';


const commentRoute = Router();
commentRoute.post('/:slug/comments', AuthController.verifyUserToken, getUser, getArticle, CommentValidation.validateComment, CommentController.addCommentToArticle);
commentRoute.put('/comments/:id', AuthController.verifyUserToken, CommentValidation.validateUpdateComment, CommentValidation.validateComment, CommentController.updateComment);

export default commentRoute;
