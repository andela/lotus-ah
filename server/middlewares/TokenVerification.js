import jwt from 'jsonwebtoken';


const auth = {
  authenticate(user) {
    return jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET, {
      expiresIn: '48h',
    });
  },

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

  verifyUserToken(request, response, next) {
    const { token } = request.query;
    if (!token) return response.status(400).json({ status: 'failed', message: 'No token provided.' });

    const decoded = auth.verifyToken(token);
    if (decoded.error) return response.status(400).json({ status: 'failed', message: 'Failed to authenticate token.' });

    request.decoded = decoded;
    next();
  }
};

export default auth;
