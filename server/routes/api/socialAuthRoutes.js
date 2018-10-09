import { Router } from 'express';
import passport from 'passport';
import createOrFindUser from '../../controllers/SocialAuthController';

const socialAuthRoute = Router();
socialAuthRoute.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

socialAuthRoute.get('/google/redirect',
  passport.authenticate('google'), createOrFindUser);

socialAuthRoute.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

socialAuthRoute.get('/facebook/redirect',
  passport.authenticate('facebook'), createOrFindUser);

socialAuthRoute.get('/twitter',
  passport.authenticate('twitter', { scope: ['include_email=true', 'include_entities=false'] }));

socialAuthRoute.get('/twitter/redirect',
  passport.authenticate('twitter'), createOrFindUser);

export default socialAuthRoute;
