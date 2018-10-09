// react libraries
import React, { Component } from 'react';

// third-party libraries
import { hot } from 'react-hot-loader';

/**
 * @desc
 */
class App extends Component {
  render() {
    return (
      <div>
        <p>Welcome to Author's Haven</p>
      </div>
    );
  }
}

export default hot(module)(App);
