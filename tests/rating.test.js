import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let articleSlug;


describe('Testing Rating Article Routes', () => {
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
    const id = 2;
    chai.request(app)
      .get(`/api/v1/articles/user/${id}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        articleSlug = res.body.Articles.slug;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Single article displayed');
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
