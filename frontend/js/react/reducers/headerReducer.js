/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	HEADER_ON_SOCKET_MESSAGE,
	HEADER_CHANGE_ODD_SYSTEM,
} from '../constants/ActionTypesHeader.js';


const initialState = {
	oddSystem: 'Implied',
	serverData: appData.headerData
};


export default function header(state = initialState, action)
{
	switch (action.type)
	{
		case HEADER_ON_SOCKET_MESSAGE:
			return {...state, serverData: action.payload};

		case HEADER_CHANGE_ODD_SYSTEM:
			return {...state, oddSystem: action.payload};

		default:
			return state;
	}

}