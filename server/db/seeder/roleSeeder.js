
import { Role } from '../models';

const roleSeeder = {
  addFirstRoleToDb(done) {
    Role.create({
      type: 'Admin',
    })
      .then(() => done())
      .catch(err => done(err));
  },
  addSecondRoleToDb(done) {
    Role.create({
      type: 'User',
    })
      .then(() => done())
      .catch(err => done(err));
  },
  addThirdRoleToDb(done) {
    Role.create({
      type: 'Author',
    })
      .then(() => done())
      .catch(err => done(err));
  },
};

export default roleSeeder;
