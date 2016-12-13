
import 'babel-polyfill';
// import * as React from 'react'
// import * as React from 'react';
// import { render } from 'react-dom';
// import { createStore } from 'redux';
// const {PropTypes, Component} = require('react');
import { Provider } from 'react-redux';

import EventPage from './containers/EventPage';
import configureStore from './store/configureStore';


// Altbet App object
ABpp = ABpp.App;

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <EventPage />
    </Provider>,
  document.getElementById('DiEventPage')
);

// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
