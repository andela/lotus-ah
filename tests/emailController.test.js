import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;
const email = {
  email1: 'chosomobuladike@gmail.com'
};

describe('Testing the email Controller', () => {
  it('Should return a true', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ email: email.email1 })
      .end((error, response) => {
        expect(response.body.message).to.be.an('string');
        expect(response).to.have.status(201);
        done();
      });
  });
});
