
import { Role } from '../models';

const roleSeeder = {
  addFirstRoleToDb(done) {
    Role.create({
      type: 'ADMIN',
    })
      .then(() => done())
      .catch(err => done(err));
  },
  addSecondRoleToDb(done) {
    Role.create({
      type: 'USER',
    })
      .then(() => done())
      .catch(err => done(err));
  },
  addThirdRoleToDb(done) {
    Role.create({
      type: 'AUTHOR',
    })
      .then(() => done())
      .catch(err => done(err));
  },
};

export default roleSeeder;
