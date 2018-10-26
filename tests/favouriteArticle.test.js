import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeder/userSeeder';
import articleSeeder from '../server/db/seeder/articleSeeder';

chai.use(chaiHttp);
const { expect } = chai;


let userToken;
let articleSlug;

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

describe('Test article Controller', () => {
  it('should add an article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        'The learning',
        'Why do you learn',
        'Learning is good',
        'sim_pro.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        articleSlug = res.body.createdArticle.slug;
        expect(res.status).to.equal(201);
        expect(message).to.equal('Published article successfully');
        done();
      });
  });

  it('should add article to user favorites', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/favourite`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Article added to favorite');
        done();
      });
  });

  it('should not add article to user favorites when article does not exist', (done) => {
    const slug = 'adschsdhcvbhdvxch bdhs-26392-7439-3j';
    chai.request(app)
      .post(`/api/v1/articles/${slug}/favourite`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Article not found');
        done();
      });
  });

  it('should list user favorite articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles/favourite')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('Success');
        expect(res.body.result).to.an('array');
        done();
      });
  });

  it('should remove article from user favorites', (done) => {
    chai.request(app)
      .delete(`/api/v1/articles/${articleSlug}/favourite`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Article removed from favourite');
        done();
      });
  });
});
