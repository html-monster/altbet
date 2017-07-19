/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	HEADER_ON_SOCKET_MESSAGE,
	HEADER_CHANGE_ODD_SYSTEM,
	ON_BASIC_MODE_SWITCH,
} from '../constants/ActionTypesHeader.js';
import BaseActions from './BaseActions';
import { SocketSubscribe } from "../models/SocketSubscribe";
import OddsConverter from '../models/oddsConverter/oddsConverter.js';

class Actions extends BaseActions
{
    OddsConverterObj = new OddsConverter();

	/**
	 * subscribe for socket
	 */
	public actionSocketSubscribe()
	{
		return (dispatch, getState) =>
		{
			ABpp.Websocket.sendSubscribe({}, SocketSubscribe.AP_ACCOUNT_DATA);
			window.ee.addListener('accountData.update', (newData) =>
			{
				// console.log(newData);
				const serverData = getState().header.serverData;
				// console.log(serverData.Available, newData.Available);
				if(serverData.Available != newData.Available || serverData.Exposure != newData.Exposure || serverData.Profitlost != newData.Profitlost)
				{
					dispatch({
						type: HEADER_ON_SOCKET_MESSAGE,
						payload: newData
					});
					__DEV__ && console.log('re-render');
				}
			});
		}
	}


    public actionSwitchBasicMode(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_BASIC_MODE_SWITCH,
                payload: inMode
            });
        };
    }


	public changeOddSystem(oddSystem)
	{
		return (dispatch) =>
		{
			localStorage.setItem('currentOddSystem', oddSystem);
			this.OddsConverterObj.setOddSystem(oddSystem);
			// console.log(`0.5`, OddsConverterObj.convertToOtherSystem(0.5));
			// console.log(`0.28`, OddsConverterObj.convertToOtherSystem(0.28));
			// console.log(`0.67`, OddsConverterObj.convertToOtherSystem(0.67));
			// console.log(`0.01`, OddsConverterObj.convertToOtherSystem(0.01));
			ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ODD_SYSTEM, {currentOddSystem: oddSystem});
			dispatch({
				type: HEADER_CHANGE_ODD_SYSTEM,
				payload: oddSystem
			});
		}
	}
}

export default (new Actions()).export();