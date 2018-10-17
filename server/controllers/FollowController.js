// follow model
import { Follow, User } from '../db/models';

/**
 * @class FollowController
 * @description for user follow and unfollow ability
 */
class FollowController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description it performs the follow functionality
   * @return {object} response
   * @memberof FollowController
   */
  static followUser(request, response) {
    const followerId = request.decoded.id;
    const followingId = request.params.userId;
    const fllId = parseInt(followerId, 0);
    const fId = parseInt(followingId, 0);
    if (fllId === fId) {
      response.status(400).json({
        message: 'User cannot follow him/herself'
      });
    } else {
      Follow.create({
        followinId: followingId,
        followerId
      }).then((follow) => {
        User.findOne({
          where: {
            id: follow.followinId
          }
        }).then((user) => {
          if (user) {
            response.status(201).json({
              profile: {
                username: user.username,
                image: user.imageUrl,
                bio: user.bio,
                following: true
              }
            });
          } else {
            response.status(400).json({
              message: 'Id in Url is incorrect'
            });
          }
        });
      })
        .catch(err => response.status(500).json({
          message: 'Error processing request, please try again',
          Error: err.toString(),
        }));
    }
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description it performs the unfollow functionality
   * @returns {object} body
   * @memberof FollowController
   */
  static unfollowUser(request, response) {
    const followerId = request.decoded.id;
    const followingId = request.params.userId;

    Follow.destroy({
      where: {
        followinId: followingId,
        followerId
      }
    }).then(() => {
      User.findOne({
        where: {
          id: followingId
        },
        attributes: [
          'username',
          'email',
          'imageUrl',
          'bio'
        ]
      }).then((user) => {
        response.status(200).json({
          profile: {
            username: user.username,
            image: user.imageUrl,
            bio: user.bio,
            following: false
          }
        });
      });
    })
      .catch(err => response.status(500).json({
        message: 'Error processing request, please try again',
        Error: err.toString(),
      }));
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description it lists all followers for a user
   * @returns {object} body
   * @memberof FollowController
   */
  static listFollowers(request, response) {
    Follow.findAndCountAll({
      where: {
        followinId: request.decoded.id
      }
    }).then((followers) => {
      response.status(201).json({
        followers: followers.rows,
        followersCount: followers.count
      });
    });
  }

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description it list all users a user is following
   * @returns {object} body
   * @memberof FollowController
   */
  static listFollowing(request, response) {
    Follow.findAndCountAll({
      where: {
        followerId: request.decoded.id
      }
    }).then((following) => {
      response.status(201).json({
        following: following.rows,
        followingCount: following.count
      });
    });
  }
}
export default FollowController;
