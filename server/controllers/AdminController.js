
// module importaions
import { User } from '../db/models';


/**
* @class AdminController
*/
class AdminController {
  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Fetches all admins
  * @return {object} Object
  * @memberof AdminController
  */
  static fetchAll(request, response) {
    User.findAll({
      where: {
        roleId: 1
      },
    })
      .then(users => response.status(200).json({
        status: 'success',
        message: 'Request Successfull',
        users
      }))
      .catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Suspend a user by an admin
  * @return {object} user
  * @memberof AdminController
  */
  static suspendUser(request, response) {
    User.update(
      { isSuspended: true },
      { where: { id: request.params.id } }
    )
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User Suspended Successfully',
        user
      }))
      .catch(err => err.message);
  }


  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Changes the user role to admin
  * @return {object} user
  * @memberof AdminController
  */
  static makeAdmin(request, response) {
    User.update(
      { roleId: 1 },
      { where: { id: request.params.id } }
    )
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User role changed successfully',
        user
      }))
      .catch(err => err.message);
  }

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @description Changes the user role to admin
  * @return {object} user
  * @memberof AdminController
  */
  static stripAdmin(request, response) {
    User.update(
      { roleId: 2 },
      { where: { id: request.params.id } }
    )
      .then(user => response.status(200).json({
        status: 'success',
        message: 'User role changed successfully',
        user
      }))
      .catch(err => err.message);
  }
}
export default AdminController;
