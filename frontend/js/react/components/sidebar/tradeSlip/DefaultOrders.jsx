/**
 * Created by Htmlbook on 19.12.2016.
 */

import React from 'react';
import NewOrder from '../order/NewOrder.jsx'

export default class DefaultOrders extends React.Component{
	constructor(props)
	{
		super();
		// this.state = {data: props.data};
	}

	// componentDidMount(){
	// 	let data = {
	// 		"ID":"ARS-CHE-3122017_ARS-CHE_USD",
	// 		"EventTitle":"Chelsea",
	// 		"Positions":0,
	// 		"isMirror":0,
	// 		"Orders":[
	// 			{
	// 				"Category":"Society",
	// 				"Price":0.4,
	// 				"Side":0,
	// 				"Symbol":{
	// 					"Exchange":"ARS-CHE-3122017",
	// 					"Name":"ARS-CHE",
	// 					"Currency":"USD"
	// 				},
	// 				"Volume":155,
	// 				"Limit":true,
	// 				"NewOrder": true,
	// 				"isMirror":1
	// 			},
	// 		]
	// 	};
	// 	let data2 = {
	// 		"ID":"NYG-WAS-12252016_NYG-WAS_USD",
	// 		"EventTitle":"Washington Redskins",
	// 		"Positions":0,
	// 		"isMirror":0,
	// 		"Orders":[
	// 			{
	// 				"Category":"Society",
	// 				"Price":0.3,
	// 				"Side":0,
	// 				"Symbol":{
	// 					"Exchange":"NYG-WAS-12252016",
	// 					"Name":"NYG-WAS",
	// 					"Currency":"USD"
	// 				},
	// 				"Volume":155,
	// 				"Limit":true,
	// 				"NewOrder": true,
	// 				"isMirror":1
	// 			},
	// 		]
	// 	};
	// 	window.actions = this.props.actions.actionOnOrderCreate;
	// 	setTimeout(() => {
	// 		this.props.actions.actionOnOrderCreate(data);
	// 	}, 2000);
	// 	setTimeout(() => {
	// 		this.props.actions.actionOnOrderCreate(data);
	// 	}, 4000);
	// }

	onDeleteOrderHandler(orderContainer, order)
	{
		// let orderId;
		// if(order.Side !== undefined)
		//  orderId = order.Side;
		// else
		//  orderId = orderContainer.ID;
		//
		// let newOrders = this.state.data.filter(function(itemContainer) {
		// 	if(order.Side !== undefined && itemContainer.ID === orderContainer.ID){
		// 		itemContainer.Orders = itemContainer.Orders.filter((item) => item.Side !== orderId);
		// 		if(itemContainer.Orders.length)
		// 			return true;
		// 		else
		// 			return false;
		// 	}
		// 	else
		// 		return itemContainer.ID !== orderId;
		// });
		// this.setState({ data: newOrders });
	}

	render()
	{
		let data = this.props.data;
		return <div className="default_orders">
			{
				(data && data.length == 0) ?
						<p id="default_order_info">MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON ACTIVE BETTOR ABOVE.</p>
					:
						/* // BM: --------------------------------------------------- NEW ORDER ---*/
						data.map((item) =>
							<NewOrder
								data={item}
								key={`${item.ID}-${item.isMirror}`}
								onDeleteOrderHandler={this.props.actions.actionOnDeleteOrder.bind(this, item)}
								actions={this.props.actions}
							/>
						)
			}
		</div>
	}
}
