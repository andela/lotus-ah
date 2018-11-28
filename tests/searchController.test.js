import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeder/userSeeder';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
const publish1 = {
  title: 'javascript',
  body: 'How I learnt javascript within a week',
  description: 'This is all about javascript',
  tags: [1]
};

before((done) => {
  chai.request(app)
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

describe('Testing Tag Controller', () => {
  it('should create tags', (done) => {
    chai.request(app)
      .post('/api/v1/tags')
      .set({
        'x-access-token': userToken,
      })
      .send({ name: 'javascript' })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('Tag was created');
        done();
      });
  });
  it('should get author by username', (done) => {
    chai.request(app)
      .get('/api/v1/search/author/DevOps')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All articles available');
        done();
      });
  });
  it('should get author by firstname', (done) => {
    chai.request(app)
      .get('/api/v1/search/author/DevOps')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All articles available');
        done();
      });
  });
  it('should get author by lastname', (done) => {
    chai.request(app)
      .get('/api/v1/search/author/DevOps')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All articles available');
        done();
      });
  });
  it('shouldnt get any author', (done) => {
    chai.request(app)
      .get('/api/v1/search/author/zthheghjwhrhjhbdmmbnbddf')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('We could not find any article');
        done();
      });
  });
  it('should get all tags', (done) => {
    chai.request(app)
      .get('/api/v1/search/tag/javascript')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('Tags with associated articles successfully obtained');
        done();
      });
  });
  it('should return tag doesnt exist', (done) => {
    chai.request(app)
      .get('/api/v1/search/tag/hfjhhhsrkhjsrhhhhhh')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('Tag name provided does not exist');
        done();
      });
  });
  it('should add a new article and attach tag', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(publish1)
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });
  it('should get Article through the title', (done) => {
    chai.request(app)
      .get('/api/v1/search/article/javascript')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All articles available');
        done();
      });
  });
  it('should get Article through the description', (done) => {
    chai.request(app)
      .get('/api/v1/search/article/This')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All articles available');
        done();
      });
  });
  it('shouldnt get any article', (done) => {
    chai.request(app)
      .get('/api/v1/search/article/Thishhfhdhhhdhhshjjjdj')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('We could not find any article');
        done();
      });
  });
});
