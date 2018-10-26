// Import modules
import EmailController from './EmailController';
import {
  User,
  Follow,
  Notification,
  FavoriteArticle,
  NotificationSubscription,
  NotificationType,
} from '../db/models';


/**
 * @class NotificationController
 * @description sends email notification
*/
class NotificationController {
  /**
   * @static
   * @param {integer} userId
   * @description setup defaul subscription for a new user
   * @memberof NotificationController
   * @returns {void}
   */
  static setupUserSubsscription(userId) {
    NotificationType.findAll({
      attributes: [
        'id',
        'title',
      ]
    }).then((notifTypes) => {
      const userSubscribtions = notifTypes
        .map(notificationTitle => ({
          userId,
          notificationType: notificationTitle.dataValues.title,
        }));
      return NotificationSubscription.bulkCreate(userSubscribtions);
    });
  }

  /**
   * @description create notification
   * @param {object} user
   * @param {object} prepareData
   * @returns {boolean} true
   */
  static prepareSingleUserEmail(user, prepareData) {
    const data = prepareData;
    data.user = user;
    const singleUser = {
      to: user.email,
      from: 'authorhavencommunity@gmail.com',
      subject: 'New Publication',
      templateId: data.templateId,
      dynamic_template_data: {
        data,
      }
    };
    return singleUser;
  }

  /**
   * @description sends notification to selected users
   * @param {object} users
   * @param {integer} data
   * @returns {object} object
  */
  static sendEmailNotification(users, data) {
    const templateArray = users
      .map(user => NotificationController.prepareSingleUserEmail(user, data));
    return EmailController.sendMail(templateArray)
      .then(result => result[0])
      .catch(err => err[0]);
  }

  /**
   * @description send notification to users
   * @param {object} notify
   * @param {object} title
   * @returns {boolean} true
   */
  static notifyFollowers({ followerType, notify }) {
    if (followerType === 'authorFollowers') {
      Follow.findAndCountAll({
        include: [
          {
            model: User,
            include: [
              {
                model: NotificationSubscription,
                as: 'subscriptions',
                where: {
                  notificationType: notify.type,
                  isSubscribed: true,
                }
              }
            ],
            attributes: [
              'email',
              'id',
              'firstname',
            ]
          }
        ],
        where: {
          followinId: notify.author.id,
        }
      }).then((followers) => {
        const authorFollowers = followers.rows
          .filter(result => result.User !== null)
          .map(userRow => ({
            id: userRow.dataValues.id,
            firstname: userRow.User.dataValues.firstname,
            email: userRow.User.dataValues.email,
          }));
        if (authorFollowers.length === 0) {
          return;
        }
        const data = notify;
        data.templateId = 'd-4823986320904dc3b623fec5f9c56829';
        this.createBulkNotification(authorFollowers, `${data.message}`);
        this.sendEmailNotification(authorFollowers, data);
      });
      return true;
    }
    if (followerType === 'article') {
      FavoriteArticle.findAndCountAll({
        include: [
          {
            model: User,
            as: 'users',
            include: [
              {
                model: NotificationSubscription,
                as: 'subscriptions',
                where: {
                  notificationType: notify.type,
                  isSubscribed: true,
                }
              }
            ],
            attributes: [
              'email',
              'id',
              'firstname',
            ]
          }
        ],
        where: {
          articleId: notify.articleId,
        }
      }).then((followers) => {
        const articleFollowers = followers.rows
          .filter(result => result.users !== null)
          .map(userRow => ({
            id: userRow.users.dataValues.id,
            firstname: userRow.users.dataValues.firstname,
            email: userRow.users.dataValues.email,
          }));
        // If an author liked or commented on own article don't nofify him
        if (notify.author.id !== notify.authenticatedUser.id) {
          articleFollowers.push(notify.author);
        }
        if (articleFollowers.length === 0) {
          return;
        }
        const data = notify;
        data.templateId = 'd-4823986320904dc3b623fec5f9c56829';
        this.createBulkNotification(articleFollowers, `${data.message}`);
        this.sendEmailNotification(articleFollowers, data);
      });
    }
  }


  /**
   * @static
   * @param {object} notify
   * @param {object} userId
   * @description create notification for a single user in the database
   * @memberof NotificationController
   * @returns {void}
   */
  static notifyUser(notify, userId) {
    const data = notify;
    Notification.create({
      userId,
      message: notify.message,
    }).then(() => {
      const emailData = this.prepareSingleUserEmail(
        notify.user, data
      );
      EmailController.sendMail([emailData]);
    }).catch(err => err);
  }

  /**
   * @description create bulk for many users in the database
   * @param {object} users
   * @param {object} message
   * @returns {boolean} true
   */
  static createBulkNotification(users, message) {
    const notification = users.map(user => ({
      userId: user.id,
      message,
    }));
    return Notification.bulkCreate(notification, { returning: true })
      .then(() => true)
      .catch(() => false);
  }

  /**
   * @description get all unread notification
   * @param {object} req
   * @param {object} res
   * @returns {boolean} true
   */
  static getAllNotification(req, res) {
    const userId = req.decoded.id;
    Notification.findAndCountAll({
      where: {
        userId,
        isRead: false,
      }
    })
      .then((notification) => {
        res.status(200)
          .json({
            status: 'Success',
            notifications: notification,
          });
      })
      .catch(() => res.status(500)
        .json({
          status: 'Success',
          message: 'Problem getting notifications',
        }));
  }

  /**
   * @description get unread user notification by Id
   * @param {object} req
   * @param {object} res
   * @returns {boolean} true
   */
  static getUserNotificationById(req, res) {
    const userId = req.decoded.id;
    const { id } = req.params;
    Notification.findOne({
      where: {
        userId,
        id,
      }
    })
      .then((notification) => {
        Notification.update({
          isRead: true,
        }, {
          where: {
            userId,
            id,
          }
        })
          .then()
          .catch(error => error);
        return res.status(200)
          .json({
            status: 'Success',
            notifications: notification,
          });
      })
      .catch(() => res.status(500)
        .json({
          status: 'Failed',
          message: 'Problem getting notifications',
        }));
  }

  /**
   * @description mark notification as read
   * @param {object} req
   * @param {integer} res
   * @returns {boolean} true
   */
  static markNotificationAsRead(req, res) {
    const notificationId = req.params.id;
    const userId = req.authUser.id;
    Notification.update({
      isRead: true,
    }, {
      where: {
        userId,
        id: notificationId,
      }
    })
      .then(() => res.status(201)
        .json({
          status: 'Succes',
          message: 'Notification marked as read',
        }))
      .catch(error => error);
  }
}

export default NotificationController;
