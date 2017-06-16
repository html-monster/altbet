/**
 * Created by Htmlbook on 09.06.2017.
 */

import {
	ON_MP_ORDER_CREATE,
	ON_MP_ORDER_DELETE
} from '../constants/ActionTypesDefaultOrdersLocal';

const initialState = {
	showOrder: false,
	orderData: {
		// 	"ID":"BBB-NNN-12312016_BBB-NNN_USD",
		// 	"EventTitle":"Hillary Clinton",
		// 	"Positions":0,
		// 	"isMirror":0,
		// 	"Orders":[
		// 		{
		// 			"Category":"Society",
		// 			"Price":0.53,
		// 			"Side":0,
		// 			"Symbol":{
		// 				"Exchange":"BBB-NNN-12312016",
		// 				"Name":"BBB-NNN",
		// 				"Currency":"USD"
		// 			},
		// 			"Volume":4,
		// 			"Limit":false,
		// 			"NewOrder": true,
		// 			"isMirror":0
		// 		},
		// 		{
		// 			"Category":"Society",
		// 			"Price":'0.',
		// 			"Side":1,
		// 			"Symbol":{
		// 				"Exchange":"HC-DT-12192016",
		// 				"Name":"HC-DT",
		// 				"Currency":"USD"
		// 			},
		// 			"Limit":true,
		// 			"NewOrder": true,
		// 			"isMirror":0
		// 		}
		// 	]
	},
};


export default function defaultOrdersLocal(state = initialState, action)
{
	switch (action.type)
	{
		case ON_MP_ORDER_CREATE:
			return {...state, ...action.payload};

		case ON_MP_ORDER_DELETE:
			return {...state, showOrder: action.payload};

		default:
			return state
	}

}
