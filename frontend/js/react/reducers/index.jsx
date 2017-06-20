import { combineReducers } from 'redux';

import appState from './appReducer';
import header from './headerReducer';
import mainMenu from './menuReduser';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer';
import accountPage from './accountPageReducer';
import sidebar from './sidebarReducer';
import defaultOrdersSidebar from './sidebar/tradeSlip/defaultOrdersSidebar';
import defaultOrdersLocal from './defaultOrdersLocal';
import activeTrader from './sidebar/tradeSlip/activeTrader';
import yourOrders from './sidebar/yourOrders';
import deposit from './userPage/deposit';
import withdraw from './userPage/withdraw';
import transHistory from './userPage/transHistory';
import myPosReduce from './MyPosReducer';
import accountSetting from './userPage/settingReducer';
// import tradeSlip from './sidebar/tradeSlipReducer';
import registerBox from './registerReducer';
import confirmRegisterPage from './confirmRegisterPageReducer';


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

const common = {
	registerBox,
};


switch (ABpp.config.currentPage)
{
	case  ABpp.CONSTS.PAGE_LANDING: {
		reducers = {
			registerBox,
		};
		break;
	}
	case  ABpp.CONSTS.PAGE_MAIN: {
		reducers = {
			App: appState,
			header,
			mainMenu,
			mainPage,
			myPosReduce,
			sidebar,
			// tradeSlip,
			defaultOrdersSidebar,
			defaultOrdersLocal,
			activeTrader,
			yourOrders,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_EVENT:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			eventPage,
			sidebar,
			// tradeSlip,
			defaultOrdersSidebar,
			activeTrader,
			yourOrders,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ACCOUNT:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			accountPage,
			deposit,
			withdraw,
			transHistory,
			accountSetting,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_MYPOS:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			myPosReduce,
			sidebar,
			// tradeSlip,
			defaultOrdersSidebar,
			activeTrader,
			yourOrders,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_STATIC:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ANSWER:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ACCOUNT_CONFIRM:{
		reducers = {
			App: appState,
			header,
			mainMenu,
			confirmRegisterPage,
			...common,
		};
		break;
	}

}

export default combineReducers(reducers);