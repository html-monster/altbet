import { combineReducers } from 'redux';

import appState from './appReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer';
import accountPage from './accountPageReducer';
import sidebar from './sidebarReducer';
import tradeSlip from './sidebar/defaultOrders';
import activeTrader from './sidebar/activeTrader';
import yourOrders from './sidebar/yourOrders';
import deposit from './userPage/deposit';
import withdraw from './userPage/withdraw';
import transHistory from './userPage/transHistory';
import myPosReduce from './MyPosReducer';


let reducers = {};
// export default combineReducers({
// 	'App': appState,
// 	mainPage,
//     eventPage,
// 	myPosReduce,
// 	sidebar,
// 	tradeSlip,
// 	yourOrders,
// 	deposit,
// 	transHistory
// });
let constants = ABpp.ABpp;
ABpp = ABpp.ABpp.getInstance();
ABpp.CONSTS = constants;

switch (ABpp.config.currentPage){
	case  ABpp.CONSTS.PAGE_MAIN:{
		reducers = {
			'App': appState,
			mainPage,
			myPosReduce,
			sidebar,
			tradeSlip,
			activeTrader,
			yourOrders
		};
		break;
	}
	case ABpp.CONSTS.PAGE_EVENT:{
		reducers = {
			'App': appState,
			eventPage,
			sidebar,
			tradeSlip,
			activeTrader,
			yourOrders
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ACCOUNT:{
		reducers = {
			'App': appState,
			accountPage,
			deposit,
			withdraw,
			transHistory
		};
		break;
	}
	case ABpp.CONSTS.PAGE_MYPOS:{
		reducers = {
			'App': appState,
			myPosReduce,
			sidebar,
			tradeSlip,
			activeTrader,
			yourOrders
		};
		break;
	}
}

export default combineReducers(reducers);