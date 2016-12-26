import { combineReducers } from 'redux';

import mainPage from './mainPageReducer';
import eventPage from './eventPage.js';
import sidebar from './sidebar.js';
import tradeSlip from './sidebar/defaultOrders.js';
import yourOrders from './sidebar/yourOrders.js';
// import test from './test'


export default combineReducers({
	mainPage,
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
});