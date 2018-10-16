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
        console.log(response.body);
        responseObject.link = response.body.link;
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
        responseObject.link = response.body.link;
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
        expect(response.body.status).to.equals('success');
        expect(response.body.message).to.equals('Password reset details has been sent to your mail');
        expect(response.body).to.be.an('object');
        done();
      });
  });
});


describe('Testing change password route', () => {
  it('Should not change password when token on the link is not valid', (done) => {
    const token = 'e.sgvdhjcxabjsbzcjHBHJBHknjkfnjksnjfnesZFCHDBJNKSNDK';
    chai.request(app)
      .put(`/api/v1//auth/reset_password?token=${token}`)
      .send({ password: 'test12345', confirmPassword: 'test12345' })
      .end((error, response) => {
        expect(response.body).to.be.an('object');
        expect(response.status).to.equals(401);
        expect(response.body.message).to.equals('Failed to authenticate');
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
