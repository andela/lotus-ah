import { User } from '../db/models';
/**
 *
 *
 * @class UserController
 */
class UserController {
  /**
     *
     *
     * @static
     * @param {object} request
     * @param {object} response
     * @return {object} user
     * @memberof UserController
     */
  static createUser(request, response) {
    const { firstname, lastname, bio } = request.body;
    User.create({
      firstname, lastname, bio
    })
      .then(user => response.status(201).json({
        status: 'success',
        message: 'User Creation Successfully',
        user
      }))
      .catch(err => err.message);
  }
}
export default UserController;
