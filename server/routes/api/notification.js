// Core modules
import { Router } from 'express';

// Controllers
import NotificationController from '../../controllers/NotificationController';
import SettingsController from '../../controllers/SettingsController';

// Middleare
import auth from '../../middlewares/TokenVerification';
import fetchUser from '../../middlewares/fetchUser';

const notificationRouter = Router();

notificationRouter.get(
  '/me/notifications/:id',
  auth.verifyUserToken,
  NotificationController.getUserNotificationById,
);
notificationRouter.get(
  '/me/notifications',
  auth.verifyUserToken,
  NotificationController.getAllNotification,
);

notificationRouter.put(
  '/me/notifications/:id',
  auth.verifyUserToken,
  fetchUser,
  NotificationController.markNotificationAsRead,
);

notificationRouter.put(
  '/me/notifications',
  auth.verifyUserToken,
  fetchUser,
  NotificationController.markAllAsRead,
);

notificationRouter.put(
  '/me/settings/notifications',
  auth.verifyUserToken,
  fetchUser,
  SettingsController.updateNotificationSubscription
);

export default notificationRouter;
