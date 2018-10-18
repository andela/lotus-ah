// modules import
import model from '../db/models';

const { User, } = model;

// Method to fetch the authenticated user
const getUser = (request, response, next) => {
  const { id } = request.decoded;
  User.find({
    where: {
      id
    },
    attributes: ['id', 'email', 'username', 'bio', 'imageUrl', 'firstname']
  })
    .then((user) => {
      if (!user) {
        return response.status(404)
          .json({
            status: 'fail',
            message: 'User does not exist'
          });
      }
      request.authUser = user.dataValues;
      next();
    })
    .catch(next);
};
export default getUser;
