// third-party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';

// moduler importations
import app from '..';

chai.use(chaiHttp);
const { expect } = chai;
let tokenCollect;
const tokenFailed = 'bbfehfbeybdhvifnvf.fefwybhebvehvhevbh';
const userDetails = {
  firstname: 'chisom',
  lastname: 'obuladike',
  username: 'obulaworld',
  bio: 'A software Developer',
  password: 'georgina1'
};

const email = {
  email1: 'chisomobuladike@gmail.com',
  email2: 'chisom.obuladikeandela.com',
};
describe('User Controller', () => {
  it('should create a new user with just email', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ email: email.email1 })
      .end((error, result) => {
        const { token } = result.body;
        tokenCollect = token;
        expect(result.status).to.eql(201);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 existing email with isActivated = false', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ email: email.email1 })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for no email parameter', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ })
      .end((error, result) => {
        expect(result.status).to.not.eql(201);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 on user activation GET url with a valid token query parameter', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 on user activation GET url with an invalid token query parameter', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .query({ token: tokenFailed })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for invalid token on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send({ email: email.email2 })
      .end((error, result) => {
        expect(result.status).to.not.eql(201);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for valid token and invalid user details on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send({ email: email.email2 })
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.not.eql(201);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 for valid token and valid user details on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send(userDetails)
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for passing no token on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send(email.email2)
      .end((error, result) => {
        expect(result.status).to.not.eql(201);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for passing no token on user activation url', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .send(email.email2)
      .end((error, result) => {
        expect(result.status).to.not.eql(201);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });

  it('should return 400 for loging in with incorrect user details', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send({ email: email.email2, password: 'obulaworld' })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });

  it('should return 400 for loging in with incorrect password', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send({ email: 'femiade@gmail.com', password: '' })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body.message).equal('Password required.');
        done();
      });
  });
});
