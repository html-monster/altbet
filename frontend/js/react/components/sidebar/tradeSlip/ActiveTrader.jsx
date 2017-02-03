import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import AnimateOnUpdate from '../../Animation.jsx';
import TraderDefaultForm from './activeTrader/traderDefaultForm';
import traderActions from '../../../actions/Sidebar/traderActions.ts';
import * as defaultOrderActions from '../../../actions/Sidebar/defaultOrderActions';
// import RebuildServerData from '../../../actions/Sidebar/activeTrader/rebuildServerData';

class ActiveTrader extends React.Component {
	constructor()
	{
		super();

		// this.state = {
		// 	activeString: null,
		// 	showDefaultOrder: false,
		// 	direction: null,
		// 	limit: true
		// };
	}

	componentDidMount()
	{
		this.props.traderActions.actionOnSocketMessage(this);
		/*let trader = $('.active_trader');
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
				__DEV__ && console.log('re-render');
			}

			setTimeout(activeTraderClass.scrollTo(), 100);
			tbody.addClass('scroll_dis');
			activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), true);
			activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
		});*/
	}

	/*objectConstructor(data, isMirror){
		let copyData = $.extend(true, {}, data);
		let price = 0.99,
				backendData = objectReconstruct(copyData.Orders),
				htmlData = [],
				className = 'ask';

		for(let ii = 1; ii <= 99; ii++){
			// htmlData.push(new RebuildServerData({
			// 	backendData,
			// 	className,
			// 	data,
			// 	price,
			// 	isMirror
			// }));
			htmlData.push(new object());
			price -= 0.01;
		}

		/!**
		 * на основе объекта с бэкенда формирует новый объект в формате ключ == price и добавляет side
		 * @param inData
		 * @returns {{}}
		 *!/
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
	}*/

	render()
	{
		// let {activeExchange} = this.props.cmpData;
		// 0||console.log( 'activeExchange', activeExchange );
		// const { activeString, showDefaultOrder } = this.state;
		const { data, ...info } = this.props;
		const { cmpData:{ activeExchange }, isMirror, orderInfo:{...orderInfo},
			rebuiltServerData, spread, quantity, traderActions, defaultOrderActions } = this.props;
		// let copyData = $.extend(true, {}, data);
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
        const bid = isMirror ?
			(data.Symbol && Math.round10(1 - data.Symbol.LastAsk, -2) != 1) ? Math.round10(1 - data.Symbol.LastAsk, -2) : ''
			:
			(data.Symbol && data.Symbol.LastBid != 0) ? data.Symbol.LastBid : '';
        const ask = isMirror ?
			(data.Symbol && Math.round10(1 - data.Symbol.LastBid, -2) != 1) ? Math.round10(1 - data.Symbol.LastBid, -2) : ''
			:
			(data.Symbol && data.Symbol.LastAsk != 1) ? data.Symbol.LastAsk : '';
		// let stringHtmlData = traderActions.actionOnServerDataRebuild(data, isMirror);

		return <div className="active_trader" style={{display: 'none'}} id={"trader_" + activeExchange.symbol}>
			<div className="event_title">
				<div className={$active + " event_name"} onClick={() => defaultOrderActions.actionOnTabMirrorClick(false)}></div>
				<div className={$activeM + " event_name reverse"} onClick={() => defaultOrderActions.actionOnTabMirrorClick(true)}></div>
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
						<td className={'buy_mkt confim buy market_button wave waves-effect waves-button' + (quantity && bid ? ' active clickable' : '')}>
							<button
								onClick={
									traderActions.actionAddOrder.bind(null, {
										direction: 'buy',
										price    : data.Symbol ? Math.round10(1 - data.Symbol.LastAsk, -2) : '',
										limit    : false
									}, 'market')}
								disabled={!quantity || !bid}>
								Buy MKT
							</button>
						</td>
						<td className={'sell_mkt confim sell market_button wave waves-effect waves-button' + (quantity && ask ? ' active clickable' : '')}>
							<button
								onClick={
									traderActions.actionAddOrder.bind(null, {
										direction: 'sell',
										price    : data.Symbol ? Math.round10(1 - data.Symbol.LastAsk, -2) : '',
										limit    : false
									}, 'market')}
								disabled={!quantity || !ask}>
								Sell MKT
							</button>
						</td>
						<td className="spreader label"><span>Spreader</span></td>
					</tr>
					<tr>
						<td>
							{
								orderInfo.activeString == 'market' && orderInfo.showDefaultOrder && quantity &&

								<TraderDefaultForm
									activeString={orderInfo.activeString}
									index={'market'}
									mainData={data}
									quantity={quantity}
									inputQuantityContext={this}
									{...info}
									{...orderInfo}
								/>
							}
						</td>
					</tr>
					<tr>
						<td className="label"><span>Quantity</span></td>
						<td className="volume quantity">
							<div className="input">
								<button className="clear" onClick={traderActions.actionOnQuantityClear.bind(null, this)}>{}</button>
								<input type="text" className="number quantity" data-validation="1" maxLength="8"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, this)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, this)}
									   value={quantity} ref={'inputQuantity'}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div><div className="regulator min"><span className="plus" title="Press Arrow Up" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 1)}>{}</span><span className="minus" title="Press Arrow Down" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, -1)}>{}</span></div>
							</div>
						</td>
						<td className="spread_container">
							<div className="input">
								<button className="clear" onClick={traderActions.actionOnSpreadClear.bind(null, this)}>{}</button>
								<input type="text" className="number spreader" maxLength="4" data-validation="0.1"
									   onMouseUp={traderActions.actionOnButtonSpreadChange.bind(null, this, '0.')}
									   onKeyDown={traderActions.actionOnButtonSpreadRegulator.bind(null, this)}
									   onChange={traderActions.actionOnSpreadChange.bind(null, this)}
									   value={spread} ref={'inputSpread'} disabled={!quantity}/>
								{
									!!quantity && <div className="regulator min"><span className="plus" title="Press Arrow Up" onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.01, true)}>{}</span><span className="minus" title="Press Arrow Down" onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, -0.01, true)}>{}</span></div>
								}
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
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 5)}>5</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 10)}>10</button></td>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 20)}>20</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 50)}>50</button></td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.01)} disabled={!quantity}>0.01</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.05)} disabled={!quantity}>0.05</button></td>
					</tr>
					<tr>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 100)}>100</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 200)}>200</button></td>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 500)}>500</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 1000)}>1000</button></td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.10)} disabled={!quantity}>0.10</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.15)} disabled={!quantity}>0.15</button></td>
					</tr>
					<tr>
						<td className={'join_bid buy market_button confim wave waves-effect waves-button' + (quantity && bid ? ' active clickable' : '')}>
							<button onClick={
								traderActions.actionAddOrder.bind(null, {
									direction: 'buy',
									price    : bid,
									limit    : true
								}, 'limit')}
								disabled={!quantity || !bid}>
								Join BID <span className="price">
									{
										bid
									}
								</span>
							</button>
						</td>
						<td className={'join_ask sell market_button confim wave waves-effect waves-button' + (quantity && ask ? ' active clickable' : '')}>
							<button onClick={
								traderActions.actionAddOrder.bind(null, {
									direction: 'sell',
									price    : ask,
									limit    : true
								}, 'limit')}
								disabled={!quantity || !ask}>
								<span className="price">
									{
										ask
									}
								</span> Join ASK
							</button>
						</td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.25)} disabled={!quantity}>0.25</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.30)} disabled={!quantity}>0.30</button></td>
					</tr>
					<tr>
						<td>
							{
								orderInfo.activeString == 'limit' && orderInfo.showDefaultOrder && quantity &&

								<TraderDefaultForm
									activeString={orderInfo.activeString}
									index={'limit'}
									mainData={data}
									quantity={quantity}
									inputQuantityContext={this}
									{...info}
									{...orderInfo}
								/>
							}
						</td>
					</tr>
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
			<div className={'table_limit' + (quantity ? ' clickable' : '')}>
				<table className={'limit' + ($.browser.webkit ? ' webkit' : '') + (quantity ? ' clickable' : '')}>
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
							rebuiltServerData.map((item, index) =>
								<TraderString
									data={item}
									key={item.Key}
									mainData={data}
									orderInfo={orderInfo}
									index={index}
									inputQuantityContext={this}
									{...info}
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
	constructor(props)
	{
		super();

		this.state = {
			index: props.index,
			// showDefaultOrder: false,
			direction: null,
			limit: true
		}
	}

	// shouldComponentUpdate(nextProps){
		// const currentData = this.props.data;
		// const nextData = nextProps.data;
		//
		// if(currentData.ClassName == nextData.ClassName &&
		// 	currentData.QuantityBuy == nextData.QuantityBuy &&
		// 	currentData.QuantitySell == nextData.QuantitySell &&
		// 	currentData.ParticularUserQuantityBuy == nextData.ParticularUserQuantityBuy &&
		// 	currentData.ParticularUserQuantitySell == nextData.ParticularUserQuantitySell &&
		// 	currentData.Bid == nextData.Bid &&
		// 	currentData.Ask == nextData.Ask &&
		// 	this.props.quantity == nextProps.quantity) return false;
		//
		// return true;
	// }

	addOrder(data)
	{
		const { addOrder, index, stringIndexTake, traderActions } = this.props;
		// const state = this.state;

		// state.direction = data.direction;
		// state.limit = data.limit;
		// state.showDefaultOrder = true;

		// traderActions.takeActiveFormContext(this);
		// traderActions.actionSetActiveString(index);
		traderActions.actionAddOrder(data, index);
	}

	render()
	{
		// const { traderActions, activeString, data, mainData, index, inputQuantityContext, isMirror, quantity } = this.props;
		const { data, index, orderInfo: {...info}, quantity, ...spread } = this.props;
		// const {  showDefaultOrder  } = this.state;
		// console.log(this.props);
		// let className = '';
		// if(data.Symbol.LastBid < data.Price && data.Symbol.LastAsk > data.Price){
		// 	className = 'active';
		// }
		// else if (data.Symbol.LastAsk < data.Price && Math.round(data.Price * 100))
		// if(showDefaultOrder) orderFormStyle.visibility = 'visible';

		return <AnimateOnUpdate
				component="tr"
				className="visible"
				transitionName={{
					enter: 'fadeOut',
				}}
				transitionAppear={false}
				transitionLeave={false}
				transitionEnterTimeout={800}
				data={data}
		>
			<td className={'my_offers my_size animated'} data-verify={'ParticularUserQuantityBuy'}>
					<span className="value">
						{
							data.ParticularUserQuantityBuy || ''
						}
					</span>
			</td>

			<td className={'size buy size_buy confim animated ' + (data.Bid ? 'best_buy' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantityBuy"
				onClick={
					spread.traderActions.actionAddOrder.bind(null, {
						direction: 'buy',
						price: data.Price,
						limit: true
					}, index)
				}
			>
				<span className="container">
					<span className="value">
						{
							data.QuantityBuy || ''
						}
					</span>
				</span>
			</td>
			{/*${data.ClassName}*/}
			<td className={`price_value ${data.Bid ? 'best_buy' : ''} ${data.Ask ? 'best_sell' : ''}`}>
				<span className="container"><span className="value">${(data.Price).toFixed(2)}</span></span>
			</td>
			<td className={'size sell size_sell confim animated ' + (data.Ask ? 'best_sell' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantitySell"
				onClick={
					spread.traderActions.actionAddOrder.bind(null, {
						direction: 'sell',
						price: data.Price,
						limit: true
					}, index)
				}
			>
				<span className="container">
					<span className="value">
						{
							data.QuantitySell || ''
						}
					</span>
				</span>
			</td>
			<td className={'my_bids my_size animated'} data-verify="ParticularUserQuantitySell">
				<span className="value">
					{
						data.ParticularUserQuantitySell || ''
					}
				</span>
			</td>
			<td>
				{
					index == info.activeString && info.showDefaultOrder && quantity &&

					<TraderDefaultForm
						activeString={info.activeString}
						index={index}
						quantity={quantity}
						{...spread}
						{...info}
					/>
				}
			</td>
		</AnimateOnUpdate>
	}
}

export default connect(state => ({
		...state.activeTrader,
	}),
	dispatch => ({
		traderActions: bindActionCreators(traderActions, dispatch),
		defaultOrderActions: bindActionCreators(defaultOrderActions, dispatch),
	})
)(ActiveTrader)