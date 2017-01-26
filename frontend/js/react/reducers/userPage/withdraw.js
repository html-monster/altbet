/**
 * Created by Htmlbook on 27.12.2016.
 */
import {
	WITHDRAW_QUANTITY_CHANGE,
	WITHDRAW_QUANTITY_VALIDATE,
	WITHDRAW_SOCKET_MESSAGE
} from "../../constants/ActionTypesWithdraw";


const initialState = {
	data: appData.pageAccountData,
	depositQuantity: '',
	sumValidation: null
};

export default function withdraw(state = initialState, action)
{
	switch (action.type)
	{
		case WITHDRAW_QUANTITY_CHANGE:
			return {...state, depositQuantity : action.payload};

		case WITHDRAW_QUANTITY_VALIDATE:
			return {...state, sumValidation : action.payload};

		case WITHDRAW_SOCKET_MESSAGE:
			state.data.UserAssets.CurrentBalance = action.payload;
			return {...state};

		default:
			return state
	}

}


