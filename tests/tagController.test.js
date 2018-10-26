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
const publish2 = {
  title: 'A short story',
  body: 'This story is ssooooo short',
  description: 'short',
  tags: [1, 2, 3, 4, 5, 6]
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
  it('should not accept an empty field name', (done) => {
    chai.request(app)
      .post('/api/v1/tags')
      .set({
        'x-access-token': userToken,
      })
      .send({ name: '' })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('object');
        done();
      });
  });
  it('should test rejections using then', (done) => {
    chai.request(app)
      .post('/api/v1/tags')
      .set({
        'x-access-token': userToken,
      })
      .send({ name: 'javascript' })
      .then(() => {
        throw new Error('test');
      })
      .catch(() => {
        done();
      });
  });
  it('should get all tags', (done) => {
    chai.request(app)
      .get('/api/v1/alltags')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equals('All tags available');
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
  it('should return error if tag is more than 5', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(publish2)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equals('failed');
        expect(res.body.message).to.equal('Tags should not exceed 5');
        done();
      });
  });
  it('should get articles associated to a tag by name', (done) => {
    chai.request(app)
      .get('/api/v1/articlebytagname/javascript')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Tags with associated articles successfully obtained');
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equals('success');
        return done();
      });
  });
  it('should return an error if the tagname doesnt exist', (done) => {
    chai.request(app)
      .get('/api/v1/articlebytagname/javript')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Tag name provided does not exist');
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equals('failed');
        return done();
      });
  });
  it('should get articles associated to a tag by Id', (done) => {
    chai.request(app)
      .get('/api/v1/articlebytagid/tag/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Tags with associated articles successfully obtained');
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equals('success');
        return done();
      });
  });
  it('should return an error if the tagId doesnt exist', (done) => {
    chai.request(app)
      .get('/api/v1/articlebytagid/tag/200')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal('Tag id provided does not exist');
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equals('failed');
        return done();
      });
  });
});
