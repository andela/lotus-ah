// import { User } from '../models';
// import passport from 'passport';
// import { LocalStrategy } from 'passport-local';
// import db from '../models';

// const { User } = db;
// // const passport = require('passport');
// // const LocalStrategy = require('passport-local').Strategy;
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: 'user[email]',
//       passwordField: 'user[password]'
//     },
//     ((email, password, done) => {
//       User.findOne({ email })
//         .then((user) => {
//           if (!user || !user.validPassword(password)) {
//             return done(null, false, {
//               errors: { 'email or password': 'is invalid' }
//             });
//           }

//           return done(null, user);
//         })
//         .catch(done);
//     })
//   )
// );