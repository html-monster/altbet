import { combineReducers } from 'redux';

import mainPage from './mainPage';
import eventPage from './eventPage';
import sidebar from './sidebar';
// import test from './test'


export default combineReducers({
    eventPage,
	sidebar,
    mainPage
});