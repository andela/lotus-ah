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
        const path = `/api/v1/auth/forgot_password/verifyEmail?token=${token}`;
        // Send mail
        const serverResetLink = `${process.env.BASE_URL}${path}`;
        const clientResetLink = request.query.callBack;
        const resetLink = clientResetLink ? `${clientResetLink}?token=${token}` : serverResetLink;
        const emailObject = {
          to: result.email,
          from: process.env.EMAIL_HOST,
          templateId: 'd-2ecbb1b8b5b64df280ab596df9d0931c',
          message: `Hi ${result.firstname}`,
          dynamic_template_data: {
            resetPasswordLink: resetLink
          }
        };
        EmailController.sendMail(emailObject);
        return response.status(200)
          .json({
            status: 'success',
            message: 'Password reset details has been sent to your mail',
            token,
            link: resetLink,
          });
      })
      .catch(error => response.status(500)
        .json({
          status: 'failed',
          message: error
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

  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description verifies token from email
   * @returns {object} body
   * @memberof AuthController
   */
  static verifyUserEmail(request, response) {
    const token = jwt.sign({ userId: request.body.userId }, process.env.SECRET, {
      expiresIn: '1hr',
    });
    response.status(200)
      .json({
        message: 'Account verified successfully',
        token,
      });
  }
}
export default AuthController;
