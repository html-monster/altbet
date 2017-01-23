/**
 * Created by Htmlbook on 20.01.2017.
 */
import {
	TRANS_HISTORY_SET_PAYMENT_FILTER,
	TRANS_HISTORY_SET_DATE_FILTER,
} from "../../constants/ActionTypesTransHistory";

export function actionSetPaymentFilter(filter)
{
	return (dispatch) =>
	{
		dispatch({
			type   : TRANS_HISTORY_SET_PAYMENT_FILTER,
			payload: filter
		});
	}
}

export function actionSetDateFilter(from, to)
{
	return (dispatch) =>
	{
		dispatch({
			type   : TRANS_HISTORY_SET_DATE_FILTER,
			payload: {from: +from.format('x'), to: +to.format('x')}
		});
	}
}



