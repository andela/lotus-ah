import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { mockedUser } from '../server/helpers/mockStrategy';
import { User } from '../server/db/models';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /auth/facebook', () => {
  it('should return a user object when user successfully authenticates facebook', (done) => {
    chai
      .request(server)
      .get('/api/v1/auth/facebook/redirect')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.user).to.have.property('token');
        expect(res.body.user).to.have.property('image');
        expect(res.body.user).to.have.property('bio');
        expect(res.body.user.token).to.be.a('string');
        expect(res.body.user)
          .to.have.property('email')
          .that.is.equal('jamiuadele@gmail.com');
        done();
      });
  });
});

describe('GET /auth/google', () => {
  it('should return a user object when user successfully authenticates google', (done) => {
    mockedUser.emails = [{ value: 'joshua@gmail.com' }];
    chai
      .request(server)
      .get('/api/v1/auth/google/redirect')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.user).to.have.property('token');
        expect(res.body.user).to.have.property('image');
        expect(res.body.user).to.have.property('bio');
        expect(res.body.user.token).to.be.a('string');
        expect(res.body.user)
          .to.have.property('email')
          .that.is.equal('joshua@gmail.com');
        done();
      });
  });
});

describe('GET /auth/twitter', () => {
  it('should return a user object when user successfully authenticates with twitter', (done) => {
    mockedUser.emails = [{ value: 'joseph@gmail.com' }];
    chai
      .request(server)
      .get('/api/v1/auth/twitter/redirect')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.user).to.have.property('token');
        expect(res.body.user).to.have.property('image');
        expect(res.body.user).to.have.property('bio');
        expect(res.body.user.token).to.be.a('string');
        expect(res.body.user)
          .to.have.property('email')
          .that.is.equal('joseph@gmail.com');
        done();
      });
  });
});

describe('GET /auth/*', () => {
  it('should return a user object when user successfully authenticates with twitter', (done) => {
    mockedUser.emails = [{ value: 'joseph@gmail.com' }];
    User.create({ email: 'joseph@gmail.com', username: 'joseph' })
      .then(() => {
        chai
          .request(server)
          .get('/api/v1/auth/twitter/redirect')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.user).to.have.property('token');
            expect(res.body.user).to.have.property('image');
            expect(res.body.user).to.have.property('bio');
            expect(res.body.user.token).to.be.a('string');
            expect(res.body.user)
              .to.have.property('email')
              .that.is.equal('joseph@gmail.com');
            expect(res.body.message).equals('User with email attached to this account already exist');
            done();
          });
      });
  });
});
