import { combineReducers } from 'redux';

import newFeedExchange from './newFeedExchangeReducer.ts';
import FeedEventsReducer from './FeedEventsReducer.ts';


let reducers;
let page = "";

const common = {
};


if( globalData.ac )
{
	const { controller, action } = globalData.ac;

	if ( controller === "feed" && action === "newfeedexchange" ) page = "applyfeedexchange";
	if ( controller === "feed" && action === "index" ) page = "xmlfeedevents";


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
} // endif


export default reducers ? combineReducers(reducers) : null;