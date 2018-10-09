import jwt from 'jsonwebtoken';
import { User } from '../db/models';

const authenticate = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    }
  }).then((user) => {
    const payLoad = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(payLoad, 'secret', { expiresIn: '1hr' });
    res.status(200).json({
      message: 'Success',
      token,
    });
  }).catch(err => res.status(500).json({
    message: 'Failed',
    Error: err.toString(),
  }));
};
export default authenticate;
