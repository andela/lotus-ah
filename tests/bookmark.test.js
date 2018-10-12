import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '..';

import userSeeder from '../server/db/seeders/userSeeder';

chai.use(chaiHttp);
const { expect } = chai;

before(userSeeder.addUserToDb);

let userToken = null;
const newArticle = {};


before((done) => {
  chai.request(app)
    .post('/api/v1/login')
    .send(userSeeder.setLoginData(
      'nondefyde@gmail.com',
      'chigodwin1',
    )).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      if (err) {
        done(err);
      }
      userToken = res.body.token;
      done();
    });
});

describe('Test Bookmark Endpoints', () => {
  it('should add a new article', (done) => {
    const createArticleObject = {
      title: 'Policemen of this days are not yet here!',
      body: `Doing good is right but is generally 
        not common habit you can find on any one cute`,
      description: 'Doing good is right for you and I',
      imageUrl: 'whtdebjbwwimg.jpg',
    };
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(createArticleObject)
      .end((err, res) => {
        const {
          message,
        } = res.body;
        newArticle.id = res.body.createdArticle.id;
        newArticle.slug = res.body.createdArticle.slug;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Published article successfully');
        done();
      });
  });

  it('should not bookmark an article that does not exist', (done) => {
    const requestBody = {
      id: 10,
      slug: 'The article',
    };
    chai.request(app)
      .post('/api/v1/me/bookmarks')
      .set({
        'x-access-token': userToken,
      })
      .send(requestBody)
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article does not exist');
        done();
      });
  });

  it('should bookmark an article', (done) => {
    chai.request(app)
      .post('/api/v1/me/bookmarks/')
      .set({
        'x-access-token': userToken,
      })
      .send(newArticle)
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Article bookmarked');
        done();
      });
  });

  it('should get all bookmarked article for a logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/me/bookmarks')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.result).to.be.an('array');
        expect(res.body.result[0].Article.id).to.equal(newArticle.id);
        done();
      });
  });

  it('should get a single bookmarked article for a logged in user', (done) => {
    const articleBookmarkId = 1;
    chai.request(app)
      .get(`/api/v1/me/bookmarks/${articleBookmarkId}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.result).to.be.an('array');
        expect(res.body.result[0].Article.id).to.equal(newArticle.id);
        expect(res.body.result[0].Article.title).to.equal(
          'Policemen of this days are not yet here!'
        );
        done();
      });
  });

  it('should delete bookmarked article for a user', (done) => {
    const bookmarkId = 1;
    chai.request(app)
      .delete(`/api/v1/me/bookmarks/${bookmarkId}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Article removed from bookmark');
        done();
      });
  });
  it('should not get a single bookmark that does not exist', (done) => {
    const bookmarkId = 1;
    chai.request(app)
      .get(`/api/v1/me/bookmarks/${bookmarkId}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.result).to.be.an('array');
        expect(res.body.result.length).to.equal(0);
        done();
      });
  });
});
