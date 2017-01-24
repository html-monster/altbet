import { combineReducers } from 'redux';

import appState from './appReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer';
import sidebar from './sidebarReducer';
import tradeSlip from './sidebar/defaultOrders';
import yourOrders from './sidebar/yourOrders';
import deposit from './userPage/deposit';
import transHistory from './userPage/transHistory';

export default combineReducers({
	'App': appState,
	mainPage,
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
	deposit,
	transHistory
});