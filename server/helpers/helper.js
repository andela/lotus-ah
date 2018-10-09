import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
* @static
* @param {object} id
* @param {object} email
* @return {const} token
*/
function generateToken(id, email) {
  const token = jwt.sign(
    {
      email,
      userId: id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: '4h',
    },
  );
  return token;
}

const strategyCallback = (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

export { generateToken, strategyCallback };
