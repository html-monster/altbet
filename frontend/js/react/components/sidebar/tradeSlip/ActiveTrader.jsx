import React from 'react';
import AnimateOnUpdate from '../../Animation.jsx';

export default class ActiveTrader extends React.Component {
	constructor(props) {
		super();

		this.state = {data: props.data};
	}

	componentDidMount() {
		let trader = $('.active_trader');
		let tbody	= $('table.limit tbody');
		let isMirror;

		window.ee.addListener('activeOrders.update', (newData) => {
			// if($('#IsMir	ror').length)
			// 	isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
			// else
			// 	isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;
			isMirror = !this.props.cmpData.activeExchange.isMirror ? 0 : 1;

			// let symbol = $('.active_trader').attr('id');
			// if(!symbol) return;
			// symbol = symbol.slice(7);
			let symbol = this.props.cmpData.activeExchange.name;

			let currSymbData = {};
			$(newData).each(function(){
				// let currentSymbol = `${this.Symbol.Exchange}_${this.Symbol.Name}_${this.Symbol.Currency}`;
				let currentSymbol = this.Symbol.Exchange;
				console.log(symbol == currentSymbol);
				if(symbol == currentSymbol) {
					currSymbData = this;
					return false;
				}
			});

			// newData = Object.assign({}, this.state.data, newData);
			if(currSymbData && currSymbData.Symbol){
				if(currSymbData.Symbol.LastAsk == 1) currSymbData.Symbol.LastAsk = null;
				if(currSymbData.Symbol.LastBid == 0) currSymbData.Symbol.LastBid = null;
			}
			if(JSON.stringify(this.state.data) != JSON.stringify(currSymbData) || this.state.isMirror != isMirror){
				this.setState({data: currSymbData, isMirror: isMirror});
// 0||console.debug( 're-render', currSymbData, newData, symbol );
			}

			activeTraderClass.scrollTo();
			tbody.addClass('scroll_dis');
			activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), true);
			activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
		});
	}

	objectConstructor(data, isMirror){
		let copyData = $.extend(true, {}, data);
		let price = 0.99,
				backendData = objectReconstruct(copyData.Orders),
				htmlData = [],
				className = 'ask';

		for(var ii = 1; ii <= 99; ii++){
			htmlData.push(new object());
			price -= 0.01;
		}

		/**
		 * на основе объекта с бэкенда формирует новый объект в формате ключ == price и добавляет side
		 * @param inData
		 * @returns {{}}
		 */
		function objectReconstruct(inData){
			let newData = {};

			$(inData).each(function(){
				let sideData = this;
				if(sideData.SummaryPositionPrice){
					$(sideData.SummaryPositionPrice).each(function(){
						let item = this;
						if(isMirror) item.Side = sideData.Side == 1 ? 0 : 1;
						else item.Side = sideData.Side;

						item.Price = isMirror ? Math.round10(1 - item.Price, -2) : item.Price;
						newData[(item.Price).toString()] = item;
					});
				}
			});

			return newData;
		}

		function object() {
			price = Math.round10(price, -2);
			this.Key = 'trader_' + price;
			this.Price = price;
			if(backendData[price]){
				if(backendData[price].Side) {
					this.ParticularUserQuantitySell = backendData[price].ParticularUserQuantity;
					this.QuantitySell = backendData[price].Quantity;
				}
				else{
					this.ParticularUserQuantityBuy = backendData[price].ParticularUserQuantity;
					this.QuantityBuy = backendData[price].Quantity;
				}
				if(isMirror){
					if(data.Symbol && price == Math.round10(1 - data.Symbol.LastAsk, -2)) this.Bid = Math.round10(1 - data.Symbol.LastAsk, -2);
					if(data.Symbol && price == Math.round10(1 - data.Symbol.LastBid, -2)) this.Ask = Math.round10(1 - data.Symbol.LastBid, -2);
				}
				else{
					if(data.Symbol && price == data.Symbol.LastBid) this.Bid = data.Symbol.LastBid;
					if(data.Symbol && price == data.Symbol.LastAsk) this.Ask = data.Symbol.LastAsk;
				}
				if(this.Bid) className = 'bid';
			}
			if(!data.Symbol) {className = 'mid'; }
			this.ClassName = className;
			if(this.Ask){
				if(data.Symbol.LastAsk && data.Symbol.LastBid)
					className = 'mid';
				else
					className = 'bid';
			}
		}
		// console.log(htmlData);
		return htmlData;
	}

	render()
	{
		var {activeExchange} = this.props.cmpData;
		// 0||console.log( 'activeExchange', activeExchange );
		let data = this.state.data;
		let copyData = $.extend(true, {}, data);
		let isMirror = this.state.isMirror;
		let className, $active, $activeM;
		className = $active = $activeM = '';
		( !activeExchange.isMirror ) ? ($active = 'active') : ($activeM = 'active');

        let gainLoss = data && data.GainLoss ? data.GainLoss : '';
        if (data) {
            if (gainLoss < 0)
                className = 'loss';
            else if (gainLoss > 0)
                className = 'profit';
        }

		let stringHtmlData = this.objectConstructor(data, isMirror);

		return <div className="active_trader" style={{display: 'none'}}>
			<div className="event_title">
				<div className={$active + " event_name"} onClick={() => this.props.actions.actionOnTabMirrorClick(false)}></div>
				<div className={$activeM + " event_name reverse"} onClick={() => this.props.actions.actionOnTabMirrorClick(true)}></div>
			</div>
			<table className="info">
				<tbody>
				<tr>
					<td className="open_pnl trader_info">
						<a href="#">
							P/L
							<span className={'quantity ' + className}>{gainLoss && gainLoss < 0 ? `($${(gainLoss).toString().slice(1)})` :
							'$' + (gainLoss || '')}</span>
							<span className="help"><span className="help_message right"><strong>Profit in this event</strong></span></span>
						</a>
					</td>
					<td className="open_contracts trader_info">
						<a href="#">
							Quantity
							<span className="quantity up">{data.Positions}</span>
							<span className="help"><span className="help_message"><strong>Open postions</strong></span></span>
						</a>
					</td>
					<td className="amount trader_info">
						<a href="#">
							Avg. Price
							<span className="quantity up">26</span>
							<span className="help"><span className="help_message"><strong>Average price of postion</strong></span></span>
						</a>
					</td>
				</tr>
				</tbody>
			</table>
			<table className="control">
				<tbody>
					<tr>
						<td className="buy_mkt confim buy market_button wave"><button>Buy MKT</button></td>
						<td className="sell_mkt confim sell market_button wave"><button>Sell MKT</button></td>
						<td className="spreader label"><span>Spreader</span></td>
					</tr>
					<tr>{}</tr>
					<tr>
						<td className="label"><span>Quantity</span></td>
						<td className="volume quantity">
							<div className="input">
								<button className="clear">{}</button>
								<input type="text" className="number quantity" data-validation="1" maxLength="8"/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div><div className="regulator min"><span className="plus" title="Press Arrow Up"></span><span className="minus" title="Press Arrow Down"></span></div>
							</div>
						</td>
						<td className="spread_container">
							<div className="input">
								<button className="clear">{}</button>
								<input type="text" className="number spreader" maxLength="4" disabled/>
								<div className="warning" style={{display: 'none'}}>
									<p>Available value from 0.01 to 0.99</p>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table className="control">
				<tbody>
					<tr>
						<td className="button quantity"><button className="btn wave">5</button><button className="btn wave">10</button></td>
						<td className="button quantity"><button className="btn wave">20</button><button className="btn wave">50</button></td>
						<td className="button spread"><button className="wave" disabled>0.01</button><button className="wave" disabled>0.05</button></td>
					</tr>
					<tr>
						<td className="button quantity"><button className="btn wave">100</button><button className="btn wave">200</button></td>
						<td className="button quantity"><button className="btn wave">500</button><button className="btn wave">1000</button></td>
						<td className="button spread"><button className="wave" disabled>0.10</button><button className="wave" disabled>0.15</button></td>
					</tr>
					<tr>
						<td className="join_bid buy market_button confim wave">
							<a href="#">
								Join BID <span className="price">{(data.Symbol && data.Symbol.LastBid != 0) ? data.Symbol.LastBid : ''}</span>
							</a>
						</td>
						<td className="join_ask sell market_button confim wave">
							<a href="#">
								<span className="price">{(data.Symbol && data.Symbol.LastAsk != 1) ? data.Symbol.LastAsk : ''}</span> Join ASK
							</a>
						</td>
						<td className="button spread"><button className="wave" disabled>0.25</button><button className="wave" disabled>0.30</button></td>
					</tr>
					<tr>{}</tr>
				</tbody>
			</table>
			<div className="active_trader_footer">
				<table className="remote control">
					<tbody>
					<tr>
						<td className="reverse active">
							<a href="#" className="ReverseAllJs">Reverse</a>
							<div className="confirm_window animated">
								<div className="container">
									<span>Do you really want do it?</span>
									<div className="button_container">
										<button className="btn wave yes">Yes</button>
										<button className="btn wave no">No</button>
									</div>
								</div>
							</div>
						</td>
						<td className="cancel_all active">
							<a href="#" className="CancelAllJs">Cancel All</a>
							<div className="confirm_window animated">
								<div className="container">
									<span>Do you really want do it?</span>
									<div className="button_container">
										<button className="btn wave yes">Yes</button>
										<button className="btn wave no">No</button>
									</div>
								</div>
							</div>
						</td>
						<td className="close_out active">
							<a href="#" className="CloseOutJs">Close Out</a>
							<div className="confirm_window animated">
								<div className="container">
									<span>Do you really want do it?</span>
									<div className="button_container">
										<button className="btn wave yes">Yes</button>
										<button className="btn wave no">No</button>
									</div>
								</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div className="table_limit">
				<table className="limit">
					<thead>
						<tr>
							<th>My Bids</th>
							<th>Size</th>
							<th>Price</th>
							<th>Size</th>
							<th>My Offers</th>
						</tr>
					</thead>
					<tbody>
						{
							stringHtmlData.map((item) =>
									<TraderString
											key={item.Key}
											mainData={copyData}
											data={item}
											isMirror={isMirror}
									/>
							)
						}
					</tbody>
				</table>
			</div>
		</div>
	}
}


class TraderString extends React.Component {
	constructor()
	{
		super();
	}

	shouldComponentUpdate(nextProps){
		let currentData = this.props.data;
		let nextData = nextProps.data;

		if(currentData.ClassName == nextData.ClassName &&
			currentData.QuantityBuy == nextData.QuantityBuy &&
			currentData.QuantitySell == nextData.QuantitySell &&
			currentData.ParticularUserQuantityBuy == nextData.ParticularUserQuantityBuy &&
			currentData.ParticularUserQuantitySell == nextData.ParticularUserQuantitySell &&
			currentData.Bid == nextData.Bid &&
			currentData.Ask == nextData.Ask) return false;

		return true;
	}

	render()
	{
		let data = this.props.data;
		// console.log(data);

		return <AnimateOnUpdate
				component="tr"
				className="visible"
				transitionName={{
					enter: 'fadeOut',
					leave: 'fadeOut',
					appear: 'fadeOut'
				}}
				transitionAppear={false}
				transitionAppearTimeout={1500}
				transitionEnterTimeout={800}
				transitionLeaveTimeout={500}
				data={data}
		>
			<td className="my_offers my_size animated" data-verify={'ParticularUserQuantityBuy'}>
					<span className="value">
						{
							data.ParticularUserQuantityBuy || ''
						}
					</span>
			</td>

			<td className={'size buy size_buy confim animated ' + (data.Bid ? 'best_buy' : '')} data-verify="QuantityBuy">
				<span className="container">
					<span className="value">
						{
							data.QuantityBuy|| ''
						}
					</span>
				</span>
			</td>
			<td className={`price_value ${data.ClassName} ${data.Bid ? 'best_buy' : ''} ${data.Ask ? 'best_sell' : ''}`}>
				<span className="container"><span className="value">${(data.Price).toFixed(2)}</span></span>
			</td>
			<td className={'size sell size_sell confim animated ' + (data.Ask ? 'best_sell' : '')} data-verify="QuantitySell">
				<span className="container">
					<span className="value">
						{
							data.QuantitySell || ''
						}
					</span>
				</span>
			</td>
			<td className="my_bids my_size animated" data-verify="ParticularUserQuantitySell">
				<span className="value">
					{
						data.ParticularUserQuantitySell || ''
					}
				</span>
			</td>
			<td>{}</td>
		</AnimateOnUpdate>
	}
}