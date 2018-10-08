// module importaions
import { User } from '../db/models';

const validation = {
  /**
    * @static
    * @param {object} request
    * @param {object} response
    * @param {function} next
    * @description Checks if user is an admin
    * @return {object} object
    * @memberof AdminValidation
    */
  checkAdmin(request, response, next) {
    User.findOne({
      where: {
        id: request.decoded.id,
      },
      attributes: ['roleId']
    })
      .then((user) => {
        console.log('user', user);
        if (user && (user.dataValues.roleId !== 1)) {
          response.status(401).json({
            status: 'failed',
            message: 'User is not an admin',
          });
        } else if (user && (user.dataValues.roleId === 1)) {
          next();
        } else {
          response.status(400).json({
            status: 'failed',
            message: 'User does not exist'
          });
        }
      }).catch((err) => { console.log(err.message); });
  },

  /**
    * @static
    * @param {object} request
    * @param {object} response
    * @param {function} next
    * @description Checks if user exists
    * @return {object} object
    * @memberof AdminValidation
    */
  checkUser(request, response, next) {
    User.findOne({
      where: {
        id: request.params.id,
      },
    })
      .then((user) => {
        if (user) {
          next();
        } else {
          response.status(400).json({
            status: 'failed',
            message: 'User does not exist'
          });
        }
      }).catch((err) => { console.log(err.message); });
  },


};

export default validation;
