import { combineReducers } from 'redux';

import appState from './appReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer.js';
import sidebar from './sidebar.js';
import tradeSlip from './sidebar/defaultOrders.js';
import yourOrders from './sidebar/yourOrders.js';
import deposit from './account/deposit.js';
import { reducer as reduxFormReducer } from 'redux-form';

export default combineReducers({
	'App': appState,
	mainPage,
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
	deposit,
	form: reduxFormReducer
});