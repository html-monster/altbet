/**
 * Created by Htmlbook on 13.12.2016.
 */
import React from 'react';
import NewOrder from './order/NewOrder.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';
let data = [{"ID":"HC-DT-12192016_HC-DT_USD","LastPrice":0.51,"LastSide":0,"Orders":[{"Category":"Society","ID":"f93b7184-8b49-4d12-bfe1-62920678b6ca","Price":0.5,"Side":0,"Symbol":{"AwayAlias":"DT","AwayHandicap":null,"AwayName":"Donald Trump","AwayPoints":null,"CategoryId":"f2ad43d6-22db-43aa-95ad-5572e3a1b960","Currency":"USD","Exchange":"HC-DT-12192016","FullName":"Hillary Clinton_vs_Donald Trump","HomeAlias":"HC","HomeHandicap":null,"HomeName":"Hillary Clinton","HomePoints":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.51,"LastSide":0,"Name":"HC-DT","StartDate":"/Date(1482141600000+0200)/","Status":"inprogress"},"Time":"/Date(1480670933720)/","Volume":20,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Hillary Clinton"}];
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
							<NewOrder data={item} key={item.ID}/>
						)
				}
			</div>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			<ActiveTrader data={{}}/>

		</div>
	}
}