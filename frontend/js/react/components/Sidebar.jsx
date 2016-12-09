import React from 'react';
import EventOrders from './sidebar/YourOrders.jsx';
import NewOrder from './sidebar/order/NewOrder.jsx';
import ActiveTrader from './sidebar/ActiveTrader.jsx';

// let awesomeData = {"CategoryList":null,"CategoryName":null,"GainLoss":-1960.8,"Invested":5409.2,"Orders":[{"Side":1,"SummaryPositionPrice":[{"ParticularUserQuantity":6,"Price":0.5,"Quantity":6},{"ParticularUserQuantity":0,"Price":0.53,"Quantity":4000},{"ParticularUserQuantity":50,"Price":0.54,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.55,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.56,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.57,"Quantity":50},{"ParticularUserQuantity":20,"Price":0.58,"Quantity":20}]},{"Side":0,"SummaryPositionPrice":[{"ParticularUserQuantity":5,"Price":0.4,"Quantity":5}]}],"Positions":8616,"Symbol":{"AwayAlias":"NNN","AwayHandicap":3.5,"AwayName":"New England Patriots","AwayPoints":null,"CategoryId":"1518ed47-ee93-4979-93de-344d526c3e36","Currency":"USD","Exchange":"BBB-NNN-12312016","FullName":"Buffalo Bills_vs_New England Patriots","HomeAlias":"BBB","HomeHandicap":-3.5,"HomeName":"Buffalo Bills","HomePoints":null,"LastAsk":0.5,"LastBid":0.4,"LastPrice":0.48,"LastSide":0,"Name":"BBB-NNN","StartDate":"/Date(1483138800000+0200)/","Status":"inprogress"}};
export default class Sidebar extends React.Component
{
	constructor(props)
	{
		super();

		this.state = {globalData: props.globalData};
	}
	render()
	{
		const sideBarData = this.props.data;
		return <div className="left_order">
			<div className="wrapper">
				<div className="tabs">
						<span className="tab active">
							Trade Slip
							<label className="trader">
								{
										(this.state.globalData.tradeOn) ?
											<input type="checkbox" name="limit" className="limit" defaultChecked="true"/>
										:
											<input type="checkbox" name="limit" className="limit"/>
								}
								<span>
									Active bettor
									<span className="help">
										<span className="help_message">
											<strong>The Active Bettor interface offers some slick, highly sophisticated, super user friendly, never offered before in the betting world, functionalities, so fasten your seatbelts and off you go to the market - fast!</strong>
										</span>
									</span>
								</span>
							</label>
						</span>
					<span className="tab">
							Your Orders
							<label className="auto_trade">
								{
									(this.state.globalData.autoTradeOn) ?
										<input type="checkbox" name="auto" className="auto" defaultChecked="true"/>
									:
										<input type="checkbox" name="auto" className="auto"/>
								}
								<span>
									Auto trade
									<span className="help">
										<span className="help_message">
											<strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, vel?</strong>
										</span>
									</span>
								</span>
							</label>
						</span>
				</div>
				<div className="tab_content order-content">
					<div className="tab_item" id="order">
						<div className="default_orders">
							<p id="default_order_info">MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON ACTIVE BETTOR ABOVE.</p>
						</div>

						{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
						<ActiveTrader data={{}} />

					</div>

					{/* // BM: --------------------------------------------------- YOUR ORDERS ---*/}
					<EventOrders data={sideBarData}/>

				</div>
			</div>
			<div className="template">

				{/* // BM: --------------------------------------------------- NEW ORDER ---*/}
				<NewOrder data={{}}/>

				<div className="order_content default" style={{position: 'absolute', left: 0, zIndex: 10, opacity: 0, marginTop: 5}}>
					<div className="sell-container">
						<form action="/AltBet/Home/Index?Length=4" autoComplete="off" data-ajax="true" data-ajax-begin="ajaxControllerClass.OnBeginJs" data-ajax-failure="ajaxControllerClass.OnFailureJs" data-ajax-success="ajaxControllerClass.OnSuccessJs" data-ajax-url="/AltBet/Order/Create" method="post" noValidate="novalidate">
							<div className="container">
								<div className="price ">
									<label>Price</label>
									<div className="input">
										<input autoComplete="off" className="number" data-validation="0.33" maxLength="4" name="LimitPrice" type="text" value="" disabled="disabled"/>
										<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
									</div>
								</div>
								<div className="volume">
									<label>Quantity</label>
									<div className="input">
										<input autoComplete="off" className="number quantity" data-validation="123" maxLength="8" name="Quantity" type="text" value=""/>
										<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
										<div className="regulator">
											<span className="plus" title="Press Arrow Up">{}</span>
											<span className="minus" title="Press Arrow Down">{}</span>
										</div>
									</div>
								</div>
								<div className="obligations ">
									<label>Sum</label>
									<div className="input">
										<input type="text" className="number" data-validation="40.59" maxLength="8" disabled="disabled"/>
										<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>
									</div>
								</div>
							</div>
							<input className="side" name="Side" type="hidden" value=""/>
							<input className="symbol" name="Symbol" type="hidden" value=""/>
							<input className="mirror" name="isMirror" type="hidden" value=""/>
							<input className="direction" name="OrderType" type="hidden" value=""/>
							<input className="price_value" name="LimitPrice" type="hidden" value=""/>
							<div className="container">
								<input type="submit" className="btn sell" value="Sell" style={{textTransform: 'uppercase'}}/>
								<span className="delete "></span>
								<div className="checkbox"></div>
							</div>
						</form>
					</div>
					<div className="buy-container"></div>
				</div>
				<div className="order_content spread" style={{position: 'absolute', left: 0, zIndex: 10, opacity: 0, marginTop: 5}}>
					<div className="sell-buy-container">
						<form action="/AltBet/Home/Index" data-ajax="true" data-ajax-begin="ajaxControllerClass.OnBeginJs" data-ajax-failure="ajaxControllerClass.OnFailureJs" data-ajax-success="ajaxControllerClass.OnSuccessJs" data-ajax-url="/AltBet/Order/Spreader" method="post" noValidate="novalidate">
							<div className="container">
								<div className="price sell">
									<label>Selling price</label>
									<div className="input">
										<input type="text" className="number" data-validation="0.33" maxLength="4" disabled="disabled"/>
										<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
									</div>
								</div>
								<div className="volume">
									<label>Quantity</label>
									<div className="input">
										<input className="number quantity" data-validation="123" maxLength="8" name="SellOrderQuantity" type="text" value=""/>
										<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
										<div className="regulator">
											<span className="plus" title="Press Arrow Up">{}</span>
											<span className="minus" title="Press Arrow Down">{}</span>
										</div>
									</div>
								</div>
								<div className="success"><input type="submit" className="success_btn" value=""/></div>
							</div>
							<input className="symbol" name="Symbol" type="hidden" value=""/>
							<input className="mirror" name="isMirror" type="hidden" value=""/>
							<input className="SellOrderLimitPrice" name="SellOrderLimitPrice" type="hidden" value=""/>
							<input className="BuyOrderLimitPrice" name="BuyOrderLimitPrice" type="hidden" value=""/>
							<div className="container">
								<div className="price buy">
									<label>Buying price</label>
									<div className="input">
										<input type="text" className="number" data-validation="0.33" maxLength="4" disabled="disabled"/>
										<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
									</div>
								</div>
								<div className="volume">
									<label>Quantity</label>
									<div className="input">
										<input className="number quantity" data-validation="123" maxLength="8" name="BuyOrderQuantity" type="text" value=""/>
										<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
										<div className="regulator">
											<span className="plus" title="Press Arrow Up">{}</span>
											<span className="minus" title="Press Arrow Down">{}</span>
										</div>
									</div>
								</div>
								<span className="delete"></span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	}
}
