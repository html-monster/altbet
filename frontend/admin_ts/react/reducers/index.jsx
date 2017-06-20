import { combineReducers } from 'redux';

import newFeedExchange from './newFeedExchangeReducer.ts';


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
// let constants = ABpp.ABpp;
// ABpp = ABpp.ABpp.getInstance();
// ABpp.CONSTS = constants;

const common = {
};

let view = "";

switch (view)
{
	default:
		reducers = {
			newFeedExchange: newFeedExchange,
			...common,
		};
		break;
}

export default combineReducers(reducers);