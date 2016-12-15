
import 'babel-polyfill';
// import * as React from 'react'
// import * as React from 'react';
// import { render } from 'react-dom';
// import { createStore } from 'redux';
// const {PropTypes, Component} = require('react');
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import EventPage from './containers/EventPage';
import Sidebar from './components/Sidebar.jsx';


// Altbet App object
ABpp = ABpp.App;

const store = configureStore();
if(globalData.eventPageOn){
	ReactDOM.render(
		<Provider store={store}>
			<EventPage />
		</Provider>,
	  document.getElementById('DiEventPage')
	);
}
if(!globalData.userPageOn){
	ReactDOM.render(
		<Provider store={store}>
			<Sidebar
				data={appData.yourOrders}
				globalData={globalData}
			/>
		</Provider>,
		document.getElementById('sidebar')
	);
}

// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
