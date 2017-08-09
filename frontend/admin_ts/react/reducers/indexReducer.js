import { combineReducers } from 'redux';

import NewFeedExchangeReducer from './newFeedExchangeReducer.ts';
import FeedEventsReducer from './FeedEventsReducer.ts';
import HomeEventsReducer from './HomeEventsReducer.ts';
import UsersReducer from './UsersReducer.ts';
import {Framework} from 'common/Framework.ts';


let reducers;
let page = "";

const common = {
};


if( globalData.ac )
{
	const { controller, action } = globalData.ac;

	if ( controller === "feed" && (action === "newfeedexchange" || action === "editfeedexchange") ) page = "APPLY_FEED_EXCHANGE";
	if ( controller === "feed" && action === "index" ) page = "XML_FEED_EVENTS";
	if ( controller === "home" && action === "index" ) page = "HOME_EVENTS";
	if ( controller === "user" && action === "index" ) page = "USERS";


	switch (page)
	{
		case "APPLY_FEED_EXCHANGE":
			reducers = {
				newFeedExchange: Framework.getHandler(NewFeedExchangeReducer),
				...common,
			};
			break;

		case "XML_FEED_EVENTS":
			reducers = {
				FeedEvents: Framework.getHandler(FeedEventsReducer),
				...common,
			};
			break;

		case "HOME_EVENTS":
			reducers = {
				HomeEvents: Framework.getHandler(HomeEventsReducer),
				...common,
			};
			break;
		case "USERS":
			reducers = {
				Users: Framework.getHandler(UsersReducer),
				...common,
			};
			break;
	}
} // endif


export default reducers ? combineReducers.bind(null, reducers) : null;