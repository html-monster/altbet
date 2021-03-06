
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, hashHistory, browserHistory  } from 'react-router'

import configureStore from './store/configureStore';
import RApp from './containers/RApp';
import MainPage from './containers/MainPage';
import Header from './containers/Header';
import MainMenu from './containers/MainMenu';
import EventPage from './containers/EventPage';
import ConfirmRegisterPage from './containers/ConfirmRegisterPage';
import AccountPage from './containers/UserPage';
import PageMyPos from './components/PageMyPos.jsx';
import Sidebar from './components/Sidebar.jsx';
import RegisterBox from './containers/RegisterBox.jsx';
import GidxVerification from './containers/GidxVerification.jsx';
import GidxCashier from './containers/GidxCashier.jsx';

var $node ;
let Component;
// Altbet App object
// let constants = ABpp.ABpp;
// ABpp = ABpp.ABpp.getInstance();
// ABpp.CONSTS = constants;

const store = configureStore();
ABpp.Store = store;


switch( ABpp.config.currentPage )
{
	// Gidx user verification
    case ABpp.CONSTS.PAGE_GIDX_VERIFICATION:
        Component = GidxVerification();
        mountById('DiGidxVerificationMP', <Component />);
        break;

	// Gidx withdraw
    case ABpp.CONSTS.PAGE_GIDX_WITHDRAW:
        Component = GidxCashier();
        mountById('DiGidxCashierMP', <Component />);
        break;
}


if( !globalData.landingPage  )
{
	ReactDOM.render(
		<Provider store={store}>
			<RApp />
		</Provider>,
	  document.getElementById('DiRoot')
	);

	ReactDOM.render(
		<Provider store={store}>
			<Header />
		</Provider>,
		document.getElementById('DiMPHeader')
	);


	ReactDOM.render(
		<Provider store={store}>
			<MainMenu />
		</Provider>,
		document.getElementById('DiMainMenu')
	);


	if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_MAIN ) {
		ReactDOM.render(
			<Provider store={store}>
				<MainPage />
			</Provider>,
		  document.getElementById('DiMPMainpage')
		);
	}

	if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_ACCOUNT) {
		ReactDOM.render(
			<Provider store={store}>
				<Router history={hashHistory}>
					<Route path='/'>
						<IndexRedirect to="/funds" />
						<Route path='/funds(/:tabname)' component={AccountPage} tab="funds" />
						<Route path='/preferences' component={AccountPage} tab="pref" />
						<Route path='/settings' component={AccountPage} tab="sett" />
						<Route path='/change_password' component={AccountPage} tab="pass" />
						<Route path='/self_exclusion' component={AccountPage} tab="self_sett" />
					</Route>
				</Router>
			</Provider>,
			document.getElementById('DiMPAccountPage')
			// document.getElementById('funds')
		);
		// ReactDOM.render(
		// 	<Provider store={store}>
		// 		<Withdraw />
		// 	</Provider>,
		// 	document.getElementById('withdraw')
		// );
	}
	else if( $node = document.getElementById('sidebar') ){
		ReactDOM.render(
			<Provider store={store}>
				<Sidebar
					data={appData.yourOrders}
					globalData={globalData}
				/>
			</Provider>,
			$node
		);
	}


	if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_MYPOS ) {
		// рендерим PageMyPos
		ReactDOM.render(
			<Provider store={store}>
				<Router history={hashHistory}>
					<Route path='/'>
						<IndexRedirect to="/my-games" />
						<Route path='/open-games' component={PageMyPos} tab="open-games" />
						<Route path='/my-games' component={PageMyPos} tab="my-games" />
						<Route path='/history' component={PageMyPos} tab="history" />
					</Route>
				</Router>
				{/*<PageMyPos />*/}
			</Provider>,
			document.getElementById('DiPageMyAssets')
		);
	}


	// if(!globalData.userPageOn){
	// 	ReactDOM.render(
	// 		<Provider store={store}>
	// 			<Sidebar
	// 				data={appData.yourOrders}
	// 				globalData={globalData}
	// 			/>
	// 		</Provider>,
	// 		document.getElementById('sidebar')
	// 	);
	// }


	// для OLD поменять здесь MP и взять EventPage.jsx.old
	if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_EVENT ) {
		ReactDOM.render(
			<Provider store={store}>
				<EventPage />
			</Provider>,
		  document.getElementById('DiMPEventPage')
		  // document.getElementById('DiMPEventPageOld')
		);
	}
} // endif


	if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_ACCOUNT_CONFIRM ) {
		ReactDOM.render(
			<Provider store={store}>
				<ConfirmRegisterPage />
			</Provider>,
		    document.getElementById('DiConfirmPage')
		);
	}


// Registration form
ReactDOM.render(
	<Provider store={store}>
		<RegisterBox />
	</Provider>,
  document.getElementById('DiregisterMP')
  // document.getElementById('DiMPEventPageOld')
);





function mountById(inId, inComponent)
{
    let mp;
    if( mp = document.getElementById(inId) )
    {
        // if (!store) {
        //     store = configureStore();
        //     ADpp.Store = store;
        // }

        ReactDOM.render(
            <Provider store={store}>
                {inComponent}
            </Provider>,
          mp
        );
    }
}
// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );
