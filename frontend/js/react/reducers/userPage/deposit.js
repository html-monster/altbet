/**
 * Created by Htmlbook on 27.12.2016.
 */
import {
	DEPOSIT_QUANTITY_CHANGE,
	DEPOSIT_PRICE_PLAN_CHANGE,
	DEPOSIT_PERIOD_CHANGE,
	DEPOSIT_QUANTITY_VALIDATE,
	DEPOSIT_SOCKET_MESSAGE
} from "../../constants/ActionTypesDeposit";


const initialState = {
	data: appData.pageAccountData,
	plan: 'free',
	depositQuantity: 15,
	pricePlan: '',
	pricePlanInfo: {
		monthly: 0,
		yearly: 0
	},
	payYearly: false,
	sumValidation: null
};

export default function deposit(state = initialState, action)
{
	switch (action.type)
	{
		case DEPOSIT_PRICE_PLAN_CHANGE:
			return {...state, plan : action.payload.plan, pricePlan: action.payload.quantity, pricePlanInfo: action.payload.pricePlanInfo};

		case DEPOSIT_QUANTITY_CHANGE:
			return {...state, depositQuantity : action.payload};

		case DEPOSIT_PERIOD_CHANGE:
			return {...state, payYearly : action.payload};

		case DEPOSIT_QUANTITY_VALIDATE:
			return {...state, sumValidation : action.payload};

		case DEPOSIT_SOCKET_MESSAGE:
			state.data.UserAssets.CurrentBalance = action.payload;
			return {...state};

		default:
			return state
	}

}

