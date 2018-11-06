// third-party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';

// created server components
import server from '..';
import userSeeder from '../server/db/seeder/userSeeder';

const { expect } = chai;
chai.use(chaiHttp);

const fakeToken = jwt.sign({
  id: 0,
  email: 'lekeleke@gmail.com',
}, process.env.SECRET, {
  expiresIn: '48h',
});

let profileToken;
let adminToken;

before(userSeeder.emptyUserTable);
before(userSeeder.addUserToDb);
before(userSeeder.addSecondUserToDb);
before(userSeeder.addAdminToDb);

before((done) => {
  chai.request(server)
    .post('/api/v1/login')
    .send(userSeeder.setLoginData(
      'kunleadekunle@gmail.com',
      'tiatiatia40',
    )).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) return done(err);
      profileToken = res.body.token;
      done();
    });
});

before((done) => {
  chai.request(server)
    .post('/api/v1/login')
    .send(userSeeder.setLoginData(
      'nondefyde@gmail.com',
      'chigodwin1',
    )).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) return done(err);
      adminToken = res.body.token;
      done();
    });
});

describe('GET /api/v1/profiles', () => {
  it('should not list users if user is not authenticated', (done) => {
    chai
      .request(server)
      .get(`/api/v1/profiles/all/${1}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equals('failed');
        expect(res.body.message).equals('No token provided.');
        done();
      });
  });

  it('it should not list users if auth token is not valid', (done) => {
    chai
      .request(server)
      .get(`/api/v1/profiles/all/${1}`)
      .set({
        'x-access-token': 'bdfbjhsbvdvhjvdsjvsvdv',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equal('failed');
        expect(res.body.message).equal('Failed to authenticate token.');
        done();
      });
  });

  it('it should not list users if user is not an admin', (done) => {
    chai
      .request(server)
      .get(`/api/v1/profiles/all/${1}`)
      .set({
        'x-access-token': profileToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).equals('Protected route, Not an admin');
        done();
      });
  });

  it('it should return a list of users', (done) => {
    chai
      .request(server)
      .get(`/api/v1/profiles/all/${1}`)
      .set({
        'x-access-token': adminToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.profiles).to.be.an('array');
        expect(res.body.profilesCount).to.be.an('number');
        done();
      });
  });

  it('should return 400 for getting user profile with non existing id', (done) => {
    chai.request(server)
      .get(`/api/v1/profiles/${100}`)
      .set({
        'x-access-token': adminToken,
      })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });

  it('should return 400 for getting user profile with a nonnumeric id', (done) => {
    chai.request(server)
      .get('/api/v1/profiles/id')
      .set({
        'x-access-token': adminToken,
      })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });

  it('should return 401 for updating user profile with wrong token', (done) => {
    chai.request(server)
      .put('/api/v1/profiles/1')
      .set('x-access-token', 'bhbhbdvhfvhfvbfhbvfvbhvbfh')
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 for updating user profile with wrong user', (done) => {
    chai.request(server)
      .put('/api/v1/profiles/1')
      .set({
        'x-access-token': fakeToken,
      })
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });
});
