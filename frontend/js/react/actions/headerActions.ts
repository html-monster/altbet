/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	HEADER_ON_SOCKET_MESSAGE,
	HEADER_CHANGE_ODD_SYSTEM,
} from '../constants/ActionTypesHeader.js';
import BaseActions from './BaseActions';
import { SocketSubscribe } from "../models/SocketSubscribe";

class Actions extends BaseActions
{
	public onSocketMessage()
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

	public changeOddSystem(oddSystem)
	{
		return (dispatch, getState) =>
		{

		}
	}
}

export default (new Actions()).export();