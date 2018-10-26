import bcrypt from 'bcrypt';
import { User } from '../models';

const seeder = {
  setLoginData(email, password) {
    return { email, password };
  },
  addUserToDb(done) {
    const password = 'chigodwin1';
    bcrypt.hash(password, 10)
      .then((userHash) => {
        User.create({
          firstname: 'Okafor',
          lastname: 'Emmanuel',
          username: 'DevOps',
          email: 'nondefyde@gmail.com',
          password: userHash,
          roleId: 1,
        }).then(() => done());
      });
  },
  addSecondUserToDb(done) {
    const password = 'tiatiatia40';
    bcrypt.hash(password, 10)
      .then((userHash) => {
        User.create({
          firstName: 'Kunle',
          lastName: 'Adekunle',
          username: 'Backend',
          email: 'kunleadekunle@gmail.com',
          password: userHash
        }).then(() => done());
      });
  },

  emptyUserTable(done) {
    User.destroy({ truncate: true, cascade: true, restartIdentity: true })
      .then(() => done());
  },

  addAdminToDb(done) {
    const password = 'tiatiatia40';
    bcrypt.hash(password, 10)
      .then((userHash) => {
        User.create({
          firstName: 'Femi',
          lastName: 'AdeFemi',
          username: 'Backend',
          email: 'femiadefemi@gmail.com',
          roleId: 1,
          password: userHash
        }).then(() => done());
      });
  },
};

export default seeder;
