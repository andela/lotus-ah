import dotenv from 'dotenv';

dotenv.config();

const strategyCallback = (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

export default strategyCallback;
