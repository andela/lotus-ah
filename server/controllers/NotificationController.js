
// User model
import { Notification, User, Follow } from '../db/models';


// import EmailController from './EmailController';


/**
 *
 *
 * @class NotificationController
 * @description This clas handles all notifications
 */
class NotificationController {
  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description verifies that user exists
   * @return {object} response
   * @memberof AuthController
   */
  static createNotification(request, response) {
    const userId = 1;
    // Replace user ID with id from token
    Notification.create({
      userId,
      notificationTypeId: 1,
    })
      .then(() => {
        // Send mail
        return Follow.findAll({
          include: [{
            model: User
          }],
          where: {
            followinId: userId
          }
        });
      }).then(followers => response.status(200)
        .json({ myFollowers: followers.map(myFollower => myFollower.User.email) }))
      // EmailController.validationEmail(result);
      .catch(error => console.log(error));
  }


  /**
   * @static
   * @param {object} request
   * @param {object} response
   * @description resets user password
   * @returns {object} body
   * @memberof AuthController
   */
  static resetPassword() {

  }
}
export default NotificationController;
