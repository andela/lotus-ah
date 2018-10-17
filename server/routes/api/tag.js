

// THIRD-PARTY LIBRARY
import { Router } from 'express';


// modules import
import TagController from '../../controllers/TagController';


// middelwares;
import {
  tagValidation
} from '../../middlewares/inputValidator';
import Auth from '../../middlewares/TokenVerification';

const TagRoutes = Router();


// Route for Tags

TagRoutes.post('/tags',
  Auth.verifyUserToken,
  tagValidation,
  TagController.createTag);

TagRoutes.get('/alltags',
  Auth.verifyUserToken,
  TagController.getAllTag);

TagRoutes.get('/articlebytagid/tag/:id',
  Auth.verifyUserToken,
  TagController.getArticleByTagId);

TagRoutes.get('/articlebytagname/:name',
  Auth.verifyUserToken,
  TagController.getArticleByTagName);

export default TagRoutes;
