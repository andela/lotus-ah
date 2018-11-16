// third-party libraries
import bcrypt from 'bcrypt';

// module importaions
import { User } from '../db/models';
import EmailController from './EmailController';
import NotificationController from './NotificationController';

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
            const result = EmailController.sendVerificationEmail(user.dataValues, request);
            return response.status(200).json({
              status: 'Success',
              message: 'A verification email has been resent to this email',
              token: result.token
            });
          }
          return response.status(409).json({
            status: 'Success',
            message: 'Email exists'
          });
        }
        const result = EmailController.sendVerificationEmail(user.dataValues, request);
        return response.status(201).json({
          message: 'A verification email has been sent to this email ',
          user,
          token: result.token
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
      {
        where: { id: request.decoded.id },
        returning: true,
        plain: true
      }
    )
      .then((user) => {
        const activatedUser = {
          id: user[1].dataValues.id,
          email: user[1].dataValues.email,
        };
        return response.status(200).json({
          status: 'success',
          message: 'User Activated Successfully',
          user: activatedUser
        });
      })
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
      firstname, lastname, bio, password, username, fileUrl
    } = request.body;

    let imageUrl = fileUrl;

    if (!imageUrl) {
      imageUrl = '';
    }

    const userDetails = {
      firstname,
      lastname,
      bio,
      password,
      username,
      imageUrl
    };
    userDetails.password = bcrypt.hashSync(userDetails.password, 10);
    User.update(userDetails, { where: { id: request.decoded.id }, returning: true, plain: true })
      .then((user) => {
        const userObject = user[1].dataValues;
        const updateUser = {
          id: userObject.id,
          email: userObject.email,
          firstname: userObject.firstname,
          lastname: userObject.lastname,
          imageUrl: userObject.imageUrl,
          bio: userObject.bio,
        };
        NotificationController.setupUserSubsscription(updateUser.id);
        const userToken = auth.authenticate({
          id: updateUser.id, email: updateUser.email
        });
        response.status(200).json({
          status: 'success',
          message: 'User Update was Successfull',
          token: userToken,
          updateUser,
        });
      })
      .catch(err => err.message);
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
        if (!user) {
          response.status(400).json({
            status: 'failed',
            message: 'Email does not exist'
          });
        }
        const check = bcrypt.compareSync(password, user.dataValues.password);
        if (check) {
          const userToken = auth.authenticate(user.dataValues);
          const loggedInUser = {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            imageUrl: user.imageUrl,
            bio: user.bio,
          };
          response.status(200).json({
            status: 'success',
            message: 'Login was Successfull',
            token: userToken,
            user: loggedInUser
          });
        } else {
          response.status(401).json({
            status: 'failed',
            message: 'Incorrect Email or Password'
          });
        }
      }).catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Fetches a user's profile
  * @return {object} user
  * @memberof UserController
  */
  static getUserProfile(request, response) {
    User.findOne({
      where: {
        id: request.params.id,
        isActivated: true
      },
      attributes: ['email', 'firstname', 'lastname', 'bio', 'imageUrl']
    })
      .then((user) => {
        if (user) {
          response.status(200).json({
            status: 'success',
            message: 'User exists',
            user
          });
        } else {
          response.status(400).json({
            status: 'failed',
            message: 'User does not exist'
          });
        }
      }).catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Edits a user's profile
  * @return {object} user
  * @memberof UserController
  */
  static editUserProfile(request, response) {
    const {
      firstname, lastname, bio, fileUrl
    } = request.body;
    let { favouriteTags } = request.body;

    let imageUrl = fileUrl;

    if (!imageUrl) {
      imageUrl = '';
    } else if (favouriteTags.length === 0) {
      favouriteTags = [];
    }

    const userDetails = {
      firstname,
      lastname,
      bio,
      favouriteTags,
      imageUrl
    };
    User.update(userDetails, { where: { id: request.decoded.id } })
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Update was Successfull',
        user
      }))
      .catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Fetches a user's profile
  * @return {object} user
  * @memberof UserController
  */
  static getAllUserProfile(request, response) {
    const limit = 20;
    let offset = 0;
    User.findAndCountAll({
      attributes: ['email', 'firstname', 'lastname', 'bio', 'imageUrl', 'username', 'id']
    })
      .then((data) => {
        const { page } = request.params;
        offset = limit * (page - 1);
        const pages = Math.ceil(data.count / limit);
        User.findAll({
          attributes: ['email', 'firstname', 'lastname', 'bio', 'imageUrl', 'username', 'id'],
          limit,
          offset,
        }).then((profiles) => {
          if (profiles) {
            response.status(200).json({
              status: 'success',
              profiles,
              profilesCount: data.count,
              page,
              pages
            });
          } else {
            response.status(400).json({
              status: 'failed',
              message: 'User does not exist'
            });
          }
        });
      }).catch(err => err.message);
  }
}
export default UserController;
