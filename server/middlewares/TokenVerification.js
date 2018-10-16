// third-party libraries
import jwt from 'jsonwebtoken';


const auth = {
  /**
  * @static
  * @param {object} user
  * @description Generates token for user
  * @return {string} string
  */
  authenticate(user) {
    return jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET, {
      expiresIn: '48h',
    });
  },

  /**
  * @static
  * @param {string} token
  * @description Verifies user token
  * @return {object} object
  */
  verifyToken(token) {
    let decoded = {};
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      decoded = {
        error: error.message,
      };
    }
    return decoded;
  },

  /**
  * @static
  * @param {object} request
  * @param {object} response
  * @param {function} next
  * @description Verifies user token
  * @return {object} object
  */
  verifyUserToken(request, response, next) {
    const token = request.query.token || request.body.token || request.headers['x-access-token'];
    if (!token) {
      return response.status(401).json({
        status: 'failed',
        message: 'No token provided.'
      });
    }

    const decoded = auth.verifyToken(token);
    if (decoded.error) {
      return response.status(401).json({
        status: 'failed',
        message: 'Failed to authenticate token.'
      });
    }

    request.decoded = decoded;
    next();
  }
};

export default auth;
