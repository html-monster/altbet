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
import disqus from './disqusReducer';
// import tradeSlip from './sidebar/tradeSlipReducer';
import registerBox from './registerReducer';
import confirmRegisterPage from './confirmRegisterPageReducer';

import GidxVerificationReducer from './GidxVerificationReducer.ts';
import GidxCashierReducer from './GidxCashierReducer.ts';
import {Framework} from '../common/Framework.ts';



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
	App: appState,
	header,
	mainMenu,
	registerBox,
};

const pressetStatic = () => {return{
    App: appState,
    header,
    mainMenu,
	registerBox,
}};


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
			mainPage,
			myPosReduce,
			sidebar,
			// tradeSlip,
			defaultOrdersSidebar,
			defaultOrdersLocal,
			activeTrader,
			yourOrders,
			disqus,
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_EVENT:{
		reducers = {
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
			...common,
		};
		break;
	}

	case ABpp.CONSTS.PAGE_GIDX_VERIFICATION: {
		reducers = {
			...pressetStatic(),
            gidxVerification: Framework.getHandler(GidxVerificationReducer),
		};
		break;
	}

	case ABpp.CONSTS.PAGE_GIDX_WITHDRAW: {
		reducers = {
			...pressetStatic(),
            gidxCashier: Framework.getHandler(GidxCashierReducer),
		};
		break;
	}

	case ABpp.CONSTS.PAGE_ANSWER:{
		reducers = {
			...common,
		};
		break;
	}
	case ABpp.CONSTS.PAGE_ACCOUNT_CONFIRM:{
		reducers = {
			confirmRegisterPage,
			...common,
		};
		break;
	}

}

export default combineReducers(reducers);