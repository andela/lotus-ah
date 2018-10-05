import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../db/models';
// const GoogleStrategy = passportGoogle.Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      callbackURL: '/api/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // console.log('we are in the callback function for google');
      // console.log(profile);
      // console.log(profile.emails[0].value);
      User
        .findOrCreate({
          where: { email: profile.emails[0] },
          defaults: { username: profile.displayName }
        })
        .spread((user, created) => {
          console.log(user.get({
            plain: true
          }));
          console.log(created);
        });
      done(null, profile);
    }
  )

);

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/api/auth/twitter/redirect',
  includeEmail: true
},
  ((token, tokenSecret, profile, done) => {
    console.log('we are in the callback for twitter');
    console.log(profile);
    console.log(profile.emails[0].value);
    done();
  })));

passport.use(
  new FacebookStrategy(
    {
      // options for google strategy
      callbackURL: '/api/auth/facebook/redirect',
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profileFields: ['id', 'displayName', 'photos', 'email']
    }, (accessToken, refreshToken, profile, done) => {
      // passport callback function
      console.log('we are in the callback function for facebook');
      console.log(profile);
      done(null, profile);
    }
  )

);
