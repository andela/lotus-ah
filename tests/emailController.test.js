import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';

chai.use(chaiHttp);
const { expect } = chai;


describe('Testing the email Controller', () => {
  it('Should return a true', (done) => {
    chai.request(app)
      .get('/api/verificationemail')
      .end((error, response) => {
        expect(response.body.message).to.be.an('string');
        expect(response).to.have.status(200);
        done();
      });
  });
});
