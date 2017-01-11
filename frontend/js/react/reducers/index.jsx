import { combineReducers } from 'redux';

import appState from './appReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPage.js';
import sidebar from './sidebar.js';
import tradeSlip from './sidebar/defaultOrders.js';
import yourOrders from './sidebar/yourOrders.js';
import deposit from './account/deposit.js';


export default combineReducers({
	'App': appState,
	mainPage,
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
	deposit,
});