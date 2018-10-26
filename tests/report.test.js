import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeder/userSeeder';
import articleSeeder from '../server/db/seeder/articleSeeder';
import reportSeeder from '../server/db/seeder/reportSeeder';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let currentSlug;


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

describe('Test report Controller', () => {
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
        currentSlug = createdArticle.slug;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });

  it('should report an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${currentSlug}/report`)
      .set({
        'x-access-token': userToken,
      })
      .send(reportSeeder.setReportData(
        'Reason to be policed before Policemen of this days are not yet here! Successfully',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Article has been reported successfully');
        return done();
      });
  });

  it('should return error of article not found', (done) => {
    chai.request(app)
      .post('/api/v1/articles/jdsyugbdjn33444/report')
      .set({
        'x-access-token': userToken,
      })
      .send(reportSeeder.setReportData(
        'Reason to be policed before Policemen of this days are not yet here! Successfully',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article not found');
        return done();
      });
  });

  it('should return 409 error message when conflicting', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${currentSlug}/report`)
      .set({
        'x-access-token': userToken,
      })
      .send(reportSeeder.setReportData(
        'Reason to be policed before Policemen of this days are not yet here! Successfully',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(409);
        expect(message).to.equal('report already exists');
        return done();
      });
  });

  it('should return 400 error message when body is not provided', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${currentSlug}/report`)
      .set({
        'x-access-token': userToken,
      })
      .send(reportSeeder.setReportData(
        '',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message.reason[0]).to.equal('The reason field is required.');
        return done();
      });
  });

  it('should resolve reported article', (done) => {
    chai.request(app)
      .put(`/api/v1/articles/${currentSlug}/report/resolve`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Article has been resolved successfully');
        return done();
      });
  });

  it('should return error of article not found', (done) => {
    chai.request(app)
      .put('/api/v1/articles/jdsyugbdjn33444/report/resolve')
      .set({
        'x-access-token': userToken,
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

  it('should fetch all reported articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles/reports')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Fetch reported article successfully');
        return done();
      });
  });

  it('should fetch a single reported article', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/report/${currentSlug}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('This article does not have any report');
        return done();
      });
  });

  it('should report an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${currentSlug}/report`)
      .set({
        'x-access-token': userToken,
      })
      .send(reportSeeder.setReportData(
        'Reason to be policed before Policemen of this days are not yet here! Successfully',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Article has been reported successfully');
        return done();
      });
  });

  it('should fetch a single reported article', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/report/${currentSlug}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Fetch reported article successfully');
        return done();
      });
  });
});
