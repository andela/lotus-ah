// Core modules
import { Router } from 'express';

// Controllers
import BookMarkController from '../../controllers/BookmarkController';

// Middleare
import auth from '../../middlewares/TokenVerification';

const bookmarkRouter = Router();

bookmarkRouter.post(
  '/me/bookmarks',
  auth.verifyUserToken,
  BookMarkController.bookmark
);

bookmarkRouter.delete(
  '/me/bookmarks/:id',
  auth.verifyUserToken,
  BookMarkController.removeBookmark
);
bookmarkRouter.get(
  '/me/bookmarks/:id',
  auth.verifyUserToken,
  BookMarkController.getBookmarkById,
);
bookmarkRouter.get(
  '/me/bookmarks',
  auth.verifyUserToken,
  BookMarkController.getAllBookmark,
);

export default bookmarkRouter;
