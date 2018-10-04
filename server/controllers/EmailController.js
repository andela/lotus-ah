import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

require('dotenv').config();

const key = process.env.SENDGRID_API_KEY;
const cert = process.env.SECRET;
const appUrl = process.env.APPURL;
/**
 *
 *
 * @class UserController
 */
class EmailController {
/**
* @static
* @param {object} user
* @return {boolean} result
* @description Sending email to users that signup
* @memberof EmailController
*/
  static validationEmail(user) {
    try {
      sgMail.setApiKey(key);
      const { email, id } = user;
      const emailToken = jwt.sign({ email, id }, cert, { expiresIn: '1h' });
      const url = `${appUrl}/api/users/confirmation?token=${emailToken}`;
      const msg = {
        to: email,
        from: 'authorhavencommunity@gmail.com',
        subject: 'Welcome to Authors Haven ',
        text: 'Just a step away',
        templateId: 'd-2b4ba0b023f84649af3486d921b40694',
        dynamic_template_data: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaW5lemVlNTRAZ21haWwuY29tIiwiaWQiOjEsImlhdCI6MTUzODU5NTc2NSwiZXhwIjoxNTM4NTk5MzY1fQ.0N0_7--X3DpHx739VePakIGndDJRrF1xV3saiJjRVFI', url }
      };
      const sentmail = sgMail.send(msg);
      if (sentmail) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
export default EmailController;
