import { combineReducers } from 'redux';

import NewFeedExchangeReducer from './newFeedExchangeReducer.ts';
import FeedEventsReducer from './FeedEventsReducer.ts';
import {Framework} from 'common/Framework.ts';


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
			newFeedExchange: Framework.getHandler(NewFeedExchangeReducer),
			...common,
		};
		break;

	case "xmlfeedevents":
		reducers = {
			FeedEvents: Framework.getHandler(FeedEventsReducer),
			...common,
		};
		break;
}

export default reducers ? combineReducers.bind(null, reducers) : null;