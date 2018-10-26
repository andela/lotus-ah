import {
  NotificationSubscription,
} from '../db/models';


/**
 * @class SettingsController
 * @description sends email notification
*/
class SettingsController {
  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @memberof SettingsController
   * @returns {objec} response
   */
  static updateNotificationSubscription(req, res) {
    const userId = req.authUser.id;
    const { notificationType, subscribe } = req.body;
    let message = `You have subscribed to receiving ${notificationType} notifications`;
    const isSubscribed = (subscribe === 'true');
    if (!subscribe) {
      message = `You have unsubscribed from reciving ${notificationType} notifications`;
    }
    NotificationSubscription.update({
      userId,
      isSubscribed,
    },
    {
      where: { userId, notificationType, }
    }).then(() => res.status(200)
      .json({
        status: 'Success',
        message,
      }));
  }
}

export default SettingsController;
