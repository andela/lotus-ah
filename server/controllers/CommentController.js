// module import
import model from '../db/models';
import NotificationController from './NotificationController';

const { Comment } = model;
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
    const commentDetails = request.body;
    const { id } = request.commentObject.dataValues;

    Comment.update(
      commentDetails,
      {
        where: {
          id
        },
        returning: true
      }
    )
      .then((comment) => {
        if (!comment) {
          return response.status(500)
            .json({
              message: 'Internal Server Error',
            });
        }
        return response.status(200)
          .json({
            status: 'success',
            message: 'Comment Updated Successfully',
            data: comment[1]
          });
      });
  }
}


export default CommentController;
