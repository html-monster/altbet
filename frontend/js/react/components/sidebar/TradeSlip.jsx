/**
 * Created by Htmlbook on 13.12.2016.
 */
import React from 'react';
import NewOrder from './order/NewOrder.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';

export default class TradeSlip extends React.Component{
	constructor(props)
	{
		super();
		this.state = {data: props.data}
	}

	render()
	{
		let data = [];
		return <div className="tab_item" id="order">

			<div className="default_orders">
				<p id="default_order_info">MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON
					ACTIVE BETTOR ABOVE.</p>
				{/* // BM: --------------------------------------------------- NEW ORDER ---*/}
				{
					data.map((item) =>
						<NewOrder data={item}/>
					)
				}

			</div>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			<ActiveTrader data={{}}/>

		</div>
	}
}