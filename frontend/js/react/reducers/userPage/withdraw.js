/**
 * Created by Htmlbook on 27.12.2016.
 */
import {
	WITHDRAW_QUANTITY_CHANGE,
	WITHDRAW_QUANTITY_VALIDATE,
	WITHDRAW_SOCKET_MESSAGE,
	WITHDRAW_APPROVE
} from "../../constants/ActionTypesWithdraw";


const initialState = {
	approved: false,
	data: appData.pageAccountData,
	depositQuantity: '',
	form: null,
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

		case WITHDRAW_APPROVE:
			return {...state, approved : action.payload};

			default:
			return state
	}

}


