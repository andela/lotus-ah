// third-party libraries
import bcrypt from 'bcrypt';

// module importaions
import { User } from '../db/models';
import EmailController from './EmailController';

// middlewares
import auth from '../middlewares/TokenVerification';

/**
* @class UserController
*/
class UserController {
  /**
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
            EmailController.validationEmail(user.dataValues);
            const userToken = auth.authenticate(user.dataValues);
            return response.status(200).json({
              status: 'Success',
              message: 'A verification email has been resent to this email',
              token: userToken
            });
          }
          return response.status(409).json({
            status: 'Success',
            message: 'Email exists'
          });
        }
        EmailController.validationEmail(user.dataValues);
        const userToken = auth.authenticate(user.dataValues);
        return response.status(201).json({
          message: 'A verification email has been sent to this email ',
          token: userToken,
          user
        });
      });
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Updates user's isActivated Column after activation
  * @return {object} user
  * @memberof UserController
  */
  static activateUser(request, response) {
    User.update(
      { isActivated: true },
      { where: { id: request.decoded.id } }
    )
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Activated Successfully',
        user
      }))
      .catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Updates user's details after activation
  * @return {object} user
  * @memberof UserController
  */
  static updateUser(request, response) {
    const {
      firstname, lastname, bio, password, username
    } = request.body;
    const userDetails = {
      firstname,
      lastname,
      bio,
      password,
      username
    };
    userDetails.password = bcrypt.hashSync(userDetails.password, 10);
    User.update(userDetails, { where: { id: request.decoded.id } })
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Update was Successfull',
        user
      }))
      .catch((err) => { console.log(err.message); });
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Logs a user in to his account
  * @return {object} user
  * @memberof UserController
  */
  static loginUser(request, response) {
    const { email, password } = request.body;
    User.findOne({ where: { email } })
      .then((user) => {
        const check = bcrypt.compareSync(password, user.dataValues.password);
        if (check) {
          const userToken = auth.authenticate(user.dataValues);
          delete user.password;
          response.status(200).json({
            status: 'success',
            message: 'Login was Successfull',
            token: userToken,
            user
          });
        } else {
          response.status(401).json({
            status: 'failed',
            message: 'Incorrect Email or Password'
          });
        }
      }).catch(err => err.message);
  }
}
export default UserController;
