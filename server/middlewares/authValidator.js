// Third party libraries
import jwt from 'jsonwebtoken';


/**
 * @object
 * @description contaions method to validate password reset
*/
const validator = {

/**
 * @param {object} request
 * @param {object} response
 * @param {funtion} next
 * @description Verifies password token
 * @returns {object} object
*/
  verifyRestPasswordToken: (request, response, next) => {
    const { token } = request.query;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        response.status(401)
          .json({
            message: 'Failed to authenticate',
            error: err.message,
          });
        return;
      }
      request.body.userId = decoded.userId;
      next();
    });
  },
  /**
   * @param {object} request
   * @param {object} response
   * @param {functin} next
   * @description validates password
   * @returns {object} object
   *
  */
  checkPassword: (request, response, next) => {
    const { password, confirmPassword } = request.body;
    if (password === undefined) {
      return response.status(422).json({
        status: 'Failed',
        message: 'Password is required',
      });
    }
    const pass = password.replace(/^\s+|\s+$/g, '');
    if (pass === '' || pass.length < 6) {
      return response.status(422).json({
        status: 'Failed',
        message: 'should be a minimum of 6 characters',
      });
    }
    if (pass !== confirmPassword) {
      return response.status(422).json({
        status: 'failed',
        message: "Password doesn't match",
      });
    }
    request.body.newPassword = pass;
    next();
  }
};

export default validator;
