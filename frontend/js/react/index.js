import 'babel-polyfill';
// import React, { Component } from 'react'
// import React from 'react';
// import { render } from 'react-dom';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppAltbet from './containers/AppAltbet';

import configureStore from './store/configureStore';

// const store = createStore( () => {}, {});
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <AppAltbet />
    </Provider>,
  document.getElementById('root')
);

// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
