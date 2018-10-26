// Model modules
import models from '../db/models';

const { Comment, User } = models;

/**
 * @class CommentValidation
 */
class CommentValidation {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} object
   * @memberof CommentValidation
   */
  static validateComment(request, response, next) {
    const { commentBody } = request.body;
    const commentError = [];
    if (commentBody === undefined || commentBody.trim() === '') {
      commentError.push('Invalid comment body');
    }
    if (commentError.length >= 1) {
      return response.status(403)
        .json({
          success: false,
          message: commentError
        });
    }
    return next();
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @returns {object} object
  * @memberof CommentValidation
  */
  static validateUpdateComment(request, response, next) {
    const { commentId } = request.params;
    const userId = request.decoded.id;
    Comment.findOne({
      where: {
        id: commentId
      },
      attributes: ['id', 'userId']
    })
      .then((comment) => {
        if (!comment) {
          return response.status(404)
            .json({
              status: 'fail',
              message: 'comment not found'
            });
        }
        User.findOne({
          where: {
            id: userId
          },
          attributes: ['id']
        })
          .then((user) => {
            if (user.dataValues.id !== comment.userId) {
              return response.status(403)
                .json({
                  status: 'fail',
                  message: 'you cannot update this comment'
                });
            }
            request.commentObject = comment;
            next();
          });
      });
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @returns {object} object
  * @memberof CommentValidation
  */
  static validateBody(request, response, next) {
    const article = request.articleObject.dataValues;
    const { commentBody, highlightedText } = request.body;
    const commentError = [];
    if (commentBody === undefined || commentBody.trim() === '') {
      commentError.push('Invalid comment body');
    }
    if (highlightedText === undefined || highlightedText.trim() === '') {
      commentError.push('Invalid text input');
    }
    if (!article.body.includes(highlightedText)) {
      commentError.push('Highlighted text not found');
    }
    if (commentError.length >= 1) {
      return response.status(403)
        .json({
          success: false,
          message: commentError
        });
    }
    return next();
  }
}

export default CommentValidation;
