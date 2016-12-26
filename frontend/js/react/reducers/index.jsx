import { combineReducers } from 'redux';

import eventPage from './eventPage.js';
import sidebar from './sidebar.js';
import tradeSlip from './sidebar/defaultOrders.js';
import yourOrders from './sidebar/yourOrders.js';
// import test from './test'


export default combineReducers({
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
    // test
});