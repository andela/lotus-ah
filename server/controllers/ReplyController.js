
import models from '../db/models';
import validateBody from '../helpers/validateBody';

const { Reply, Comment, User } = models;
/**
 * @class ReplyController
 */
class ReplyController {
  /**
   * @static
   * @description create new reply for comments
   * @param {object} request
   * @param {object} response
   * @returns {object} reply
   * @memberof ReplyController
   */
  static createReplyForComment(request, response) {
    const user = request.authUser;
    const userId = user.id;
    const commentId = parseInt(request.params.commentId, 10);
    const { replyBody } = request.body;
    if (validateBody.replyBody(replyBody) === false) {
      return response.status(403)
        .json({
          message: 'Invalid reply',
        });
    }
    Comment.findOne({
      where: {
        id: commentId
      }
    })
      .then((foundComment) => {
        if (!foundComment) {
          return response.status(404)
            .json({
              message: 'Comment not found',
            });
        }
        const replyObject = {
          userId,
          commentId,
          replyBody
        };
        Reply.create(replyObject)
          .then((reply) => {
            if (!reply) {
              return response.status(500).json({
                message: 'Internal Server Error',
              });
            }
            return response.status(201)
              .json({
                message: 'Reply has been created successfully',
                data: { reply, user }
              });
          })
          .catch(err => response.status(500)
            .json({ message: err.message }));
      });
  }

  /**
   * @static
   * @description fetch replies for comments by id
   * @param {object} request
   * @param {object} response
   * @returns {object} reply
   * @memberof ReplyController
   */
  static fetchCommentReplies(request, response) {
    const commentId = parseInt(request.params.commentId, 10);
    Comment.findOne({
      where: {
        id: commentId
      }
    })
      .then((foundComment) => {
        if (!foundComment) {
          return response.status(404)
            .json({
              message: 'Comment not found',
            });
        }
        Reply.findAll({
          where: {
            commentId
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'imageUrl', 'username']

            }
          ]
        })
          .then(foundReplies => response.status(200)
            .json({
              message: 'Reply has been fetched successfully',
              data: foundReplies
            }))
          .catch(err => response.status(500)
            .json({
              message: err.message
            }));
      });
  }

  /**
  * @static
  * @description update replies
  * @param {object} request
  * @param {object} response
  * @returns {object} reply
  * @memberof ReplyController
  */
  static updateReplies(request, response) {
    const replyDetails = request.body;
    const replyId = parseInt(request.params.replyId, 10);
    if (validateBody.replyBody(replyDetails.replyBody) === false) {
      return response.status(403)
        .json({
          message: 'Invalid reply',
        });
    }
    Reply.findOne({
      where: {
        id: replyId
      }
    })
      .then((foundReply) => {
        if (!foundReply) {
          return response.status(403)
            .json({
              message: 'Invalid reply Id',
            });
        }
        Reply.update(
          replyDetails,
          {
            where: {
              id: replyId
            },
            returning: true,
          }
        )
          .then((reply) => {
            if (!reply) {
              return response.status(500)
                .json({
                  message: 'Internal Server Error',
                });
            }
            return response.status(200)
              .json({
                status: 'success',
                message: 'Reply Updated Successfully',
                data: reply[1]
              });
          });
      });
  }
}

export default ReplyController;
