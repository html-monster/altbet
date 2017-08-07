/**
 * Created by Htmlbook on 13.07.2017.
 */

import {
    DISQUS_SET_EVENT_DATA,
} from "../constants/ActionTypesDisqus";
import BaseActions from './BaseActions';


export default class Actions extends BaseActions
{
    public getEventData(eventData)
    {
    	return (dispatch) =>
    	{
            dispatch({
                type: DISQUS_SET_EVENT_DATA,
                payload: eventData
            });

        };
    }
}

// export default (new Actions()).export();