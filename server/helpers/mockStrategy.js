import passport from 'passport';

/* eslint-disable no-underscore-dangle */

// This is our mocked user
const mockedUser = {
  id: '11110010100102882256',
  displayName: 'Jamiu Adele',
  emails: [{ value: 'jamiuadele@gmail.com' }],
  photos: [{ value: 'https://iiiihdk.googleusercontent.com' }],
  provider: 'mock'
};

/** This is used to create a strategy with mocked profile
* @class Strategy
*/
class Strategy extends passport.Strategy {
  /**
  * Creates an instance of Strategy.
  * @param {string} name
  * @param {function} strategyCallback
  * @memberof Strategy
  */
  constructor(name, strategyCallback) {
    super(name, strategyCallback);
    this.name = name;
    this._cb = strategyCallback;
    this._user = mockedUser;
  }

  /**
  * @override
  * @returns {Function} - Callback function
  * @memberof Strategy
  */
  authenticate() {
    this._cb(null, null, this._user, (error, user) => {
      this.success(user);
    });
  }
}

export { mockedUser, Strategy };
