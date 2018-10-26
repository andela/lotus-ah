// third-party libraries
import chai from 'chai';
import chaiHttp from 'chai-http';

// moduler importations
import app from '..';
import userSeeder from '../server/db/seeder/userSeeder';


chai.use(chaiHttp);
const { expect } = chai;
let tokenCollect;
let tokenCollectAdmin;
// const tokenFailed = 'bbfehfbeybdhvifnvf.fefwybhebvehvhevbh';
before(userSeeder.addUserToDb);
const userDetails = {
  firstname: 'chisom',
  lastname: 'obuladike',
  username: 'obulaworld1',
  bio: 'A software Developer',
  password: 'georgina1',
  roleId: 1
};

const email = {
  email1: 'chisom@gmail.com',
  email2: 'chisom.obuladikeandela.com',
};
describe('Admin Controller', () => {
  it('should create a new user with just email', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ email: email.email1 })
      .end((error, result) => {
        const { token } = result.body;
        tokenCollect = token;
        expect(result.status).to.eql(201);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 existing email with isActivated = false', (done) => {
    chai.request(app)
      .post('/api/v1/users')
      .send({ email: email.email1 })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 on user activation GET url with a valid token query parameter', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 for valid token and valid user details on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send(userDetails)
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 for valid token and valid user details on user update', (done) => {
    chai.request(app)
      .put('/api/v1/users')
      .send(userDetails)
      .query({ token: tokenCollect })
      .end((error, result) => {
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });

  it('should return 200 for loging in with correct user details as admin', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send({ email: 'nondefyde@gmail.com', password: 'chigodwin1' })
      .end((error, result) => {
        const { token } = result.body;
        tokenCollectAdmin = token;
        expect(result.status).to.not.eql(400);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 getting all admin by an admin', (done) => {
    chai.request(app)
      .get('/api/v1/admin/all')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(400);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 401 getting all admin by an admin with wrong token', (done) => {
    chai.request(app)
      .get('/api/v1/admin/all')
      .set('x-access-token', 'ebwbfdfewhbfehbyebeybebfewb')
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 401 getting all admin by a user', (done) => {
    chai.request(app)
      .get('/api/v1/admin/all')
      .set('x-access-token', 'tokenCollectAdmin')
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 in changing a user role to admin by an admin', (done) => {
    chai.request(app)
      .get('/api/v1/admin/role/change/admin/2')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(400);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 401 in changing a user role to admin by a user', (done) => {
    chai.request(app)
      .get('/api/v1/admin/role/change/admin/2')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(401);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 in changing an admin role to user by admin', (done) => {
    chai.request(app)
      .get('/api/v1/admin/role/change/user/2')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(400);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 in changing an admin role to user by a user', (done) => {
    chai.request(app)
      .get('/api/v1/admin/role/change/user/2')
      .set('x-access-token', tokenCollect)
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 200 suspending a user by an admin', (done) => {
    chai.request(app)
      .get('/api/v1/admin/suspend/2')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(400);
        expect(result.status).to.eql(200);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 suspending a non existsing user by an admin', (done) => {
    chai.request(app)
      .get('/api/v1/admin/suspend/100')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 suspending a user by a user', (done) => {
    chai.request(app)
      .get('/api/v1/admin/suspend/2')
      .set('x-access-token', tokenCollect)
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(401);
        expect(result.body).to.be.a('object');
        done();
      });
  });
  it('should return 400 suspending a user by an admin with a non integer as id', (done) => {
    chai.request(app)
      .get('/api/v1/admin/suspend/id')
      .set('x-access-token', tokenCollectAdmin)
      .end((error, result) => {
        expect(result.status).to.not.eql(200);
        expect(result.status).to.eql(400);
        expect(result.body).to.be.a('object');
        done();
      });
  });
});
