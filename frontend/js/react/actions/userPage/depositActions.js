/**
 * Created by Htmlbook on 28.12.2016.
 */

import {
	DEPOSIT_QUANTITY_CHANGE,
	DEPOSIT_PRICE_PLAN_CHANGE,
	DEPOSIT_PERIOD_CHANGE
} from "../../constants/ActionTypesDeposit.js";



export function actionOnPeriodChange(context, payYearly)
{
	return (dispatch, getState) =>
	{
		let state = getState().deposit;

		context.props.actions.actionOnPricePlanChange(state.plan, state.pricePlanInfo.monthly, state.pricePlanInfo.yearly, payYearly);

		dispatch({
			type: DEPOSIT_PERIOD_CHANGE,
			payload: payYearly
		});
	}
}

export function actionOnPricePlanChange(plan, monthQuantity, yearQuantity, payYearly)
{
    return (dispatch, getState) =>
	{
		let state = getState().deposit;
		payYearly = typeof payYearly == "boolean" ? payYearly : state.payYearly;
		let quantity = payYearly ? yearQuantity : monthQuantity;

		$('html, body').animate({scrollTop: $('.quantity_control').offset().top - $('header').outerHeight(true)}, 800);

        dispatch({
            type: DEPOSIT_PRICE_PLAN_CHANGE,
            payload: {
            	plan: plan,
				quantity: quantity,
				pricePlanInfo: {
					monthly: monthQuantity,
					yearly: yearQuantity,
				}
			}
        });
    }
}

export function actionOnInputQuantityChange(event)
{
	return (dispatch) =>
	{
		dispatch({
			type: DEPOSIT_QUANTITY_CHANGE,
			payload: event.target.value
		});
	}
}

export function actionOnButtonQuantityClick(event)
{
	return (dispatch, getState) =>
	{
		dispatch({
			type: DEPOSIT_QUANTITY_CHANGE,
			payload: +getState().deposit.depositQuantity + +event.target.textContent
		});
	}
}

