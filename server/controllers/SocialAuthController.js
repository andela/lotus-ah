import jwt from 'jsonwebtoken';
import { User } from '../db/models';
import TokenVerification from '../middlewares/TokenVerification';

/**
* @static
* @param {object} request
* @param {object} response
* @return {object} user
* @memberof UserController
*/
function createOrFindUser(request, response) {
  const userProfile = request.user;
  // This checks if an authenticated user's profile is saved, if not create new user
  User
    .findOrCreate({
      where: { email: userProfile.emails[0].value },
      defaults: {
        username: userProfile.displayName,
        firstname: userProfile.displayName.split(' ')[0],
        lastname: userProfile.displayName.split(' ')[1],
        imageUrl: userProfile.photos[0].value,
        socialId: userProfile.id,
        provider: userProfile.provider,
        isActivated: true
      }
    })
    .spread((user, created) => {
      // User to return back in response
      const returnedUser = {
        user: {
          email: user.email,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          bio: user.bio,
          image: user.imageUrl
        }
      };
      // This checks if the user is just signing up on the platform or not
      if (created) {
        const token = TokenVerification.authenticate(user);
        returnedUser.user.token = token;
        returnedUser.message = 'User created successfully';
        const userToken = jwt.sign({
          returnedUser
        }, process.env.SECRET, {
          expiresIn: '48h',
        });
        response.status(201).redirect(`${process.env.FRONT_URL}?token=${userToken}`);
      } else {
        const token = TokenVerification.authenticate(user);
        returnedUser.user.token = token;
        returnedUser.message = 'User with email attached to this account already exist';

        const userToken = jwt.sign({
          returnedUser
        }, process.env.SECRET, {
          expiresIn: '48h',
        });
        response.status(200).redirect(`${process.env.FRONT_URL}?token=${userToken}`);
      }
    });
}

export default createOrFindUser;
