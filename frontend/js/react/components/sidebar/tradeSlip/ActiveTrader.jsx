import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import AnimateOnUpdate from '../../Animation.jsx';
import TraderDefaultForm from './activeTrader/traderDefaultForm';
import TraderSpreadForm from './activeTrader/traderSpreadForm';
import traderActions from '../../../actions/Sidebar/traderActions.ts';
import * as defaultOrderActions from '../../../actions/Sidebar/defaultOrderActions';
// import RebuildServerData from '../../../actions/Sidebar/activeTrader/rebuildServerData';

class ActiveTrader extends React.Component {
	constructor()
	{
		super();

	}

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

		return <div className="active_trader" style={{display: 'none'}} id={"trader_" + activeExchange.symbol}
					onClick={traderActions.actionHideDirectionConfirm}>
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
									traderActions.actionAddDefaultOrder.bind(null, {
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
									traderActions.actionAddDefaultOrder.bind(null, {
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
									   onMouseUp={spread ? null : traderActions.actionOnButtonSpreadChange.bind(null, this, '0.')}
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
								traderActions.actionAddDefaultOrder.bind(null, {
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
								traderActions.actionAddDefaultOrder.bind(null, {
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
		traderActions.actionAddDefaultOrder(data, index);
	}

	render()
	{
		// const { traderActions, activeString, data, mainData, index, inputQuantityContext, isMirror, quantity } = this.props;
		const { data, index, orderInfo: {...info}, spreadHighLight, quantity, spread, ...other } = this.props;
		// const {  showDefaultOrder  } = this.state;
		// console.log(this.props);
		const spreadPricePos = Math.round10(data.Price + +spread, -2);
		const spreadPriceNeg = Math.round10(data.Price - spread, -2);
		let className = '';
		let addOrder = null;
		let spreadHighLightFunc = null;
		// spread && console.log(data.BidValue < data.Price);
		if(+spread){
			if(data.Spread == 'mid'){
				className = ' active';
				addOrder = other.traderActions.actionShowDirectionConfirm.bind(null, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg, spreadPricePos])
			}
			else if (data.AskValue && data.Spread == 'ask' && data.Price <= Math.round10(data.AskValue + +spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])
			}
			else if(!data.AskValue && data.Spread == 'ask' && data.Price <= Math.round10(data.BidValue + +spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])
			}
			else if (data.BidValue && data.Spread == 'bid' && data.Price >= Math.round10(data.BidValue - spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])
			}
			else if(!data.BidValue && data.Spread == 'bid' && data.Price >= Math.round10(data.AskValue - spread, -2)){
				className = ' active';
				addOrder = other.traderActions.actionAddSpreadOrder.bind(null, {
					direction: data.Spread,
					price: data.Price,
				}, index);
				spreadHighLightFunc = other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])
			}
		}

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

			<td className={'size buy size_buy animated ' + (data.Bid ? 'best_buy' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantityBuy"
				onClick={
					other.traderActions.actionAddDefaultOrder.bind(null, {
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
			<td className={`price_value${data.Bid ? ' best_buy' : ''}${data.Ask ? ' best_sell' : ''}${className}${spreadHighLight[0] == data.Price || spreadHighLight[1] == data.Price ? ' hovered' : ''}`}
				onMouseEnter={spreadHighLightFunc}
				onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
				onClick={addOrder}>
				<div className="container">
					<span className="value">${(data.Price).toFixed(2)}</span>
				{
					!!spread && data.Spread == 'mid' &&

					<div className={'spread_confirm' + (index == info.activeString && info.showDirectionConfirm ? ' active' : '')}>
						<span className="sell confirm_button"
							  onClick={
								  other.traderActions.actionAddSpreadOrder.bind(null, {
									  direction: 'ask',
									  price: data.Price,
								  }, index)
							  }
							  onMouseEnter={other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPriceNeg])}
							  onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
						>Sell</span>
						<span className="buy confirm_button"
							  onClick={
								  other.traderActions.actionAddSpreadOrder.bind(null, {
									  direction: 'bid',
									  price: data.Price,
								  }, index)
							  }
							  onMouseEnter={other.traderActions.actionOnSpreadHighLight.bind(null, [spreadPricePos])}
							  onMouseLeave={other.traderActions.actionOnSpreadHighLight.bind(null, [])}
						>Buy</span>
					</div>
				}
				</div>
			</td>
			<td className={'size sell size_sell animated ' + (data.Ask ? 'best_sell' : '') + (quantity ? ' clickable' : '')}
				data-verify="QuantitySell"
				onClick={
					other.traderActions.actionAddDefaultOrder.bind(null, {
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
					index == info.activeString && quantity &&

					(
						(info.showDefaultOrder &&
							<TraderDefaultForm
								activeString={info.activeString}
								index={index}
								quantity={quantity}
								{...other}
								{...info}
							/>
						)
						||
						(spread && info.showSpreadOrder &&
							<TraderSpreadForm
								activeString={info.activeString}
								index={index}
								quantity={quantity}
								spread={spread}
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