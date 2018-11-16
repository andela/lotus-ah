import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';


require('dotenv').config();

const key = process.env.SENDGRID_API_KEY;
const cert = process.env.SECRET;
/**
 * @description sends email with SendGrid
 * @class UserController
 */
class EmailController {
/**
* @static
* @param {object} user
* @param {onject} request
* @return {boolean} result
* @description Sending email to users that signup
* @memberof EmailController
*/
  static sendVerificationEmail(user, request) {
    const { email, id } = user;
    const emailToken = jwt.sign({ email, id }, cert, { expiresIn: '1h' });
    const data = {};
    data.token = emailToken;

    const serverActivationLink = `${process.env.BASE_URL}/api/v1/users?token=${emailToken}`;
    const clientActivationLink = request.query.callBack;

    const activationLink = clientActivationLink ? `${clientActivationLink}?token=${emailToken}` : serverActivationLink;
    const emailObject = [{
      to: email,
      from: 'authorhavencommunity@gmail.com',
      subject: "Welcome to Author's Haven",
      text: 'Hello',
      templateId: 'd-c29248e430734bf59d3fdd8f107a9b2c',
      dynamic_template_data: { activationLink, token: emailToken }
    }];
    const isMailsent = this.sendMail(emailObject);
    if (isMailsent) {
      return { token: data.token, success: true };
    }
    return { token: data.token, success: false };
  }

  /**
   * @param {object} emailObject
   * @description sends email to a single user or array of users
   * @memberof EmailController
   * @returns {object} object
   */
  static sendMail(emailObject) {
    try {
      sgMail.setApiKey(key);
      if (Array.isArray(emailObject)) {
        return sgMail.sendMultiple(emailObject);
      }
      return sgMail.send(emailObject);
    } catch (error) {
      return false;
    }
  }
}
export default EmailController;
