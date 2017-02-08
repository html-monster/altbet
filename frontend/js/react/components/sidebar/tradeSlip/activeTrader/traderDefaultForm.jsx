/**
 * Created by Htmlbook on 02.02.2017.
 */
import React from 'react';

export default class TraderDefaultForm extends React.Component {

	constructor()
	{
		super();
	}

	render()
	{
		const { traderActions, activeString, direction, price, limit, mainData, index, inputQuantityContext,
			isMirror, quantity } = this.props;
		// let orderFormStyle = {position: 'absolute', left: 0, zIndex: 10, marginTop: 10};

		return <div className={'order_content default animated' + (index == activeString || !index ? ' fadeInUp' : '')}
					id="order_content"
					key={direction}
		>
			<div className={direction == 'sell' ? 'sell-container' : 'buy-container'}>
				<form action={ABpp.baseUrl + (limit ? '/Order/Create' : '/Order/MarketTrading')}
					  autoComplete="off"
					  onSubmit={traderActions.actionOnAjaxSend.bind(null, this)}
				>
					<div className="container">
						<div className="price ">
							<label>Price</label>
							<div className="input">
								<input autoComplete="off" className="number" data-validation="0.33"
									   maxLength="4" name="LimitPrice" type="text"
									   defaultValue={limit ? (price).toFixed(2) : ''} ref={'inputPrice'} disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							</div>
						</div>
						<div className="volume">
							<label>Quantity</label>
							<div className="input">
								<input autoComplete="off" className="number quantity" data-validation="123"
									   onKeyDown={traderActions.actionOnButtonQuantityRegulator.bind(null, inputQuantityContext)}
									   onChange={traderActions.actionOnQuantityChange.bind(null, inputQuantityContext)}
									   maxLength="8" name="Quantity"
									   type="text" ref={'inputQuantity'} value={quantity}/>
								<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>
								<div className="regulator">
									<span className="plus" title="Press Arrow Up"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, 1)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={traderActions.actionOnButtonQuantityChange.bind(null, inputQuantityContext, -1)}>{}</span>
								</div>
							</div>
						</div>
						<div className="obligations ">
							<label>Sum</label>
							<div className="input">
								<input type="text" className="number" data-validation="40.59" maxLength="8"
									   value={
									   	limit ?
												direction == 'sell' ? Math.round10((1 - price) * quantity, -2) : Math.round10(price * quantity, -2)
											:
												''
									   }
									   onChange={traderActions.actionOnQuantityChange.bind(null, null)}
									   ref={'inputSum'} disabled="disabled"/>
								<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>
							</div>
						</div>
					</div>
					<input className="side" name="Side" type="hidden" defaultValue={(direction)[0].toUpperCase() + (direction).slice(1)}/>
					<input className="symbol" name="Symbol" type="hidden" defaultValue={`${mainData.Symbol.Exchange}_${mainData.Symbol.Name}_${mainData.Symbol.Currency}`}/>
					<input className="mirror" name="isMirror" type="hidden" defaultValue={isMirror}/>
					<input className="direction" name="OrderType" type="hidden" defaultValue={limit}/>
					{
						limit && <input className="price_value" name="LimitPrice" type="hidden" defaultValue={(price).toFixed(2)}/>
					}
					<div className="container">
						<div className="submit_wrapper">
							<i className="submit wave waves-input-wrapper waves-effect waves-button">
								<input type="submit" className={'btn ' + direction} value={direction.toUpperCase()} />
							</i>
						</div>
						<span className="delete" onClick={traderActions.actionRemoveOrderForm}>{}</span>
						<div className="checkbox"></div>
					</div>
				</form>
			</div>
		</div>
	}
}
