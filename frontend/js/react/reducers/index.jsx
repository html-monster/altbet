import { combineReducers } from 'redux';

import appState from './appReducer';
import header from './headerReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer';
import accountPage from './accountPageReducer';
import sidebar from './sidebarReducer';
// import tradeSlip from './sidebar/tradeSlipReducer';
import defaultOrders from './sidebar/tradeSlip/defaultOrders';
import activeTrader from './sidebar/tradeSlip/activeTrader';
import yourOrders from './sidebar/yourOrders';
import deposit from './userPage/deposit';
import withdraw from './userPage/withdraw';
import transHistory from './userPage/transHistory';
import myPosReduce from './MyPosReducer';


let reducers = {};
// export default combineReducers({
// 	App': appState,
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
			App: appState,
			header,
			mainPage,
			myPosReduce,
			sidebar,
			// tradeSlip,
			defaultOrders,
			activeTrader,
			yourOrders
		};
		break;
	}
	case ABpp.CONSTS.PAGE_EVENT:{
		reducers = {
			App: appState,
			header,
			eventPage,
			sidebar,
			// tradeSlip,
			defaultOrders,
			activeTrader,
			yourOrders
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ACCOUNT:{
		reducers = {
			App: appState,
			header,
			accountPage,
			deposit,
			withdraw,
			transHistory
		};
		break;
	}
	case ABpp.CONSTS.PAGE_MYPOS:{
		reducers = {
			App: appState,
			header,
			myPosReduce,
			sidebar,
			// tradeSlip,
			defaultOrders,
			activeTrader,
			yourOrders
		};
		break;
	}
}

export default combineReducers(reducers);