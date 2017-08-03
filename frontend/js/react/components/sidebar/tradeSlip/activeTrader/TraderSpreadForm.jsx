/**
 * Created by Htmlbook on 06.02.2017.
 */
import React from 'react';

export default class TraderSpreadForm extends React.Component {
	constructor()
	{
		super();
	}

	render()
	{
		const { traderActions, activeString, mainData: { Symbol }, cmpData: { activeExchange }, direction, price, index, traderContext,//inputQuantityContext,
			isMirror, quantity, spread } = this.props;
		let spreadPricePos = Math.round10(price + +spread, -2);
		spreadPricePos = spreadPricePos > 0.98 ? 0.99 : spreadPricePos.toFixed(2);
		spreadPricePos = direction === 'ask' ? price.toFixed(2) : spreadPricePos;
		let spreadPriceNeg = Math.round10(price - spread, -2);
		spreadPriceNeg = spreadPriceNeg < 0.02 ? 0.01 : spreadPriceNeg.toFixed(2);
		spreadPriceNeg = direction === 'bid' ? price.toFixed(2) : spreadPriceNeg;
		let bidsProb = '';
		let offersProb = '';

		if(Symbol)
		{
			if (Symbol.LastBid && spreadPricePos <= Symbol.LastBid) offersProb = ' high';
			if (Symbol.LastBid && spreadPricePos <= Math.round10(Symbol.LastBid + 0.05, -2) && spreadPricePos > Symbol.LastBid) offersProb = ' high_middle';
			if (Symbol.LastBid && spreadPricePos <= Math.round10(Symbol.LastBid + 0.1, -2) && spreadPricePos > Math.round10(Symbol.LastBid + 0.05, -2)) offersProb = ' middle';
			if (Symbol.LastBid && spreadPricePos <= Math.round10(Symbol.LastBid + 0.15, -2) && spreadPricePos > Math.round10(Symbol.LastBid + 0.1, -2)) offersProb = ' low_middle';
			if (Symbol.LastBid && spreadPricePos > Math.round10(Symbol.LastBid + 0.15, -2)) offersProb = ' low';

			if (Symbol.LastAsk && spreadPriceNeg >= Symbol.LastAsk) bidsProb = ' high';
			if (Symbol.LastAsk && spreadPriceNeg >= Math.round10(Symbol.LastAsk - 0.05, -2) && spreadPriceNeg < Symbol.LastAsk) bidsProb = ' high_middle';
			if (Symbol.LastAsk && spreadPriceNeg >= Math.round10(Symbol.LastAsk - 0.1, -2) && spreadPriceNeg < Math.round10(Symbol.LastAsk - 0.05, -2)) bidsProb = ' middle';
			if (Symbol.LastAsk && spreadPriceNeg >= Math.round10(Symbol.LastAsk - 0.15, -2) && spreadPriceNeg < Math.round10(Symbol.LastAsk - 0.1, -2)) bidsProb = ' low_middle';
			if (Symbol.LastAsk && spreadPriceNeg < Math.round10(Symbol.LastAsk - 0.15, -2)) bidsProb = ' low';
		}

		const maxEntries = 100, remainingBal = 95;

		return <div className={'order_content spread animated' + (index === activeString || !index ? ' fadeInUp' : '')}
					id="order_content"
					key={direction}
		>
			<div className="sell-buy-container">
				<form action={ABpp.baseUrl + '/Order/Spreader'}
					  autoComplete="off"
					  onSubmit={this._onSubmit.bind(this, {maxEntries, remainingBal, spreadPricePos, spreadPriceNeg, quantity, traderActions})}
				>
					<div className="container">
						<div className="price sell">
							<label>Selling price</label>
							<div className="input">
								<input type="tel" className={'number' + offersProb} data-validation="0.33" maxLength="4"
									   value={'$' + spreadPricePos}
									   onChange={traderActions.actionOnQuantityChange.bind(null, traderContext)}
									   disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							</div>
						</div>
						<div className="volume">
							<label>Quantity</label>
							<div className="input">
								<input className="number quantity" data-validation="123" maxLength="8" name="SellOrderQuantity" type="text"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, traderContext)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, traderContext)}
									   value={quantity}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
								<div className="regulator">
									<span className="plus" title="Press Arrow Up"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, traderContext, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, traderContext, -1)}>{}</span>
								</div>
							</div>
						</div>
						<div className="success">
							<i className="submit wave waves-input-wrapper waves-effect waves-button">
								<input type="submit" className={'success_btn'} defaultValue={''}/>
							</i>
							{/*<input type="submit" className="success_btn"/>*/}
						</div>
					</div>
					<input className="symbol" name="Symbol" type="hidden" defaultValue={activeExchange.symbol}/>
					<input className="mirror" name="isMirror" type="hidden" defaultValue={isMirror}/>
					<input className="SellOrderLimitPrice" name="SellOrderLimitPrice" type="hidden"
						   defaultValue={spreadPricePos}/>
					<input className="BuyOrderLimitPrice" name="BuyOrderLimitPrice" type="hidden"
						   defaultValue={spreadPriceNeg}/>
					<div className="container">
						<div className="price buy">
							<label>Buying price</label>
							<div className="input">
								<input type="tel" className={'number' + bidsProb} data-validation="0.33" maxLength="4"
									   value={'$' + spreadPriceNeg}
									   onChange={traderActions.actionOnQuantityChange.bind(null, traderContext)}
									   disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							</div>
						</div>
						<div className="volume">
							<label>Quantity</label>
							<div className="input">
								<input className="number quantity" data-validation="123" maxLength="8" name="BuyOrderQuantity" type="text"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, traderContext)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, traderContext)}
									   value={quantity}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
								<div className="regulator">
									<span className="plus" title="Press Arrow Up"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, traderContext, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, traderContext, -1)}>{}</span>
								</div>
							</div>
						</div>
							<span className="delete wave waves-input-wrapper waves-effect waves-button"
								  onClick={traderActions.actionRemoveOrderForm}>{}</span>
					</div>
				</form>
			</div>
		</div>
	}

	_onSubmit(data, event)
	{
		event.preventDefault();
		const sum = ((1 - data.spreadPricePos) * data.quantity) + (data.spreadPriceNeg * data.quantity);
		const endDate = this.props.cmpData.activeExchange.endDate;

		if(endDate && moment().format('x') > endDate)
		{
			defaultMethods.showError('This game is completed, please try another game');
			return false;
		}

		if(sum > data.remainingBal)
		{
			defaultMethods.showWarning(`Order total sum is $${Math.round10(sum, -2)}, your remaining entry balance of this game is $${data.remainingBal}, it's not enough to create the order`);
			return false;
		}

		data.traderActions.actionOnAjaxSend(this, event);
	}
}
