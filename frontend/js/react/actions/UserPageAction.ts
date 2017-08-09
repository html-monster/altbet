
import {
    SUBSCRIBE_ONE_SIGNAL,
} from "../constants/ActionTypesUserPage.js";
import BaseActions from './BaseActions';
import {PushNotification} from "../models/PushNotification.js";



export default class Actions extends BaseActions
{
     public actionOnLoad()
    {
    	return (dispatch) =>
    	{
            let OneSignal = new PushNotification();
            OneSignal.init();
            OneSignal.pushOneSignal();


            dispatch({
                type: SUBSCRIBE_ONE_SIGNAL,
                payload: {OneSignal}
            });

        };
    }
}
