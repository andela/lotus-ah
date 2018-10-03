import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;


describe('Dummy test', () => {
  it('should check if dummy test works', () => {
    expect('Authors Haven').to.be.a('string');
  });
});
