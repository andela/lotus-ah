import { Comment } from '../db/models';

// Method to fetch a comment with the user
const getComment = (request, response, next) => {
  const userId = request.decoded.id;
  Comment.findOne({
    attributes: ['id', 'commentBody', 'updatedAt'],
    where: {
      id: request.params.commentId,
      userId
    }
  })
    .then((comment) => {
      if (!comment) {
        return response.status(404)
          .json({
            status: 'FAILED',
            message: 'comment not found'
          });
      }
      request.commentObject = comment;
      next();
    })
    .catch(next);
};

export default getComment;
