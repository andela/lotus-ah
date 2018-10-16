// Third party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';

// Seeder files
import userSeeder from '../server/db/seeders/userSeeder';
import articleSeeder from '../server/db/seeders/articleSeeder';
import commentSeeder from '../server/db/seeders/commentSeeder';

// modules
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

before(userSeeder.emptyUserTable);
before(userSeeder.addUserToDb);

let userToken;
let articleSlug;
let commentId;

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

// Comment controller test
describe('Test Comment Controller', () => {
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
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });
  it('should add a new comment', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
        'My first comment',
      ))
      .end((err, res) => {
        commentId = res.body.data.comment.id;
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Comment Added Successfully');
        return done();
      });
  });

  it('should not create comment if comment body is empty', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
        '',
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

  it('should not create comment if comment body is undefined', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
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

  it('should not create comment if article is not found', (done) => {
    chai.request(app)
      .post('/api/v1/articles/bismillah/comments')
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
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
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .set({
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJlbWFpbCI6IkpvaG5ET2VAZ21haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.xYBM9XEwPEiM6wmpIiOm5IjHpjtIEgxvscjAyoJt9jY',
      })
      .send(commentSeeder.setCommentData(
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Failed to authenticate token.');
        return done();
      });
  });

  it('should update comment', (done) => {
    chai.request(app)
      .put(`/api/v1/articles/comments/${commentId}`)
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
        'pholayemi is a boy'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Comment Updated Successfully');
        return done();
      });
  });

  it('should not update comment if id is not valid', (done) => {
    chai.request(app)
      .put('/api/v1/articles/comments/7')
      .set({
        'x-access-token': userToken,
      })
      .send(commentSeeder.setCommentData(
        'pholayemi is a boy'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('comment not found');
        return done();
      });
  });

  it('should not update comment if token is not valid', (done) => {
    chai.request(app)
      .put(`/api/v1/articles/comments/${commentId}`)
      .set({
        'x-access-token': '465u789oiujyhgfhj',
      })
      .send(commentSeeder.setCommentData(
        'pholayemi is a boy'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Failed to authenticate token.');
        return done();
      });
  });
  it('should not update comment if token is not provided', (done) => {
    chai.request(app)
      .put(`/api/v1/articles/comments/${commentId}`)
      .set({

      })
      .send(commentSeeder.setCommentData(
        'pholayemi is a boy'
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('No token provided.');
        return done();
      });
  });
});
