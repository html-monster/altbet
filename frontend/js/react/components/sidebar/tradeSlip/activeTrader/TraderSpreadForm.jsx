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
		const { traderActions, activeString, cmpData: { activeExchange }, direction, price, index, inputQuantityContext,
			isMirror, quantity, spread } = this.props;
		const spreadPricePos = Math.round10(price + +spread, -2);
		const spreadPriceNeg = Math.round10(price - spread, -2);

		return <div className={'order_content spread animated' + (index == activeString || !index ? ' fadeInUp' : '')}
					id="order_content"
					key={direction}
		>
			<div className="sell-buy-container">
				<form action={ABpp.baseUrl + '/Order/Spreader'}
					  autoComplete="off"
					  onSubmit={traderActions.actionOnAjaxSend.bind(null, this)}
				>
					<div className="container">
						<div className="price sell">
							<label>Selling price</label>
							<div className="input">
								<input type="text" className="number" data-validation="0.33" maxLength="4"
									   value={direction == 'ask' ? price.toFixed(2) : (spreadPricePos > 0.98 ? 0.99 : spreadPricePos.toFixed(2))}
									   onChange={traderActions.actionOnQuantityChange.bind(null, inputQuantityContext)}
									   disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							</div>
						</div>
						<div className="volume">
							<label>Quantity</label>
							<div className="input">
								<input className="number quantity" data-validation="123" maxLength="8" name="SellOrderQuantity" type="text"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, inputQuantityContext)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, inputQuantityContext)}
									   value={quantity}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
								<div className="regulator">
									<span className="plus" title="Press Arrow Up"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, -1)}>{}</span>
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
						   defaultValue={direction == 'ask' ? price : (spreadPricePos > 0.98 ? 0.99 : spreadPricePos)}/>
					<input className="BuyOrderLimitPrice" name="BuyOrderLimitPrice" type="hidden"
						   defaultValue={direction == 'bid' ? price : (spreadPriceNeg < 0.02 ? 0.01 : spreadPriceNeg)}/>
					<div className="container">
						<div className="price buy">
							<label>Buying price</label>
							<div className="input">
								<input type="text" className="number" data-validation="0.33" maxLength="4"
									   value={direction == 'bid' ? price.toFixed(2) : (spreadPriceNeg < 0.02 ? 0.01 : spreadPriceNeg.toFixed(2))}
									   onChange={traderActions.actionOnQuantityChange.bind(null, inputQuantityContext)}
									   disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							</div>
						</div>
						<div className="volume">
							<label>Quantity</label>
							<div className="input">
								<input className="number quantity" data-validation="123" maxLength="8" name="BuyOrderQuantity" type="text"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, inputQuantityContext)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, inputQuantityContext)}
									   value={quantity}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
								<div className="regulator">
									<span className="plus" title="Press Arrow Up"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, -1)}>{}</span>
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
}