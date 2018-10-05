import EmailController from '../controllers/EmailController';

const user = {
  id: 2,
  email: 'chukwuemeka.nwankwo@andela.com'
};

const test = {
  sendvalidationEmail(req, res) {
    const isSent = EmailController.validationEmail(user);
    if (isSent) {
      res.status(200).json({
        message: 'email was successfully sent',
      });
    }
  }

};
export default test;
