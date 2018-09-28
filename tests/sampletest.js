import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;


describe('Dummy test', () => {
  it('should check if dummy test works', () => {
    expect('Authors Haven').to.be.a('string');
  });
});

const userObject = {
  firstname: 'calory',
  lastname: 'fish',
  bio: 'fortune for the week'
};
describe('Create User Account', () => {
  it('create account if feilds are valid', (done) => {
    chai.request(app)
      .post('/api/createuser')
      .send(userObject)
      .end((error, result) => {
        expect(result.status).to.eql(201);
        expect(result.body).to.be.a('object');
        done();
      });
  });
});
