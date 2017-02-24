/**
 * Created by Htmlbook on 20.01.2017.
 */
import {
	TRANS_HISTORY_ON_LOAD,
	TRANS_HISTORY_SET_PAYMENT_FILTER,
	TRANS_HISTORY_SET_DATE_FILTER,
} from "../../constants/ActionTypesTransHistory";
import {DateLocalization} from '../../models/DateLocalization';

export function actionOnLoad()
{
	return (dispatch, getState) =>
	{
		let transHistory = getState().transHistory.transHistory;
		const Localization = new DateLocalization;

		transHistory.forEach((item) => {
			item.date = Localization.fromSharp(item.date);
		});

		dispatch({
			type   : TRANS_HISTORY_ON_LOAD,
			payload: transHistory
		});
	}
}

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
		console.log( {from: +from.format('x'), to: +to.format('x')});
		dispatch({
			type   : TRANS_HISTORY_SET_DATE_FILTER,
			payload: {from: +from.format('x'), to: +to.format('x')}
		});
	}
}



