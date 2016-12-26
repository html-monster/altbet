import {
	ON_TRADER_ON,
	ON_TAB_SWITCH,
} from "../constants/ActionTypesSidebar.js";



// export function actionOnDeleteOrder(orderContainer, order)
// {
//     return (dispatch, getState) =>
// 	{
// 	    // console.log('ON_DEFAULT_ORDER_DELETE', ON_DEFAULT_ORDER_DELETE, getState());
//
// 		let orderId;
// 		if(order.Side !== undefined	)
// 			orderId = order.Side;
// 		else
// 			orderId = orderContainer.ID;
//
// 		let newOrders = getState().sidebar.orderNewData.filter(function(itemContainer) {
// 			if(order.Side !== undefined && itemContainer.ID === orderContainer.ID){
// 				itemContainer.Orders = itemContainer.Orders.filter((item) => item.Side !== orderId);
// 				if(itemContainer.Orders.length)
// 					return true;
// 				else
// 					return false;
// 			}
// 			else
// 				return itemContainer.ID !== orderId;
// 		});
// 		// console.log(newOrders);
//
//         dispatch({
//             type: ON_DEFAULT_ORDER_DELETE,
//             payload: newOrders
//         });
//     }
// }
