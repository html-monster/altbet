import { combineReducers } from 'redux';

import newFeedExchange from './newFeedExchangeReducer.ts';
import FeedEventsReducer from './FeedEventsReducer.ts';


let reducers;

const common = {
};

let page = "";

if ( globalData.ac.controller === "feed" && globalData.ac.action === "newfeedexchange" ) page = "applyfeedexchange";
if ( globalData.ac.controller === "feed" && globalData.ac.action === "index" ) page = "xmlfeedevents";

switch (page)
{
	case "applyfeedexchange":
		reducers = {
			newFeedExchange: newFeedExchange,
			...common,
		};
		break;

	case "xmlfeedevents":
		reducers = {
			FeedEvents: FeedEventsReducer,
			...common,
		};
		break;
}

export default reducers ? combineReducers(reducers) : null;