import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { mockedUser } from '../server/helpers/mockStrategy';

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /auth/facebook', () => {
  it('should return a user object when user successfully authenticates facebook', (done) => {
    chai
      .request(server)
      .get('/api/v1/auth/facebook/redirect')
      .end((err, res) => {
        expect(res).to.have.status(200);
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
        expect(res).to.have.status(200);
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
        expect(res).to.have.status(200);
        done();
      });
  });
});
