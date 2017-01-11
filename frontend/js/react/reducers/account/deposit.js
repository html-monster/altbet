/**
 * Created by Htmlbook on 27.12.2016.
 */
import {
	DEPOSIT_QUANTITY_CHANGE,
	DEPOSIT_PRICE_PLAN_CHANGE,
	DEPOSIT_PERIOD_CHANGE
} from "../../constants/ActionTypesDeposit.js";


const initialState = {
	data: appData.pageAccountData,
	plan: 'free',
	depositQuantity: '',
	pricePlan: '',
	pricePlanInfo: {
		monthly: 0,
		yearly: 0
	},
	payYearly: false
};

export default function yourOrders(state = initialState, action)
{
	switch (action.type)
	{
		case DEPOSIT_PRICE_PLAN_CHANGE:
			return {...state, plan : action.payload.plan, pricePlan: action.payload.quantity, pricePlanInfo: action.payload.pricePlanInfo};

		case DEPOSIT_QUANTITY_CHANGE:
			return {...state, depositQuantity : action.payload};

		case DEPOSIT_PERIOD_CHANGE:
			return {...state, payYearly : action.payload};

		default:
			return state
	}

}

