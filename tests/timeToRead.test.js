import { expect } from 'chai';

import timeToRead from '../server/helpers/timeToRead';

const readTime = timeToRead;


describe('Time to read function ', () => {
  it('should be a function ', () => {
    expect(readTime).to.be.a('function');
  });

  it('should return a json object ', () => {
    const readingTime = readTime('calory is a liar ');
    expect(readingTime).to.be.a('string');
  });
});
