/**
 * Created by Htmlbook on 20.01.2017.
 */
import {
	TRANS_HISTORY_ON_LOAD,
	TRANS_HISTORY_SET_PAYMENT_FILTER,
	TRANS_HISTORY_SET_DATE_FILTER
} from "../../constants/ActionTypesTransHistory";


const data = appData.pageAccountData ? appData.pageAccountData.PaymentsHistory : [];

const initialState = {
	paymentFilter: 'All',
	rangeFilter: {
		from: +moment().subtract(30, 'days').format('x'),
		to: +moment().endOf('day').format('x')
	},
	transHistory: data
	// 	[
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1477429200000,
	// 		system: 'Neteller',
	// 		amount: '$100'
	// 	},
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1477864800000,
	// 		system: 'Neteller',
	// 		amount: '$250'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1479160800000,
	// 		system: 'Skrill',
	// 		amount: '$10'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1479333600000,
	// 		system: 'EcoPayz',
	// 		amount: '$15'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1479852000000,
	// 		system: 'EcoPayz',
	// 		amount: '$90'
	// 	},
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1480975200000,
	// 		system: 'Neteller',
	// 		amount: '$300'
	// 	},
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1481320800000,
	// 		system: 'Skrill',
	// 		amount: '$50'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1482012000000,
	// 		system: 'EcoPayz',
	// 		amount: '$150'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1482357600000,
	// 		system: 'Skrill',
	// 		amount: '$300'
	// 	},
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1484431200000,
	// 		system: 'Neteller',
	// 		amount: '$200'
	// 	},
	// 	{
	// 		transaction: 'Deposit',
	// 		date: 1484949600000,
	// 		system: 'Visa MC',
	// 		amount: '$100'
	// 	},
	// 	{
	// 		transaction: 'Withdraw',
	// 		date: 1485122400000,
	// 		system: 'EcoPayz',
	// 		amount: '$350'
	// 	}
	// ]
};

export default function transHistory(state = initialState, action)
{
	switch (action.type)
	{
		case TRANS_HISTORY_ON_LOAD:
			return {...state, transHistory : action.payload};

		case TRANS_HISTORY_SET_PAYMENT_FILTER:
			return {...state, paymentFilter : action.payload};

		case TRANS_HISTORY_SET_DATE_FILTER:
			return {...state, rangeFilter: {...action.payload}};

		default:
			return state
	}

}

