// third-party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';

// created server components
import server from '..';
import userSeeder from '../server/db/seeder/userSeeder';

// Follow model
import { Follow } from '../server/db/models';

const { expect } = chai;
chai.use(chaiHttp);

const followDetails = {
  followinId: 2,
  followerId: 1
};
let userToken;

before(userSeeder.emptyUserTable);
before(userSeeder.addUserToDb);
before(userSeeder.addSecondUserToDb);

before((done) => {
  chai.request(server)
    .post('/api/v1/login')
    .send(userSeeder.setLoginData(
      'nondefyde@gmail.com',
      'chigodwin1',
    )).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) return done(err);
      userToken = res.body.token;
      done();
    });
});

describe('POST /api/v1/profiles/:userId/follow', () => {
  it('it should not not allow follow if user is not authenticated i.e auth token not present', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${2}/follow`)
      .send(followDetails)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equals('failed');
        expect(res.body.message).equals('No token provided.');
        done();
      });
  });

  it('it should not allow follow if auth token is not valid', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${2}/follow`)
      .send(followDetails)
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

  it('user should not be able to follow themselves', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${1}/follow`)
      .send(followDetails)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).equals('User cannot follow him/herself');
        done();
      });
  });

  it('user should not be able to follow invalid user', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${200}/follow`)
      .send(followDetails)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).equals('Id in Url is incorrect');
        done();
      });
  });

  it('it should throw internal server error', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${null}/follow`)
      .send(followDetails)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).equals('Error processing request, please try again');
        done();
      });
  });

  it('it should return a valid response when presented with all parameters correctly', (done) => {
    chai
      .request(server)
      .post(`/api/v1/profiles/${2}/follow`)
      .send(followDetails)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.profile).to.have.property('username');
        expect(res.body.profile).to.have.property('image');
        expect(res.body.profile).to.have.property('bio');
        expect(res.body.profile.following).to.be.a('boolean');
        expect(res.body.profile)
          .to.have.property('following')
          .that.is.equal(true);
        done();
      });
  });
});

describe('DELETE /api/v1/profiles/:userId/unfollow', () => {
  it('it should not not allow unfollow if user is not authenticated i.e auth token not present', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/profiles/${2}/unfollow`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equals('failed');
        expect(res.body.message).equals('No token provided.');
        done();
      });
  });

  it('it should not allow unfollow if auth token is not valid', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/profiles/${2}/unfollow`)
      .set('x-access-token', 'jkbdkhjvsdvbjvjvjsvdvcj')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equal('failed');
        expect(res.body.message).equal('Failed to authenticate token.');
        done();
      });
  });

  it('user should not be able to unfollow invalid user', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/profiles/${200}/follow`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('it should throw internal server error', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/profiles/${null}/unfollow`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.message).equals('Error processing request, please try again');
        done();
      });
  });

  it('it should return a valid response when presented with all parameters correctly', (done) => {
    Follow.create({
      followinId: 2,
      followerId: 1
    }).then(() => {
      chai
        .request(server)
        .delete(`/api/v1/profiles/${2}/unfollow`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.profile).to.have.property('username');
          expect(res.body.profile).to.have.property('image');
          expect(res.body.profile).to.have.property('bio');
          expect(res.body.profile.following).to.be.a('boolean');
          expect(res.body.profile)
            .to.have.property('following')
            .that.is.equal(false);
          done();
        });
    });
  });
});

describe('GET /api/v1/profiles/followers', () => {
  it('it should not not list all followers if user is not authenticated i.e auth token not present', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/followers')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equals('failed');
        expect(res.body.message).equals('No token provided.');
        done();
      });
  });

  it('it should not list all followers if auth token is not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/followers')
      .set('x-access-token', 'jkbdkhjvsdvbjvjvjsvdvcj')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equal('failed');
        expect(res.body.message).equal('Failed to authenticate token.');
        done();
      });
  });

  it('it should return a valid followers list when presented with all parameters correctly', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/followers')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('followers');
        expect(res.body).to.have.property('followersCount');
        expect(res.body.followers).to.be.an('array');
        expect(res.body.followersCount).to.be.an('number');
        done();
      });
  });
});

describe('GET /api/v1/profiles/following', () => {
  it('it should not not list all following if user is not authenticated i.e auth token not present', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/following')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equals('failed');
        expect(res.body.message).equals('No token provided.');
        done();
      });
  });

  it('it should not list all following if auth token is not valid', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/following')
      .set('x-access-token', 'jkbdkhjvsdvbjvjvjsvdvcj')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).equal('failed');
        expect(res.body.message).equal('Failed to authenticate token.');
        done();
      });
  });

  it('it should return a valid following list when presented with all parameters correctly', (done) => {
    chai
      .request(server)
      .get('/api/v1/profiles/following')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('following');
        expect(res.body).to.have.property('followingCount');
        expect(res.body.following).to.be.an('array');
        expect(res.body.followingCount).to.be.an('number');
        done();
      });
  });
});
