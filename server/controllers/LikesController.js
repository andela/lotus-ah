// modules import
import {
  Article,
  Reaction,
  User,
} from '../db/models';
import NotificationController from './NotificationController';

/**
 * @class ArticleController
 * @desc This is a class controller
 * that handles all operations related to Articles.
 */
class LikesController {
  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Like or Dislike of article
  * @return {object} Object
  * @memberof UserController
  */
  static likeArticle(req, res) {
    const userId = req.decoded.id;
    const user = req.authUser;
    const articleId = Number(req.params.articleId);
    const likes = req.params.likeType === 'like';
    const dislike = req.params.likeType === 'dislike';
    const message = likes || dislike ? `you ${req.params.likeType}d the article` : 'you unliked the article';

    if (!(Number.isInteger(articleId)) && !Number(articleId)) {
      return res.status(400).json({
        status: 'FAILED',
        message: 'Article ID must be a number',
      });
    }
    Article.findOne({
      include: [
        {
          model: User,
          as: 'users',
          attributes: [
            'id',
            'email',
            'firstname',
            'username',
            'lastname'
          ]
        }
      ],
      where: {
        id: articleId,
      },
      attributes: [
        'id',
        'userId',
        'title',
        'slug'
      ]
    }).then((foundArticle) => {
      if (!foundArticle) {
        return res.status(404).json({
          status: 'FAILED',
          message: 'Article not found or has been deleted',
        });
      }
      const author = foundArticle.users.dataValues;
      const article = foundArticle.dataValues;
      return Reaction.findOrCreate({
        where: {
          userId,
          articleId
        },
        attributes: ['id', 'userId', 'likes', 'dislike', 'articleId'],
        defaults: {
          likes,
          dislike
        }
      })
        .spread((DBdata, created) => {
          if (!created) {
            DBdata.likes = likes;
            DBdata.dislike = dislike;
            DBdata.save().catch(() => res.status(400).json({
              status: 'FAILED',
              message: 'Article not found or has been deleted',
            }));
          }
          const notify = {
            type: 'like',
            article,
            authenticatedUser: user,
            author,
            articleUrl: `${process.env.BASE_URL}/api/v1/articles/${article.slug}`,
            message: `${user.firstname},${user.id},like your artilce,${article.title},${article.slug}`,
            emailMessage: `${user.firstname} liked your article`
          };
          NotificationController.notifyFollowers(
            {
              followerType: 'article',
              notify,
            }
          );
          return res.status(200).json({
            status: 'SUCCESS',
            DBdata,
            message
          });
        }).catch(err => res.status(500).json({
          status: 'FAILED',
          message: 'Error processing request, please try again',
          error: err.toString()
        }));
    }).catch(err => res.status(500).json({
      status: 'FAILED',
      message: 'Error processing request, please try again',
      error: err.toString()
    }));
  }

  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Get all Likes for an article
  * @return {object} Object
  * @memberof UserController
  */
  static getLikeCountForArticle(req, res) {
    const articleId = Number(req.params.articleId);

    Reaction.findAndCountAll({
      attributes: ['id', 'userId', 'likes', 'articleId'],
      where: {
        articleId,
        likes: true
      }
    })
      .then((likes) => {
        if (likes) {
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'All likes for this articles',
              likes
            });
        }
        res.status(404)
          .json({
            status: 'FAILED',
            message: 'Article not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            status: 'FAILED',
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Get all Dislikes for an article
  * @return {object} Object
  * @memberof UserController
  */
  static getDislikeCountForArticle(req, res) {
    const articleId = Number(req.params.articleId);

    Reaction.findAndCountAll({
      attributes: ['id', 'userId', 'dislike', 'articleId'],
      where: {
        articleId,
        likes: false
      }
    })
      .then((likes) => {
        if (likes) {
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'All dislikes for this articles',
              likes
            });
        }
        res.status(404)
          .json({
            message: 'Article not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            status: 'FAILED',
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Like or Dislike of a comment
  * @return {object} Object
  * @memberof UserController
  */
  static likeComment(req, res) {
    const comment = req.commentObject;
    const { authUser } = req;
    const commentOwner = comment.user.dataValues;
    const userId = req.decoded.id;
    const commentId = comment.id;
    const likes = req.params.likeType === 'like';
    const dislike = req.params.likeType === 'dislike';
    const message = likes || dislike ? `you ${req.params.likeType}d the comment` : 'you unliked the comment';

    Reaction.findOrCreate({
      where: {
        userId,
        commentId
      },
      attributes: ['id', 'userId', 'likes', 'dislike', 'articleId'],
      defaults: {
        likes,
        dislike
      }
    })
      .spread((DBdata, created) => {
        if (!created) {
          DBdata.likes = likes;
          DBdata.dislike = dislike;
          DBdata.save().catch(() => res.status(404).json({
            status: 'FAILED',
            message: 'Comment not found or has been deleted',
          }));
        }
        const notify = {
          user: commentOwner,
          email: commentOwner.email,
          templateId: 'd-c2a36f6d193a47d8bb479472b41bfceb',
          message: `${authUser.firstname},${authUser.id},published a new artilce,${authUser.title},${authUser.slug}`,
          emailMessage: `Hey ${authUser.firstname} liked your comment on ${comment.commentBody}`,
        };
        // I shouldn't receive notification when I like my own comment
        if (commentOwner.id !== authUser.id) {
          NotificationController.notifyUser(notify, commentOwner.id);
        }
        return res.status(201).json({
          status: 'SUCCESS',
          DBdata,
          message
        });
      })
      .catch(err => res.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        error: err.toString()
      }));
  }

  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Get all likes for a comment
  * @return {object} Object
  * @memberof UserController
  */
  static getUserLikedComments(req, res) {
    const userId = req.decoded.id;
    const commentId = Number(req.params.commentId);

    Reaction.findAndCountAll({
      attributes: ['id', 'userId', 'dislike', 'commentId'],
      where: {
        userId,
        commentId,
        likes: true
      }
    })
      .then((likes) => {
        if (likes) {
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'All likes for this comment',
              likes
            });
        }
        res.status(404)
          .json({
            message: 'Comment not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            status: 'FAILED',
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }

  /**
  * @static
  * @param {object} req
  * @param {object} res
  * @description Get all Disliked for a comment
  * @return {object} Object
  * @memberof UserController
  */
  static getUserDislikedComments(req, res) {
    const userId = req.decoded.id;
    const commentId = Number(req.params.commentId);

    Reaction.findAndCountAll({
      attributes: ['id', 'userId', 'dislike', 'commentId'],
      where: {
        userId,
        commentId,
        dislike: true
      }
    })
      .then((dislikes) => {
        if (dislikes) {
          return res.status(200)
            .json({
              status: 'SUCCESS',
              message: 'All dislikes for this comment',
              dislikes
            });
        }
        res.status(404)
          .json({
            message: 'Comment not found or has been deleted',
          });
      })
      .catch((err) => {
        res.status(500)
          .json({
            status: 'FAILED',
            message: 'Error processing request, please try again',
            Error: err.toString()
          });
      });
  }
}

export default LikesController;
