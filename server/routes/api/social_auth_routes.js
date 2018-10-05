import { Router } from 'express';
import passport from 'passport';

const socialAuthRoute = Router();
socialAuthRoute.get('/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email']
}));

socialAuthRoute.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  // On succesful authentication redirect to the main page
  res.send(req.user);
});

socialAuthRoute.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

socialAuthRoute.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  // On succesful authentication redirect to the main page
  res.send(req.user);
});

socialAuthRoute.get('/twitter', passport.authenticate('twitter', { scope: ['include_email=true'] }));

socialAuthRoute.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
  // On succesful authentication redirect to the main page
  res.redirect('/');
});
export default socialAuthRoute;
