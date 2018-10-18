import { Comment, User } from '../db/models';


// Method to fetch a comment with the user
const getComment = (request, response, next) => {
  Comment.findOne({
    include: [
      {
        model: User,
        as: 'user',
        attributes: [
          'id',
          'email',
          'firstname',
          'username'
        ]
      }
    ],
    attributes: ['id', 'userId', 'commentBody', 'updatedAt'],
    where: {
      id: request.params.commentId,
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
