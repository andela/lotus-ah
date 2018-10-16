// module import
import model from '../db/models';


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
    const user = request.userObject.dataValues;
    const article = request.articleObject.dataValues;
    const userId = user.id;
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
