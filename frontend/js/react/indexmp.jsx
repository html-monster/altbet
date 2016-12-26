
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import RApp from './containers/RApp';
import MainPage from './containers/MainPage';
import EventPage from './containers/EventPage';
import Sidebar from './components/Sidebar.jsx';


// Altbet App object
let constants = ABpp.ABpp;
ABpp = ABpp.ABpp.getInstance();
ABpp.CONSTS = constants;

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <RApp />
    </Provider>,
  document.getElementById('DiRoot')
);


if( ABpp.config.currentPage == ABpp.CONSTS.PAGE_MAIN ) {
	ReactDOM.render(
		<Provider store={store}>
			<MainPage />
		</Provider>,
	  document.getElementById('DiMPMainpage')
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


if( ABpp.config.currentPage == ABpp.CONSTS.PAGE_EVENT ) {
	ReactDOM.render(
		<Provider store={store}>
			<EventPage />
		</Provider>,
	  document.getElementById('DiEventPage')
	);
}



// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
