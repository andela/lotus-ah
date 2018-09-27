import { expect } from 'chai';
import config from '../config/index';

process.env.NODE_ENV = 'test';


describe('A basic Test Sample', () => {
  describe('It should return config secret', () => {
    it('secret', (done) => {
      expect(config.secret).to.eql('secret');
      done();
    });
  });
});
