import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';


chai.use(chaiHttp);
const { expect } = chai;


const responseObject = {};


describe('Testing forgot password route', () => {
  it('Should create dummy user', (done) => {
    chai.request(app)
      .post('/api/v1/create_dummy_user')
      .send({ email: 'test999@gmail.com' })
      .end((error, response) => {
        expect(response.body.status).to.equals('success');
        expect(response.body.message).to.equals('User created successfully');
        expect(response.body).to.be.an('object');
        done();
      });
  });
  it('Should not return a reset password link with user not found', (done) => {
    chai.request(app)
      .post('/api/v1/auth/forgot_password')
      .send({ email: 'goziem999@gmail.com' })
      .end((error, response) => {
        expect(response.body.status).to.equals('success');
        expect(response.status).to.equals(404);
        expect(response.body.message).to.equals('No user with email found');
        expect(response.body).to.be.an('object');
        done();
      });
  });

  it('Should return a reset password link', (done) => {
    chai.request(app)
      .post('/api/v1/auth/forgot_password')
      .send({ email: 'test999@gmail.com' })
      .end((error, response) => {
        responseObject.link = response.body.link;
        responseObject.token = response.body.token;
        expect(response.body.status).to.equals('success');
        expect(response.body.message).to.equals('Password reset details has been sent to your mail');
        expect(response.body).to.be.an('object');
        done();
      });
  });

  it('Should send mail and return a token', (done) => {
    chai.request(app)
      .get(`/api/v1/auth/forgot_password?token=${responseObject.token}`)
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        responseObject.token = response.body.token;
        expect(response.status).to.equals(200);
        expect(response.body.message).to.equals('Account verified successfully');
        done();
      });
  });
});


describe('Testing change password route', () => {
  it('Should not change password when token on the link is not valid', (done) => {
    const token = 'e.sgvdhjcxabjsbzcjHBHJBHknjkfnjksnjfnesZFCHDBJNKSNDK';
    chai.request(app)
      .put(`/api/v1/auth/reset_password?token=${token}`)
      .send({ password: 'test12345', confirmPassword: 'test12345' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.status).to.equals(401);
        expect(response.body.message).to.equals('Failed to authenticate');
        done();
      });
  });
  it('Should not change password when password is undefined', (done) => {
    chai.request(app)
      .put(`${responseObject.link}`)
      .send({ confirmPassword: 'test12675' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.status).to.equals(422);
        expect(response.body.message).to.equals('Password is required');
        done();
      });
  });

  it('Should not change password when password length is less than 6', (done) => {
    chai.request(app)
      .put(`${responseObject.link}`)
      .send({ password: 'test', confirmPassword: 'test12345' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.status).to.equals(422);
        expect(response.body.message).to.equals('Password should be a minimum of 6 characters');
        done();
      });
  });

  it("Should not change password when password doesn't match", (done) => {
    chai.request(app)
      .put(`${responseObject.link}`)
      .send({ password: 'test12345', confirmPassword: 'test12675' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.equals("Password doesn't match");
        done();
      });
  });

  it('Should change password', (done) => {
    chai.request(app)
      .put(`${responseObject.link}`)
      .send({ password: 'test12345', confirmPassword: 'test12345' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.equals('Password changed successfully');
        done();
      });
  });
});
