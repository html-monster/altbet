import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import AnimateOnUpdate from '../../Animation.jsx';
import TraderDefaultForm from './activeTrader/TraderDefaultForm';
import TraderSpreadForm from './activeTrader/TraderSpreadForm';
import traderActions from '../../../actions/Sidebar/tradeSlip/traderActions';
import defaultOrderActions from '../../../actions/Sidebar/tradeSlip/defaultOrderSidebarActions';
import OddsConverter from '../../../models/oddsConverter/oddsConverter.js';
// import RebuildServerData from '../../../actions/Sidebar/activeTrader/rebuildServerData';

class ActiveTrader extends React.Component {
	constructor()
	{
		super();
	}

	componentDidMount()
	{
		this.props.traderActions.actionOnSocketMessage(this);
		activeTraderClass.tbodyResize();
	}

	// shouldComponentUpdate(nextProps)
	// {
	// 	// console.log(nextProps.cmpData.traderOn);
	// 	if(!nextProps.cmpData.traderOn) return false;
	//
	// 	return true;
	// }

	render()
	{
		// let {activeExchange} = this.props.cmpData;
		// 0||console.log( 'activeExchange', activeExchange );
		// const { activeString, showDefaultOrder } = this.state;
		const { data, ...info } = this.props;
		const { activeExchangeSymbol, dragData: { popUpShow }, cmpData:{ activeExchange, traderOn, autoTradeOn }, isMirror, orderInfo:{...orderInfo},
			rebuiltServerData, spread, showQuantityError, quantity, traderActions } = this.props;
		// let copyData = $.extend(true, {}, data);
		// let className, $active, $activeM;
		let className = '';
		// className = $active = $activeM = '';
		// ( !activeExchange.isMirror ) ? ($active = 'active') : ($activeM = 'active');

        let gainLoss = JSON.stringify(data) !== '{}' ? data.GainLoss : '$0.00';

        if(gainLoss !== '$0.00') gainLoss = gainLoss < 0 ? `($${(Math.abs(gainLoss)).toFixed(2)})` : '$' + (gainLoss).toFixed(2);

        if (JSON.stringify(data) !== '{}') {
            if (data.GainLoss < 0)
                className = 'loss';
            else if (data.GainLoss > 0)
                className = 'profit';
        }
        const bid = isMirror ?
			(data.Symbol && data.Symbol.LastAsk) ? Math.round10(1 - data.Symbol.LastAsk, -2) : ''
			:
			(data.Symbol && data.Symbol.LastBid) ? data.Symbol.LastBid : '';
        const ask = isMirror ?
			(data.Symbol && data.Symbol.LastBid) ? Math.round10(1 - data.Symbol.LastBid, -2) : ''
			:
			(data.Symbol && data.Symbol.LastAsk) ? data.Symbol.LastAsk : '';


		return <div className="active_trader" id="active_trader" style={traderOn ? {} : {display: 'none'}}
					ref={'activeTrader'}
					onClick={traderActions.actionHideDirectionConfirm}>
			{/*{*/}
				{/*ABpp.config.currentPage === ABpp.CONSTS.PAGE_MAIN ?*/}
					{/*<div className="event_title">*/}
						{/*<div className={'event_name' + (!activeExchange.isMirror ? ' active' : '')}*/}
							 {/*onClick={traderActions.actionOnTabMirrorClick.bind(null, this, false)}>*/}
							{/*{*/}
								{/*activeExchange.homeName//JSON.stringify(data) !== '{}' && ${data.Symbol.HomeHandicap}*/}
							{/*}*/}
						{/*</div>*/}
						{/*<div className={'event_name' + (activeExchange.isMirror ? ' active' : '')}*/}
							 {/*onClick={traderActions.actionOnTabMirrorClick.bind(null, this, true)}>*/}
							{/*{*/}
								{/*activeExchange.awayName// JSON.stringify(data) !== '{}' && ${data.Symbol.AwayHandicap}*/}
							{/*}*/}
						{/*</div>*/}
					{/*</div>*/}
					{/*:*/}
					{/*''*/}
			{/*}*/}
			<table className="info">
				<tbody>
					<tr>
						<td className="open_pnl trader_info">
							<a href="#">
								P/L
								<span className={'quantity ' + className}>{gainLoss}</span>
								<span className="help"><span className="help_message right"><strong>Profit in this event</strong></span></span>
							</a>
						</td>
						<td className="open_contracts trader_info">
							<a href="#">
								Units
								<span className="pos">{data.Positions || 0}</span>
								<span className="help"><span className="help_message"><strong>Open positions</strong></span></span>
							</a>
						</td>
						<td className="amount trader_info">
							<a href="#">
								Avg. Price
								<span className="quantity up">{}</span>
								<span className="help"><span className="help_message"><strong>Average price of position</strong></span></span>
							</a>
						</td>
					</tr>
				</tbody>
			</table>
			<table className="control">
				<tbody>
					<tr>
						<td className={'join_bid buy market_button confim wave' + (quantity && bid ? ' active clickable' : '')}>
							<button className="wave waves-effect waves-button" onClick={
								traderActions.actionAddDefaultOrder.bind(null, this, {
									direction: 'buy',
									price    : bid ? bid.toFixed(2) : bid,
									limit    : true,
									outputOrder: false
								}, 'limit')}
									disabled={!quantity || !bid}>
								Join BID <span className="price">
									{
										bid ? bid.toFixed(2) : ''
									}
								</span>
							</button>
						</td>
						<td className={'join_ask sell market_button confim wave' + (quantity && ask ? ' active clickable' : '')}>
							<button className="wave waves-effect waves-button" onClick={
								traderActions.actionAddDefaultOrder.bind(null, this, {
									direction: 'sell',
									price    : ask ? ask.toFixed(2) : ask,
									limit    : true,
									outputOrder: false
								}, 'limit')}
									disabled={!quantity || !ask}>
								<span className="price">
									{
										ask ? ask.toFixed(2) : ''
									}
								</span> Join ASK
							</button>
						</td>
						{/*<td className={'buy_mkt confim buy market_button wave waves-effect waves-button' + (quantity && bid ? ' active clickable' : '')}>
							<button
								onClick={
									traderActions.actionAddDefaultOrder.bind(null, this, {
										direction: 'sell',
										price    : data.Symbol ? bid : '',
										limit    : false,
										outputOrder: false
									}, 'market')}
								disabled={!quantity || !bid}>
								Buy MKT
							</button>
						</td>
						<td className={'sell_mkt confim sell market_button wave waves-effect waves-button' + (quantity && ask ? ' active clickable' : '')}>
							<button
								onClick={
									traderActions.actionAddDefaultOrder.bind(null, this, {
										direction: 'buy',
										price    : data.Symbol ? ask : '',
										limit    : false,
										outputOrder: false
									}, 'market')}
								disabled={!quantity || !ask}>
								Sell MKT
							</button>
						</td>*/}
						<td className="spreader label"><span>Spreader</span></td>
					</tr>
					<tr>
						<td>
							{
								(orderInfo.outputOrder || !autoTradeOn) && orderInfo.activeString === 'market' && orderInfo.showDefaultOrder && quantity &&
								activeExchangeSymbol === activeExchange.symbol && isMirror == activeExchange.isMirror &&

								<TraderDefaultForm
									activeString={orderInfo.activeString}
									bestPrice={{ask, bid}}
									index={'market'}
									mainData={data}
									quantity={quantity}
									traderContext={this}
									{...info}
									{...orderInfo}
								/>
							}
							{
								(orderInfo.outputOrder || !autoTradeOn) && orderInfo.activeString === 'limit' && orderInfo.showDefaultOrder && quantity &&
								activeExchangeSymbol === activeExchange.symbol && isMirror == activeExchange.isMirror &&

								<TraderDefaultForm
									activeString={orderInfo.activeString}
									bestPrice={{ask, bid}}
									index={'limit'}
									mainData={data}
									quantity={quantity}
									traderContext={this}
									{...info}
									{...orderInfo}
								/>
							}
						</td>
					</tr>
					<tr>
						<td className="label"><span>No. of Entries</span></td>
						<td className="volume quantity">
							<div className="input">
								<button className="clear" id="trader_quantity_clear" onClick={traderActions.actionOnQuantityClear.bind(null, this)}>{}</button>
								<input type="text" className="number quantity" data-validation="1" maxLength="8"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, this)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, this)}
									   value={quantity} ref={'inputQuantity'}/>
								<div className="warning" ref={'quantityError'} style={{display: 'none'}}>
									{
										showQuantityError ?
											<p>Choose your number of entries</p>
											:
											<p>Available integer value more than 0</p>
									}
								</div>
								<div className="regulator min">
									<span className="plus" title="Press Arrow Up" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, -1)}>{}</span>
								</div>
							</div>
						</td>
						<td className="spread_container ">
							<div className="input">
								<button className="clear" onClick={traderActions.actionOnSpreadClear.bind(null, this)}>{}</button>
								<input type="text" className="number spreader" maxLength="5" data-validation="0.1"
									   onMouseUp={spread ? null : traderActions.actionOnButtonSpreadChange.bind(null, this, '0.')}
									   onKeyDown={traderActions.actionOnButtonSpreadRegulator.bind(null, this)}
									   onChange={traderActions.actionOnSpreadChange.bind(null, this)}
									   value={spread} ref={'inputSpread'} disabled={!quantity}/>
								<div className="warning right" style={{display: 'none'}}>
									<p>Available value from 0.01 to 0.99</p>
								</div>
								{
									!!quantity && <div className="regulator min"><span className="plus" title="Press Arrow Up" onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.01, true)}>{}</span><span className="minus" title="Press Arrow Down" onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, -0.01, true)}>{}</span></div>
								}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table className="control">
				<tbody>
					<tr>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 5)}>+5</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 10)}>+10</button></td>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 15)}>+15</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 20)}>+20</button></td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.01)} disabled={!quantity}>0.01</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.05)} disabled={!quantity}>0.05</button></td>
					</tr>
					<tr>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 25)}>+25</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 50)}>+50</button></td>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 100)}>+100</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 250)}>+250</button></td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.10)} disabled={!quantity}>0.10</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.15)} disabled={!quantity}>0.15</button></td>
					</tr>
					<tr>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 500)}>+500</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 1000)}>+1000</button></td>
						<td className="button quantity"><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 1500)}>+1500</button><button className="btn wave" onClick={traderActions.actionOnButtonQuantityChange.bind(null, this, 2000)}>+2000</button></td>
						<td className="button spread"><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.25)} disabled={!quantity}>0.25</button><button className={'wave waves-effect waves-button' + (!quantity ? '' : ' btn')} onClick={traderActions.actionOnButtonSpreadChange.bind(null, this, 0.30)} disabled={!quantity}>0.30</button></td>
					</tr>
					<tr>
						<td>{}</td>
					</tr>
				</tbody>
			</table>
			<div className="active_trader_footer">
				<input type="hidden" id="market_symbol" value={activeExchange.symbol}/>
				<table className="remote control">
					<tbody>
						<tr>
							<td className="reverse active">
								<a href="#" className="ReverseAllJs wave">Reverse</a>
								<div className="confirm_window animated">
									<div className="container">
										<span>Do you really want Reverse?</span>
										<div className="button_container">
											<button className="btn wave yes">Yes</button>
											<button className="btn wave no">No</button>
										</div>
									</div>
								</div>
							</td>
							<td className="cancel_all active">
								<a href="#" className="CancelAllJs wave">Cancel All</a>
								<div className="confirm_window animated">
									<div className="container">
										<span>Do you really want Cancel All?</span>
										<div className="button_container">
											<button className="btn wave yes">Yes</button>
											<button className="btn wave no">No</button>
										</div>
									</div>
								</div>
							</td>
							<td className="close_out active">
								<a href="#" className="CloseOutJs wave">Close Out</a>
								<div className="confirm_window animated">
									<div className="container">
										<span>Do you really want Close Out?</span>
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
				{
					popUpShow &&
					<div className={`confirm_window middle animated fadeIn`}>
						{
							// dragNextPrice ?
							// 	<div className="container">
							// 		<p>Confirm, please, your transfer of all orders from <span className="value">
							// 			${(dragPrevPrice).toFixed(2)} </span> to
							// 			<span className="value"> ${(dragNextPrice).toFixed(2)}</span></p>
							// 		<div className="button_container">
							// 			<button className="btn wave yes waves-effect waves-button"
							// 					onClick={traderActions.onDragConfirm.bind(null, true)}>Yes</button>
							// 			<button className="btn wave no waves-effect waves-button"
							// 					onClick={traderActions.onDragConfirm.bind(null, false)}>No</button>
							// 		</div>
							//
							// 	</div>
							// 	:
								<div className="container">
									<p>Confirm the removal of all orders for this price, please:
										<span className="value"> ${(orderInfo.price).toFixed(2)}</span></p>
									<div className="button_container">
										<button className="btn wave yes waves-effect waves-button"
												onClick={traderActions.onDeleteConfirm.bind(null, true)}>Yes</button>
										<button className="btn wave no waves-effect waves-button"
												onClick={traderActions.onDeleteConfirm.bind(null, false)}>No</button>
									</div>

								</div>
						 }
					</div>
				}
				{
					(orderInfo.outputOrder || !autoTradeOn) && orderInfo.activeString === 'empty' && orderInfo.showDefaultOrder &&
					activeExchangeSymbol === activeExchange.symbol && isMirror == activeExchange.isMirror &&

					<TraderDefaultForm
						activeString={orderInfo.activeString}
						bestPrice={{ask, bid}}
						index={'empty'}
						mainData={data}
						quantity={quantity}
						traderContext={this}
						{...info}
						{...orderInfo}
					/>
				}
				<table className={'limit' + ($.browser.webkit ? ' webkit' : '') + (quantity ? ' clickable' : '') +
				(popUpShow ? ' blocked' : '')}>
					<thead>
						<tr>
							<th>My Bids</th>
							<th>Size</th>
							<th>Price</th>
							<th>Size</th>
							<th>My Offers</th>
						</tr>
					</thead>
					<tbody ref={'traderBody'}>
						{
							rebuiltServerData.map((item, index) =>
								<TraderString
									data={item}
									key={item.Key}
									mainData={data}
									orderInfo={orderInfo}
									index={index}
									traderContext={this}
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
	constructor()
	{
		super();
		this.OddsConverterObj = new OddsConverter();
	}

	// onDragOver(event)
	// {
	// 	const { dragPrevPrice, dragSide } = this.props;
	// 	dragPrevPrice && event.preventDefault();
	// 	if(dragPrevPrice) $(event.currentTarget).addClass('drag_place' + (dragSide === 'sell' ? ' sell' : ' buy'));
	// }

	// onDragLeave(event)
	// {
	// 	// if(this.props.dragPrevPrice) $(event.currentTarget).removeClass('drag_place');
	// 	if(this.props.dragPrevPrice) $('tr.visible').removeClass('drag_place sell buy');
	// }


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

	// addOrder(data)
	// {
		// const { addOrder, index, stringIndexTake, traderActions } = this.props;
		// const state = this.state;

		// state.direction = data.direction;
		// state.limit = data.limit;
		// state.showDefaultOrder = true;

		// traderActions.takeActiveFormContext(this);
		// traderActions.actionSetActiveString(index);
		// traderActions.actionAddDefaultOrder(data, index);
	// }

	render()
	{
		// const { traderActions, activeString, data, mainData, index, inputQuantityContext, isMirror, quantity } = this.props;
		const { activeExchangeSymbol, data, dragPrevPrice, dropActiveString, cmpData: { autoTradeOn, activeExchange }, index,
			isMirror, orderInfo: {...info}, traderContext, spreadHighLight, quantity, spread, ...other } = this.props;
		// const {  showDefaultOrder  } = this.state;
		// console.log(this.props);
		const spreadPricePos = Math.round10(data.Price + +spread, -2);
		const spreadPriceNeg = Math.round10(data.Price - spread, -2);
		// const dragAvailable = !!data.ParticularUserQuantityBuy || !!data.ParticularUserQuantitySell;
		let className = '';
		let addOrder = null;
		let spreadHighLightFunc = null;
		let bidsProb = '';
		let offersProb = '';

		if(data.AskValue && data.Price >= data.AskValue) bidsProb = ' high';
		if(data.AskValue && data.Price >= Math.round10(data.AskValue - 0.05, -2) && data.Price < data.AskValue) bidsProb = ' high_middle';
		if(data.AskValue && data.Price >= Math.round10(data.AskValue - 0.1, -2) && data.Price < Math.round10(data.AskValue - 0.05, -2)) bidsProb = ' middle';
		if(data.AskValue && data.Price >= Math.round10(data.AskValue - 0.15, -2) && data.Price < Math.round10(data.AskValue - 0.1, -2)) bidsProb = ' low_middle';
		if(data.AskValue && data.Price < Math.round10(data.AskValue - 0.15, -2)) bidsProb = ' low';

		if(data.BidValue && data.Price <= data.BidValue) offersProb = ' high';
		if(data.BidValue && data.Price <= Math.round10(data.BidValue + 0.05, -2) && data.Price > data.BidValue) offersProb = ' high_middle';
		if(data.BidValue && data.Price <= Math.round10(data.BidValue + 0.1, -2) && data.Price > Math.round10(data.BidValue + 0.05, -2)) offersProb = ' middle';
		if(data.BidValue && data.Price <= Math.round10(data.BidValue + 0.15, -2) && data.Price > Math.round10(data.BidValue + 0.1, -2)) offersProb = ' low_middle';
		if(data.BidValue && data.Price > Math.round10(data.BidValue + 0.15, -2)) offersProb = ' low';
		// spread && console.log(data.BidValue < data.Price);
		if(+spread){
			if(data.Spread === 'mid'){
				className = ' active';
				addOrder = other.traderActions.actionShowDirectionConfirm.bind(null, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg, spreadPricePos])
			}
			else if (data.AskValue && data.Spread === 'ask' && data.Price <= Math.round10(data.AskValue + +spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, this, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])
			}
			else if(!data.AskValue && data.Spread === 'ask' && data.Price <= Math.round10(data.BidValue + +spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, this, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])
			}
			else if (data.BidValue && data.Spread === 'bid' && data.Price >= Math.round10(data.BidValue - spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, this, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])
			}
			else if(!data.BidValue && data.Spread === 'bid' && data.Price >= Math.round10(data.AskValue - spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, this, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])
			}
		}

		return <AnimateOnUpdate
				component="tr"
				className={`visible`}
				transitionName={{
					enter: 'updateAnimation',
				}}
				transitionAppear={false}
				transitionLeave={false}
				transitionEnterTimeout={800}
				// onDragOver={::this.onDragOver}
				// onDragLeave={::this.onDragLeave}
				// onDrop={other.traderActions.onDrop.bind(null, this, data.Price)}
				ref={'tr'}
				data={data}
		>
			<td className={'my_size my_offers animated' + (!!data.ParticularUserQuantityBuy ? ' clickable' : '')}
				data-verify={'ParticularUserQuantityBuy'}
				// draggable={!!data.ParticularUserQuantityBuy}
				onClick={!!data.ParticularUserQuantityBuy ? other.traderActions.deleteOrders.bind(null, this, data.Price, 'Buy') : null}
				// onDragStart={dragAvailable ? other.traderActions.onDragStart.bind(null, this, 'buy', data.Price) : null}
				// onDragEnd={dragAvailable ? other.traderActions.onDragEnd : null}
				>
					<span className="value">
						{
							data.ParticularUserQuantityBuy || ''
						}
					</span>
				{
					!!data.ParticularUserQuantityBuy ? <button className="close_red">{}</button> : ''
				}
			</td>

			<td className={'size buy size_buy animated' + bidsProb + (data.Bid ? ' best_buy' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantityBuy"
				onClick={
					quantity ?
						other.traderActions.actionAddDefaultOrder.bind(null, this, {
							direction: 'buy',
							price: (data.Price).toFixed(2),
							limit: true,
							outputOrder: false
						}, index)
						:
						other.traderActions.showQuantityError.bind(null, traderContext, true)
				}
				// onDragStart={dragAvailable ? other.traderActions.onDragStart.bind(null, this, 'buy', data.Price) : null}
				// onDragEnd={dragAvailable ? other.traderActions.onDragEnd : null}
				// draggable={!!data.ParticularUserQuantityBuy}
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
			<td className={`price_value${data.Bid ? ' best_buy' : ''}${data.Ask ? ' best_sell' : ''}${className}${spreadHighLight[0] === data.Price || spreadHighLight[1] === data.Price ? ' hovered' : ''}`}
				onMouseEnter={spreadHighLightFunc}
				onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
				onClick={spread ? addOrder : null}>
				<div className={'container help balloon_only' + (index === 97 || index === 98 ? ' top' : '')}>
					<span className="value">${(data.Price).toFixed(2)}</span>
					{
						!!spread && data.Spread === 'mid' &&

						<div className={'spread_confirm' + (index === info.activeString && info.showDirectionConfirm ? ' active' : '')}>
							<span className="sell confirm_button"
								  onClick={
									  other.traderActions.actionAddSpreadOrder.bind(null, this, {
										  direction: 'ask',
										  price: data.Price,
									  }, index)
								  }
								  onMouseEnter={other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])}
								  onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
							>Sell</span>
							<span className="buy confirm_button"
								  onClick={
									  other.traderActions.actionAddSpreadOrder.bind(null, this, {
										  direction: 'bid',
										  price: data.Price,
									  }, index)
								  }
								  onMouseEnter={other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])}
								  onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
							>Buy</span>
						</div>
					}
					{
						!spread &&
						<span className="help_message">
							<p>{`${this.OddsConverterObj.getSystemName()} odds : ${this.OddsConverterObj.convertToOtherSystem((data.Price).toFixed(2))}`}</p>
						</span>
					}
				</div>
			</td>
			<td className={'size sell size_sell animated ' + offersProb + (data.Ask ? ' best_sell' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantitySell"
				onClick={
					quantity ?
						other.traderActions.actionAddDefaultOrder.bind(null, this, {
							direction: 'sell',
							price: (data.Price).toFixed(2),
							limit: true,
							outputOrder: false
						}, index)
						:
						other.traderActions.showQuantityError.bind(null, traderContext, true)
				}
				// draggable={!!data.ParticularUserQuantitySell}
				// onDragStart={dragAvailable ? other.traderActions.onDragStart.bind(null, this, 'sell', data.Price) : null}
				// onDragEnd={dragAvailable ? other.traderActions.onDragEnd : null}
			>
				<span className="container">
					<span className="value">
						{
							data.QuantitySell || ''
						}
					</span>
				</span>
			</td>
			<td className={'my_size my_bids animated'  + (!!data.ParticularUserQuantitySell ? ' clickable' : '')}
				data-verify="ParticularUserQuantitySell"
				// draggable={!!data.ParticularUserQuantitySell}
				onClick={!!data.ParticularUserQuantitySell ? other.traderActions.deleteOrders.bind(null, this, data.Price, 'Sell') : null}
				// onDragStart={dragAvailable ? other.traderActions.onDragStart.bind(null, this, 'sell', data.Price) : null}
				// onDragEnd={dragAvailable ? other.traderActions.onDragEnd : null}
			>
				<span className="value">
					{
						data.ParticularUserQuantitySell || ''
					}
				</span>
				{
					!!data.ParticularUserQuantitySell ? <button className="close_red">{}</button> : ''
				}
			</td>
			<td>
				{
					(info.outputOrder || !autoTradeOn) && index === info.activeString && (info.outputOrder || quantity) &&
					activeExchangeSymbol === activeExchange.symbol && isMirror == activeExchange.isMirror &&

					(
						(info.showDefaultOrder &&
							<TraderDefaultForm
								activeString={info.activeString}
								bestPrice={{ask: data.AskValue, bid: data.BidValue}}
								cmpData={this.props.cmpData}
								index={index}
								quantity={quantity}
								isMirror={isMirror}
								traderContext={traderContext}
								{...other}
								{...info}
							/>
						)
						||
						(spread && info.showSpreadOrder &&
							<TraderSpreadForm
								activeString={info.activeString}
								data={data}
								cmpData={this.props.cmpData}
								index={index}
								quantity={quantity}
								spread={spread}
								isMirror={isMirror}
								traderContext={traderContext}
								// inputQuantityContext={inputQuantityContext}
								{...other}
								{...info}
							/>
						)
					)
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