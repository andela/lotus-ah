import bcrypt from 'bcrypt';
import { User } from '../db/models';
import auth from '../middlewares/TokenVerification';

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
     * @description Check's user email then send activation link
     * @return {object} Object
     * @memberof UserController
     */
  static createUser(request, response) {
    let { email } = request.body;
    email = email.trim();
    User.findOrCreate({
      where: {
        email
      },
      defaults: {
        email
      }
    })
      .spread((user, created) => {
        if (!created) {
          const { isActivated } = user.dataValues;
          if (isActivated === false) {
            // Send grid code here
            const userToken = auth.authenticate(user.dataValues);
            return response.status(200).json({
              status: 'Success', message: 'A verification email has been resent to this email', token: userToken
            });
          }
          return response.status(409).json({
            status: 'Success', message: 'Email exists'
          });
        }
        // Send grid code here
        const userToken = auth.authenticate(user.dataValues);
        return response.status(201).json({
          message: 'A verification email has been sent to this email ',
          token: userToken,
          user
        });
      });
  }

  /**
     *
     *
     * @static
     * @param {object} request
     * @param {object} response
     * @description Updates user's isActivated Column after activation
     * @return {object} user
     * @memberof UserController
     */
  static activateUser(request, response) {
    User.update({ isActivated: true }, { where: { id: request.decoded.id } })
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Activated Successfully',
        user
      }))
      .catch(err => err.message);
  }

  /**
     *
     *
     * @static
     * @param {object} request
     * @param {object} response
     * @description Updates user's details after activation
     * @return {object} user
     * @memberof UserController
     */
  static updateUser(request, response) {
    const userDetails = request.body;
    userDetails.password = bcrypt.hashSync(userDetails.password, 10);
<<<<<<< HEAD
    User.update(userDetails, { where: { id: request.decoded.id } })
=======
    User.update(
      userDetails, { where: { id: request.decoded.id } }
    )
>>>>>>> 9d82fa5... feat(sign up) User signup feature)
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Update was Successfull',
        user
      }))
      .catch(err => err.message);
  }
}
export default UserController;
