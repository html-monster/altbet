import { combineReducers } from 'redux';

import NewFeedExchangeReducer from './newFeedExchangeReducer.ts';
import FeedEventsReducer from './FeedEventsReducer.ts';
import {Framework} from 'common/Framework.ts';


let reducers;
let page = "";

const common = {
};


if( globalData.ac )
{
	const { controller, action } = globalData.ac;

	if ( controller === "feed" && (action === "newfeedexchange" || action === "editfeedexchange") ) page = "applyfeedexchange";
	if ( controller === "feed" && action === "index" ) page = "xmlfeedevents";


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
} // endif


export default reducers ? combineReducers.bind(null, reducers) : null;