/**
 * Created by Htmlbook on 22.12.2016.
 */
import {
	ON_DEFAULT_ORDER_DELETE,
	ON_DEFAULT_ORDER_TYPE_CHANGE,
	ON_DEFAULT_ORDER_CREATE,
	// ON_DEFAULT_ORDER_AJAX_SEND,
	// ON_TAB_MIRROR_CHANGE,
} from '../../constants/ActionTypesDefaultOrders.js';
// console.log(ABpp);

	// mode: ABpp.config.basicMode,
const initialState = {
	// activeTabMirror: 1,
	orderNewData: [
		// {
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
		// },
		// {
		// 	"ID":"HC-DT-12192016_HC-DT_USD",
		// 	"EventTitle":"Hillary Clinton",
		// 	"Positions":0,
		// 	"isMirror":0,
		// 	"Orders":[
		// 		{
		// 			"Category":"Society",
		// 			"Price":0.75,
		// 			"Side":1,
		// 			"Symbol":{
		// 				"Exchange":"HC-DT-12192016",
		// 				"Name":"HC-DT",
		// 				"Currency":"USD"
		// 			},
		// 			"Volume":666,
		// 			"Limit":false,
		// 			"NewOrder": true,
		// 			"isMirror":0
		// 		},
		// 		{
		// 			"Category":"Society",
		// 			"Price":'0.',
		// 			"Side":0,
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
		// },
		// {
		// 	"ID":"NYG-WAS-12252016_NYG-WAS_USD",
		// 	"EventTitle":"Washington Redskins",
		// 	"Positions":50,
		// 	"isMirror":1,
		// 	"Orders":[
		// 		{
		// 			"Category":"Society",
		// 			"Price":'0.',
		// 			"Side":1,
		// 			"Symbol":{
		// 				"Exchange":"NYG-WAS-12252016",
		// 				"Name":"NYG-WAS",
		// 				"Currency":"USD"
		// 			},
		// 			"Limit":true,
		// 			"NewOrder": true,
		// 			"isMirror":1
		// 		},
		// 		{
		// 			"Category":"Society",
		// 			"Price":0.43,
		// 			"Side":0,
		// 			"Symbol":{
		// 				"Exchange":"NYG-WAS-12252016",
		// 				"Name":"NYG-WAS",
		// 				"Currency":"USD"
		// 			},
		// 			"Volume":252,
		// 			"Limit":true,
		// 			"NewOrder": true,
		// 			"isMirror":1
		// 		},
		// 	]
		// }
	],
};


export default function tradeSlip(state = initialState, action)
{
	switch (action.type)
	{
		case ON_DEFAULT_ORDER_DELETE:
			return {...state, orderNewData: action.payload};

		case ON_DEFAULT_ORDER_TYPE_CHANGE:
			return {...state, orderNewData: action.payload};

		case ON_DEFAULT_ORDER_CREATE:
			return {...state, orderNewData: action.payload};

		// case ON_TAB_MIRROR_CHANGE:
		// // 0||console.log( 'isMirror', action.payload );
		// 	return {...state, activeTabMirror: action.payload.isMirror ? 2 : 1};

		default:
			return state
	}

}
