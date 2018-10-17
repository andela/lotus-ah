// Third party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';

// Seeder files
import userSeeder from '../server/db/seeders/userSeeder';
import articleSeeder from '../server/db/seeders/articleSeeder';
import highlightTextSeeder from '../server/db/seeders/highlightTextSeeder';

// modules
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

before(userSeeder.emptyUserTable);
before(userSeeder.addUserToDb);

let userToken;
let articleSlug;
let userId;
let articleId;

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
      userId = res.body.id
      done();
    });
});

// Comment controller test
describe('Test Highlight Controller', () => {
  it('should add a new article', (done) => {
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
        articleSlug = res.body.createdArticle.slug;
        articleId = res.body.createdArticle.id;
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });
  it('should highlight text on article and give comment on the highlighted text', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlights`)
      .set({
        'x-access-token': userToken,
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        'Policemen',
        'they are crook'
      ))
      .end((err, res) => {
        // commentId = res.body.data.comment.id;
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Highlighted text has been commented on successfully' );
        return done();
      });
  });

  it('should not highlight text on article if the parameter exist in database', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlights`)
      .set({
        'x-access-token': userToken,
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        'Policemen',
        'they are crook'
      ))
      .end((err, res) => {
        console.log( '=========>', res.body);
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(409);
        expect(message).to.equal('This text has already been commented on');
        return done();
      });
  });

  it('should not add comment if commentbody is not valid', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlights`)
      .set({
        'x-access-token': userToken,
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        'they are crook',
        ' '
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(403);
        expect(message[0]).to.equal('Invalid comment body');
        return done();
      });
  });

  it('should not add comment if highlightedText is not valid', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlights`)
      .set({
        'x-access-token': userToken,
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        '',
        'they are crook'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(403);
        expect(message[0]).to.equal('Invalid text input');
        return done();
      });
  });

  it('should not create comment for highlighted text if article is undefined', (done) => {
    chai.request(app)
      .post('/api/v1/articles/bismillah/highlights')
      .set({
        'x-access-token': userToken,
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        'they are crook',
        'In my mind, i love this'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article cannot be found');
        return done();
      });
  });

  it('should not create comment if token is not valid', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlights`)
      .set({
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6IkpvaG5ET2VAZ21haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.xYBM9XEwPEiM6wmpIiOm5IjHpjtIEgxvscjAyoJt9jY',
      })
      .send(highlightTextSeeder.setHighlightSeeder(
        userId,
        articleId,
        'they are crook',
        'In my mind, i love this'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(401);
        expect(message).to.equal('Failed to authenticate token.');
        return done();
      });
  });
});
