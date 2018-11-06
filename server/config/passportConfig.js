import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../db/models';
import strategyCallback from '../helpers/helper';
import { Strategy as MockStrategy } from '../helpers/mockStrategy';

// Setting up passport configuration
const setupPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

  const facebookMockStrategy = new MockStrategy('facebook', strategyCallback);
  const googleMockStrategy = new MockStrategy('google', strategyCallback);
  const twitterMockStrategy = new MockStrategy('twitter', strategyCallback);

  const facebookStrategy = process.env.NODE_ENV === 'test' ? facebookMockStrategy : new FacebookStrategy(
    {
    // options for facebook strategy
      callbackURL: `${process.env.BACK_URL}/api/v1/auth/facebook/redirect`,
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profileFields: ['id', 'name', 'displayName', 'photos', 'email']
    }, strategyCallback
  );
  const twitterStrategy = process.env.NODE_ENV === 'test' ? twitterMockStrategy : new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BACK_URL}/api/v1/auth/twitter/redirect`,
      includeEmail: true,
      includeName: true
    }, strategyCallback
  );
  const googleStrategy = process.env.NODE_ENV === 'test' ? googleMockStrategy : new GoogleStrategy(
    {
    // options for google strategy
      callbackURL: `${process.env.BACK_URL}/api/v1/auth/google/redirect`,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, strategyCallback
  );
  passport.use(twitterStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
};

export default setupPassport;
