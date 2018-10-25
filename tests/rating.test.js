import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import articleSeeder from '../server/db/seeder/articleSeeder';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let articleSlug;


describe('Testing Rating Article Routes', () => {
  it('should add a new article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        'Policemen of this days are not yet here! Successfully',
        `Doing good is right but is generally 
        not common habit you can find on any one cute`,
        'Doing good is right for you and I',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
          createdArticle
        } = res.body;
        articleSlug = createdArticle.slug;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });
  before((done) => {
    chai.request(app)
      .post('/api/v1/login')
      .send({
        email: 'nondefyde@gmail.com',
        password: 'chigodwin1',
      }).end((err, res) => {
        expect(res.statusCode).to.equal(200);
        if (err) {
          done(err);
        }
        userToken = res.body.token;
        done();
      });
  });

  it('Should get an article to rate', (done) => {
    // Making use of added article from previous test
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

  it('should return error message when rating is not provided', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/rating`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Rating must be a number');
        return done();
      });
  });
  it('should return error message when rating is not below 1 or above 5', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/rating`)
      .set({
        'x-access-token': userToken,
      })
      .send({
        rating: 6,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('You should provide a rating between 1 and 5');
        return done();
      });
  });

  it('should return error message when article rated does not exist', (done) => {
    const slug = 'The-manm-3344-gdbaz';
    chai.request(app)
      .post(`/api/v1/articles/${slug}/rating`)
      .set({
        'x-access-token': userToken,
      })
      .send({
        rating: 4,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article not found');
        return done();
      });
  });

  it('should rate an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/rating`)
      .set({
        'x-access-token': userToken,
      })
      .send({
        rating: 3,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Your rating has been recorded');
        return done();
      });
  });
});
