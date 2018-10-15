import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeders/userSeeder';
import articleSeeder from '../server/db/seeders/articleSeeder';

chai.use(chaiHttp);
const { expect } = chai;

before(userSeeder.addUserToDb);

let userToken;

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

describe('Test article Controller', () => {
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
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });

  it('should return error message when title is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        '',
        `Doing good is right but is generally 
        not common habit you can find on any one cute`,
        'Doing good is right for you and I',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message.title[0]).to.equal('The title field is required.');
        return done();
      });
  });

  it('should return error message when description is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        'Policemen of this days are not yet here!',
        '',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message.description[0]).to.equal('The description field is required.');
        return done();
      });
  });

  it('should return error message when body is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        'Policemen of this days are not yet here!',
        `Doing good is right but is generally 
        not common habit you can find on any one cute`,
        '',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message.body[0]).to.equal('The body field is required.');
        return done();
      });
  });
  it('should update a specific user article', (done) => {
    chai.request(app)
      .put('/api/v1/articles/user/1')
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
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Article updated successfully');
        return done();
      });
  });


  it('should return error message when body is not provided', (done) => {
    chai.request(app)
      .put('/api/v1/articles/user/1')
      .set({
        'x-access-token': userToken,
      })
      .send(articleSeeder.setArticleData(
        '',
        `Doing good is right but is generally 
        not common habit you can find on any one cute`,
        'Doing good is right for you and I',
        'whtdebjbwwimg.jpg',
      ))
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(500);
        expect(message).to.equal('Error processing request, please try again');
        return done();
      });
  });

  it('should list all users articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Fetched all article');
        return done();
      });
  });

  it('should list all specific user articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Fetched all articles for a user');
        return done();
      });
  });

  it('should throw not found error', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/2')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article not found or has been deleted');
        return done();
      });
  });

  it('should list all specific user articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/1')
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

  it('should return error if ID not valid', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/aq1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Article ID must be a number');
        return done();
      });
  });

  it('should return error if ID not valid', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/user/aq1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Article ID must be a number');
        return done();
      });
  });

  it('should return error if not found', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/user/2')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(404);
        expect(message).to.equal('Article not found or has been deleted');
        return done();
      });
  });

  it('should delete a specific article for a user', (done) => {
    chai.request(app)
      .delete('/api/v1/articles/user/1')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('Article deleted successfully');
        return done();
      });
  });

  it('should return 400 and message for article not found', (done) => {
    chai.request(app)
      .post('/api/v1/articles/1/like')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Article not found or has been deleted');
        return done();
      });
  });

  it('should return 400 when article params is not a number', (done) => {
    chai.request(app)
      .post('/api/v1/articles/love/like')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(400);
        expect(message).to.equal('Article ID must be a number');
        return done();
      });
  });

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
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(201);
        expect(message).to.equal('Published article successfully');
        return done();
      });
  });

  it('should like a specific user article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/2/like')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('you liked the article');
        return done();
      });
  });

  it('should dislike a specific user article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/2/dislike')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('you disliked the article');
        return done();
      });
  });

  it('should like a specific user article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/2/unlike')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('you unliked the article');
        return done();
      });
  });

  it('should fetch all likes for an article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/2/like')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('All likes for this articles');
        return done();
      });
  });

  it('should fetch all dislikes for an article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/2/dislike')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.statusCode).to.equal(200);
        expect(message).to.equal('All dislikes for this articles');
        return done();
      });
  });
});
