// modules import
import model from '../db/models';

const { User } = model;

// Method to fetch the authenticated user
const getRole = (request, response, next) => {
  const { id } = request.decoded;

  User.findOne({
    where: {
      id,
      roleId: 1
    }
  })
    .then((user) => {
      if (!user) {
        return response.status(401)
          .json({
            status: 'fail',
            message: 'Protected route, Not an admin'
          });
      }
      request.isAdmin = true;
      next();
    })
    .catch(next);
};
export default getRole;
