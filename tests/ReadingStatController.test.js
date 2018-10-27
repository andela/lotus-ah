import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeder/userSeeder';
import articleSeeder from '../server/db/seeder/articleSeeder';

chai.use(chaiHttp);
const { expect } = chai;
before(userSeeder.addSecondUserToDb);
before(userSeeder.addThirdUserToDb);

let userToken2;
let userToken;
let articleId;
let articleSlug;

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
before((done) => {
  chai.request(app)
    .post('/api/v1/login')
    .send(userSeeder.setLoginData(
      'lotus@gmail.com',
      'lotus1234',
    )).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) return done(err);
      userToken2 = res.body.token;
      done();
    });
});

describe('User\'s reading statistics', () => {
  it('should add a new test article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        'Policemen of this days are not yet here!',
        `Doing good is right but is generally 
        not common habit you can find on any one cute`,
        'Doing good is right for you and I',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        articleId = res.body.createdArticle.id;
        articleSlug = res.body.createdArticle.slug;
        console.log('articleId', articleId);
        console.log('articleSlug', articleSlug);
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });
  it('Get article for a registered user', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${articleSlug}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Fetched a single user article');
        return done();
      });
  });
  it('Returns a users reading stats', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/reading/statistics')
      .set('Content-Type', 'application/json')
      .set({
        'x-access-token': userToken,
      })
      .set('Accept', 'application/json')
      .end((req, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Your reading statistics');
        done();
      });
  });
  it('Returns no statistics available', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/reading/statistics')
      .set('Content-Type', 'application/json')
      .set({
        'x-access-token': userToken2,
      })
      .set('Accept', 'application/json')
      .end((req, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('You recorded statistics available');
        done();
      });
  });
});
