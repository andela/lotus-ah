// Third party libraries
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// User model
import { User } from '../db/models';

import EmailController from './EmailController';


/**
 *
 *
 * @class AuthController
 * @description for user password authentication
 */
class AuthController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description verifies that user exists
   * @return {object} response
   * @memberof AuthController
   */
  static forgotPassword(request, response) {
    User.findOne({
      where: { email: `${request.body.email}` },
    })
      .then((result) => {
        if (result === null) {
          return response.status(404)
            .json({
              status: 'success',
              message: 'No user with email found',
            });
        }
        // Sing token
        const token = jwt.sign({ userId: result.id }, process.env.SECRET, {
          expiresIn: '1hr',
        });
        const link = `/api/v1/auth/reset_password?token=${token}`;
        // Send mail
        EmailController.validationEmail(result);
        return response.status(200)
          .json({
            status: 'success',
            message: 'Password reset details has been sent to your mail',
            link,
          });
      })
      .catch(err => response.status(500).json({
        status: 'FAILED',
        message: 'Error processing request, please try again',
        Error: err.toString()
      }));
  }


  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description resets user password
   * @returns {object} body
   * @memberof AuthController
   */
  static resetPassword(request, response) {
    const hash = bcrypt.hashSync(request.body.newPassword, 10);
    User.update(
      { password: hash },
      { where: { id: request.body.userId } },
    ).then(() => response.status(200)
      .json({
        message: 'Password changed successfully',
      }))
      .catch(() => response.status(400)
        .json({
          status: 'Failed',
          message: 'Problem changing password',
        }));
  }
}
export default AuthController;
