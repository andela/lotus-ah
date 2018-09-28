import { User } from '../models';
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
     * @param {*} request
     * @param {*} response
     * @return {json} Object
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
