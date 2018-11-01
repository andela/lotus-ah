import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

import userSeeder from '../server/db/seeder/userSeeder';

// Controller methods for unit testing
import NotificationController from '../server/controllers/NotificationController';

chai.use(chaiHttp);
const { expect } = chai;


let userToken;

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


describe('Test NotificationController', () => {
  it('should get all user notifications', (done) => {
    chai.request(app)
      .get('/api/v1/me/notifications/')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          notifications,
        } = res.body;
        expect(res.status).to.equal(200);
        expect(notifications.count).to.equal(0);
        expect(notifications.rows).to.be.an('array');
        done();
      });
  });

  it('should get user notification by Id', (done) => {
    const id = 1;
    chai.request(app)
      .get(`/api/v1/me/notifications/${id}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          notifications,
        } = res.body;
        expect(res.status).to.equal(200);
        expect(notifications).to.equal(null);
        done();
      });
  });

  it('should mark a single user notification as read', (done) => {
    const id = 1;
    chai.request(app)
      .put(`/api/v1/me/notifications/${id}`)
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.status).to.equal(201);
        expect(message).to.equal('Notification marked as read');
        done();
      });
  });

  it('should mark all user notification as read', (done) => {
    chai.request(app)
      .put('/api/v1/me/notifications')
      .set({
        'x-access-token': userToken,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.status).to.equal(201);
        expect(message).to.equal('All Notification marked as read');
        done();
      });
  });

  it('should unsubscribe user from a specific notification', (done) => {
    const notificationType = 'publish';
    chai.request(app)
      .put('/api/v1/me/settings/notifications')
      .set({
        'x-access-token': userToken,
      })
      .send({
        notificationType,
        subscribe: false,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.status).to.equal(200);
        expect(message).to.equal(`You have unsubscribed from reciving ${notificationType} notifications`);
        done();
      });
  });
  it('should subscribe a user to continue receiving a specific notification', (done) => {
    const notificationType = 'publish';
    chai.request(app)
      .put('/api/v1/me/settings/notifications')
      .set({
        'x-access-token': userToken,
      })
      .send({
        notificationType,
        subscribe: true,
      })
      .end((err, res) => {
        const {
          message,
        } = res.body;
        expect(res.status).to.equal(200);
        expect(message).to.equal(`You have subscribed to receiving ${notificationType} notifications`);
        done();
      });
  });
  it('should create bulk notifications for many users', (done) => {
    const message = 'You have a new notitfication';

    const notifications = [
      {
        userid: 1,
        message: 'New article',
      },
      {
        userid: 1,
        message: 'New article',
      }
    ];
    NotificationController.createBulkNotification(notifications, message)
      .then((result) => {
        expect(result).to.be.an('boolean');
        expect(result).to.equal(true);
        done();
      });
  });

  it('should not send email notification to users without templateId', (done) => {
    const notifications = [
      {
        userid: 1,
        message: 'New article',
        email: 'victor@gmail.com',
        templateId: 'd-4823986320904dc3b623fec5f9c56829',
      },
      {
        userid: 1,
        message: 'New article',
        email: 'victor.ugwu@gmail.com',
        templateId: 'd-4823986320904dc3b623fec5f9c56829',
      }
    ];
    const input = {
      templateId: 'd-2d547766dbee468c950454f77dbb251f',
    };
    NotificationController.sendEmailNotification(notifications, input)
      .then((result) => {
        expect(result).to.be.an('object');
        done();
      })
      .catch((err) => {
        expect(err).to.be.an('object');
        done();
      });
  });
  it('should set up user deafault notifications', (done) => {
    const user = {
      id: 1,
      email: 'gozman@gmail.com',
      firstname: 'Victor',
    };
    const data = {
      templateId: 'd-2d547766dbee468c950454f77dbb251f',
      firstname: 'Victor',
    };
    const userEmailObject = NotificationController.prepareSingleUserEmail(user, data);
    expect(userEmailObject.from).to.equal('authorhavencommunity@gmail.com');
    done();
  });
});
