

// THIRD-PARTY LIBRARY
import { Router } from 'express';


// modules import
import ReplyController from '../../controllers/ReplyController';


// middelwares;
import getUser from '../../middlewares/fetchUser';

import auth from '../../middlewares/TokenVerification';

const replyRoute = Router();


// Route for Replies

replyRoute.post('/comments/:commentId/replies', auth.verifyUserToken, getUser, ReplyController.createReplyForComment);
replyRoute.get('/comments/:commentId/replies', auth.verifyUserToken, getUser, ReplyController.fetchCommentReplies);

replyRoute.put('/comments/replies/:replyId',
  auth.verifyUserToken, ReplyController.updateReplies);


export default replyRoute;
