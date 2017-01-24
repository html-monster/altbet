
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';


import configureStore from './store/configureStore';
import RApp from './containers/RApp';
import MainPage from './containers/MainPage';
import EventPage from './containers/EventPage';
import PageMyPos from './components/PageMyPos.jsx';
import Sidebar from './components/Sidebar.jsx';
import Deposit from './components/userPage/Deposit';
import Withdraw from './components/userPage/Withdraw';
import Funds from './components/userPage/Funds';



// Altbet App object
let constants = ABpp.ABpp;
ABpp = ABpp.ABpp.getInstance();
ABpp.CONSTS = constants;



const store = configureStore();
ABpp.Store = store;


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

if( ABpp.config.currentPage == ABpp.CONSTS.PAGE_ACCOUNT ) {
	ReactDOM.render(
		<Provider store={store}>
			<Funds />
		</Provider>,
		document.getElementById('funds')
	);
	ReactDOM.render(
		<Provider store={store}>
			<Withdraw />
		</Provider>,
		document.getElementById('withdraw')
	);
}


if( ABpp.config.currentPage == ABpp.CONSTS.PAGE_MYPOS ) {
	// рендерим PageMyPos
	ReactDOM.render(
		<Provider store={store}>
			<PageMyPos />
		</Provider>,
        document.getElementById('DiPageMyAssets')
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


// для OLD поменять здесь MP и взять EventPage.jsx.old
if( ABpp.config.currentPage == ABpp.CONSTS.PAGE_EVENT ) {
	ReactDOM.render(
		<Provider store={store}>
			<EventPage />
		</Provider>,
	  document.getElementById('DiMPEventPage')
	  // document.getElementById('DiMPEventPageOld')
	);
}



// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
