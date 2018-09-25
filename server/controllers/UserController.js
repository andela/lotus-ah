/**
 *
 *
 * @class UserController
 */
class UserController {
    /**
     *
     *
     * @static
     * @param {*} request
     * @param {*} response
     * @memberof UserController
     */
    static createUser (request, response) {
        response.status(200).json({
            message: 'user have been created successfully'
        })
    }
}

export default UserController;