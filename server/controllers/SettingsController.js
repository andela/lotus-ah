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
  static unsbscribeNotification(req, res) {
    const userId = req.authUser.id;
    const { notificationType } = req.body;
    NotificationSubscription.update({
      userId,
      isSubscribed: false,
    },
    {
      where: { userId, notificationType, }
    }).then(() => res.status(200)
      .json({
        status: 'Success',
        message: `You have unsubscribed from reciving ${notificationType} notifications`
      }));
  }
}

export default SettingsController;
