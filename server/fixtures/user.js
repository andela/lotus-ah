import bcrypt from 'bcrypt';
import { User } from '../db/models';


/**
 * @param {object} request
 * @param {object} response
 * @returns {object} object
 *
*/

const createDummyUser = (request, response) => {
  const hash = bcrypt.hashSync('test1234', 10);
  User.create({
    email: 'test999@gmail.com',
    password: hash,
  }).then(() => response.status(200)
    .json({
      status: 'success',
      message: 'User created successfully',
    }))
    .catch();
};

export default createDummyUser;
