import { combineReducers } from 'redux';

import appState from './appReducer';
import mainPage from './mainPageReducer';
import eventPage from './eventPageReducer';
import sidebar from './sidebarReducer';
import tradeSlip from './sidebar/defaultOrders';
import yourOrders from './sidebar/yourOrders';
import deposit from './account/deposit';
// import inputValidation from './formValidation/inputValidation';
import formValidation from './formValidation';
import { reducer as reduxFormReducer } from 'redux-form';

export default combineReducers({
	'App': appState,
	mainPage,
    eventPage,
	sidebar,
	tradeSlip,
	yourOrders,
	deposit,
	form: reduxFormReducer,
	// inputValidation,
	formValidation
});