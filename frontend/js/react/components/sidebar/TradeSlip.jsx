/**
 * Created by Htmlbook on 13.12.2016.
 */
import React from 'react';
import NewOrder from './order/NewOrder.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';
let data = [
	{
		"ID":"HC-DT-12192016_HC-DT_USD",
		"EventTitle":"Hillary Clinton",
		"Positions":0,
		"isMirror":0,
		"Orders":[
			{
				"Category":"Society",
				"Price":0.75,
				"Side":1,
				"Symbol":{
					"Exchange":"HC-DT-12192016",
					"Name":"HC-DT",
					"Currency":"USD"
				},
				"Volume":666,
				"Limit":false,
				"NewOrder": true,
				"isMirror":0
			},
			{
				"Category":"Society",
				"Price":'0.',
				"Side":0,
				"Symbol":{
					"Exchange":"HC-DT-12192016",
					"Name":"HC-DT",
					"Currency":"USD"
				},
				"Limit":true,
				"NewOrder": true,
				"isMirror":0
			}
		]
	},
	{
		"ID":"NYG-WAS-12252016_NYG-WAS_USD",
		"EventTitle":"Washington Redskins",
		"Positions":50,
		"isMirror":1,
		"Orders":[
			{
				"Category":"Society",
				"Price":0.22,
				"Side":1,
				"Symbol":{
					"Exchange":"NYG-WAS-12252016",
					"Name":"NYG-WAS",
					"Currency":"USD"
				},
				"Volume":252,
				"Limit":false,
				"NewOrder": true,
				"isMirror":1
			},
			{
				"Category":"Society",
				"Price":'0.',
				"Side":0,
				"Symbol":{
					"Exchange":"NYG-WAS-12252016",
					"Name":"NYG-WAS",
					"Currency":"USD"
				},
				"Limit":true,
				"NewOrder": true,
				"isMirror":1
			},
		]
	}
];
export default class TradeSlip extends React.Component{
	constructor(props)
	{
		super();
		this.state = {data: data}
	}

	render()
	{
		let data = this.state.data;
		return <div className="tab_item" id="order">

			<div className="default_orders">
				{
					(data.length == 0) ?
						<p id="default_order_info">MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON ACTIVE BETTOR ABOVE.</p>
					:
						/* // BM: --------------------------------------------------- NEW ORDER ---*/
						data.map((item) =>
							<NewOrder data={item} key={`${item.ID}-${item.isMirror}`}/>
						)
				}
			</div>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			<ActiveTrader data={{}}/>

		</div>
	}
}