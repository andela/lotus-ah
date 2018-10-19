// module import
import model from '../db/models';
import NotificationController from './NotificationController';

const { Comment, CommentHistory } = model;
/**
 * @class CommentController
 */
class CommentController {
  /**
   * @static
   * @description The create comment method
   * @param  {object} request The request object
   * @param  {object} response The response object
   * @returns {object} json response
   * @memberof CommentController
   */
  static addCommentToArticle(request, response) {
    const user = request.authUser;
    const article = request.articleObject.dataValues;
    const userId = user.id;
    const author = request.articleObject.dataValues.users.dataValues;
    const articleId = article.id;
    const { commentBody } = request.body;

    const commentObject = {
      userId,
      articleId,
      commentBody
    };
    Comment.create(commentObject)
      .then((comment) => {
        if (!comment) {
          return response.status(500)
            .json({
              message: 'Internal Server Error',
            });
        }
        const notify = {
          type: 'comment',
          article: article.title,
          author,
          authenticatedUser: user,
          articleUrl: `${process.env.BASE_URL}/api/v1/articles/${article.slug}`,
          message: `${user.firstname} commented on your article`
        };
        NotificationController.notifyFollowers(
          {
            followerType: 'article',
            notify,
          }
        );
        return response.status(201)
          .json({
            message: 'Comment Added Successfully',
            data: { comment, user }
          });
      })
      .catch(err => response.status(400)
        .json({
          message: err.message
        }));
  }

  /**
   * @static
   * @description The create comment method
   * @param  {object} request The request object
   * @param  {object} response The response object
   * @returns {object} json response
   * @memberof CommentController
   */
  static updateComment(request, response) {
    const { commentBody } = request.body;
    const { id } = request.commentObject.dataValues;
    const count = 1;
    Comment.findOne({
      where: {
        id
      },
    })
      .then((commentFound) => {
        if (commentFound) {
          if (commentFound.dataValues.lien > commentFound.dataValues.commentEditCount) {
            const value = {
              commentBody: (commentBody) || commentFound.commentBody,
              commentEditCount: commentFound.dataValues.commentEditCount += count,
            };
            return Comment.update(
              value,
              {
                where: {
                  id
                },
                returning: true
              }
            )
              .then((comment) => {
                if (!comment) {
                  return response.status(500).json({
                    message: ' fish Internal Server Error',
                  });
                }
                CommentHistory.create({
                  commentId: commentFound.dataValues.id,
                  initialComment: commentFound.dataValues.commentBody,
                  userId: commentFound.dataValues.userId,
                  commentCreatedDate: commentFound.dataValues.createdAt,
                })
                  .then(() => response.status(200).json({
                    status: 'success',
                    message: 'Comment Updated Successfully',
                    data: comment[1]
                  }));
              })
              .catch((err) => {
                response.status(500).json({ message: err.message });
              });
          }
          return response.status(200)
            .json({
              message: 'you can not update this comment anymore'
            });
        }
        return response.status(500).json({
          message: 'Internal Server Error',
        });
      })
      .catch(err => response.status(500).json({ message: err.message }));
  }

  /**
   * @static
   * @description fetch comment history
   * @param  {object} request The request object
   * @param  {object} response The response object
   * @returns {object} json response
   * @memberof CommentController
   */
  static fetchCommentHistory(request, response) {
    const id = request.params.commentId;

    Comment.findOne({
      where: {
        id
      },
    })
      .then((comment) => {
        if (comment) {
          return CommentHistory.findAll({
            where: {
              commentId: id
            }
          })
            .then((foundComment) => {
              if (!foundComment) {
                response.status(500)
                  .json({
                    status: 'failed',
                    message: 'Internal server error',
                  });
              }
              response.status(200)
                .json({
                  status: 'successful',
                  message: 'Fetch comment history successfully',
                  data: foundComment
                });
            })
            .catch(err => err.message);
        }
        return response.status(404)
          .json({
            status: 'failed',
            message: 'comment not found'
          });
      });
  }
}


export default CommentController;
