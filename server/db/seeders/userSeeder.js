import bcrypt from 'bcrypt';
import { User } from '../models';

const seeder = {
  emptyUserTable(done) {
    User.destroy({ truncate: true, cascade: true, restartIdentity: true })
      .then(() => done())
      .catch(err => done(err));
  },
  setSignUpData(
    firstName, username, lastName, email, password, bio
  ) {
    return {
      email,
      password,
      firstName,
      username,
      lastName,
      bio
    };
  },
  setLoginData(email, password) {
    return { email, password };
  },
  setInitData(email) {
    return { email };
  },
  addUserToDb(done) {
    const password = 'chigodwin1';
    bcrypt.hash(password, 10)
      .then((userHash) => {
        User.create({
          firstName: 'Okafor',
          lastName: 'Emmanuel',
          username: 'DevOps',
          email: 'nondefyde@gmail.com',
          password: userHash
        }).then(() => done())
          .catch(err => done(err));
      })
      .catch(err => err);
  }
};

export default seeder;
