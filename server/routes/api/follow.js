import { Router } from 'express';
import FollowController from '../../controllers/FollowController';
import auth from '../../middlewares/TokenVerification';

const followRoute = Router();

followRoute.post('/:userId/follow',
  auth.verifyUserToken,
  FollowController.followUser);
followRoute.delete('/:userId/unfollow',
  auth.verifyUserToken,
  FollowController.unfollowUser);
followRoute.get('/followers',
  auth.verifyUserToken,
  FollowController.listFollowers);
followRoute.get('/following',
  auth.verifyUserToken,
  FollowController.listFollowing);

export default followRoute;
