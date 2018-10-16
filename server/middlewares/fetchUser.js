// modules import
import model from '../db/models';

const { User } = model;

// Method to fetch the authenticated user
const getUser = (request, response, next) => {
  const { id } = request.decoded;

  User.find({
    where: {
      id
    },
    attributes: ['id', 'username', 'bio', 'imageUrl']
  })
    .then((user) => {
      if (!user) {
        return response.status(404)
          .json({
            status: 'fail',
            message: 'User does not exist'
          });
      }
      request.userObject = user;
      next();
    })
    .catch(next);
};
export default getUser;
