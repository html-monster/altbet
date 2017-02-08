import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as orderFormActions from '../../../actions/order/orderFormActions.ts';
import {OddsConverterObj} from '../../../models/oddsConverter/oddsConverter.js';

// let OddsConverterObj = new OddsConverter('implied_probability');

export default class OrderForm extends React.Component{
	constructor()
	{
		super();
	}

	// OnBeginAjax()
	// {
	// 	$(this.refs.orderForm).find('[type=submit]').attr('disabled', true);
	// }
	//
	// onSuccessAjax()
	// {
	// 	console.log('Order sending finished: ' + this.props.data.ID);
	// }
	//
	// onErrorAjax()
	// {
	// 	$(this.refs.orderForm).find('[type=submit]').removeAttr('disabled');
	// 	defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	// }

	ajaxSendHandler(e)
	{
		e.preventDefault();
		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			url: this.props.formData.url,
			callback: ::this.onSuccessAjax,
			onError: ::this.onErrorAjax,
			beforeSend: ::this.OnBeginAjax,
			context: $(this.refs.orderForm)
		});
	}

	onTypeChange(checkboxProp)
	{
		let price = $(this.refs.inputPrice);
		let quantity = $(this.refs.inputQuantity);

		// console.log(this);
		this.setState({checkboxProp: !checkboxProp});
		if (!checkboxProp) {

			setTimeout(function () {
				price.focus();
				price[0].selectionStart = 4;
			}, 300);
			OddsConverterObj.calculation(this, 'price', !checkboxProp);
		}
		else {
			quantity.focus();
			quantity[0].selectionStart = quantity.val().length;
			OddsConverterObj.calculation(this, 'quantity', !checkboxProp);
		}
	}

	shouldComponentUpdate(nextProps, nextState){
			// console.log(this.props.data, nextProps.data);
		if((JSON.stringify(this.props.data) == JSON.stringify(nextProps.data) &&
			this.state == nextState)){
			return false;
		}

		return true;
	}

	componentFocus(){
		let data = this.props.data;

		if(data.NewOrder){
			let dom = this.refs;

			if(data.Limit && data.Price == '0.'){
				dom.inputPrice.focus();
				OddsConverterObj.calculation(this, 'quantity', data.Limit)
			}
			else
				dom.inputQuantity.focus();
		}
	}

	componentDidUpdate(){
		this.componentFocus();
	}

	componentDidMount(){
		this.componentFocus();
	}

	render()
	{
		let data = this.props.data;
		let formData = this.props.formData;
		let className = data.Side ? 'sell' : 'buy';
		let orderId;
		let fees = OddsConverterObj.calcBeforeOrderAdd(this);
		let checkboxProp = (data.Limit == undefined) ?
			this.state ? this.state.checkboxProp : true
			:
			data.Limit;
		let style = checkboxProp ? {display: 'block'} : {display: 'none'};

 		if(!data.NewOrder){
 			orderId = data.ID;
 			data.Price = data.isMirror ? Math.round10(1 - data.Price, -2) : Math.round10(data.Price, -2);
			className = (data.isMirror) ?
				data.Side ? 'buy' : 'sell'
				:
				data.Side ? 'sell' : 'buy';
		}
		else{
 			orderId = data.Symbol ? `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}_${data.Side}_${data.isMirror}` : ''
		}

		return (
			<form action={formData.url} className={className + (ABpp.config.basicMode ? ' basic_mode' : '') + ' animated'} autoComplete="off" onSubmit={this.props.actions.actionOnAjaxSend.bind(null, this, this.props.containerData)} method="post"
				  noValidate="novalidate" ref="orderForm" data-verify={['Price', 'Volume']}>
				<div className="container">
					<div className="price">
						<label htmlFor={`${orderId}_price`}>
							{
								checkboxProp ?
									'Your price'
									:
									'Market price'
							}
						</label>
						<div className="input">
							<input type="tel" id={`${orderId}_price`} className="number" data-validation="0.33"
								   maxLength="4" name="LimitPrice" autoComplete="off" defaultValue={data.Price} key={data.Price + 'price'}
								   onKeyUp={OddsConverterObj.calculation.bind(null, this, 'price', checkboxProp)}
								   disabled={!(checkboxProp)} ref="inputPrice"/>
							<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							{
								<div className="regulator" style={style}>
								<span className="plus" title="Press Arrow Up"
									  onClick={OddsConverterObj.calculation.bind(null, this, 'price', checkboxProp)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={OddsConverterObj.calculation.bind(null, this, 'price', checkboxProp)}>{}</span>
								</div>
							}
						</div>
					</div>
					<div className="volume">
						<label htmlFor={`${orderId}_quantity`}>Quantity</label>
						<div className="input">
							<input type="tel" id={`${orderId}_quantity`} className="number" data-validation="123"
								   maxLength="7" name="Quantity" autoComplete="off" defaultValue={data.Volume} key={data.Volume + 'volume'}
								   onKeyUp={OddsConverterObj.calculation.bind(null, this, 'quantity', checkboxProp)}
								   ref="inputQuantity"/>
							<div className="warning" style={{display: 'none'}}>
								<p>Available integer value more than 0</p>
							</div>
							<div className="regulator">
							<span className="plus" title="Press Arrow Up"
								  onClick={OddsConverterObj.calculation.bind(null, this, 'quantity', checkboxProp)}>{}</span>
								<span className="minus" title="Press Arrow Down"
									  onClick={OddsConverterObj.calculation.bind(null, this, 'quantity', checkboxProp)}>{}</span>
							</div>
						</div>
					</div>
					<div className="obligations">
						<label htmlFor={`${orderId}_sum`}>Sum</label>
						<div className="input">
							<input type="tel" id={`${orderId}_sum`} className="number" data-validation="40.59"
								   maxLength="7" autoComplete="off" disabled={!(checkboxProp)}
								   onKeyUp={OddsConverterObj.calculation.bind(null, this, 'sum', checkboxProp)}
								   ref="inputSum"/>
							<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>
							{
								<div className="regulator" style={style}>
								<span className="plus" title="Press Arrow Up"
									  onClick={OddsConverterObj.calculation.bind(null, this, 'sum', checkboxProp)}>{}</span>
									<span className="minus" title="Press Arrow Down"
										  onClick={OddsConverterObj.calculation.bind(null, this, 'sum', checkboxProp)}>{}</span>
								</div>
							}
						</div>
					</div>
				</div>
				<div className="container">
					<div className="fees">
						<label>
							<span>Max </span>Fees
							<div className="help">
								<div className="help_message right">
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
								</div>
							</div>
						</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputFees"
								   defaultValue={checkboxProp ? '' : fees} key={fees + 'fee'} disabled/>
						</div>
					</div>
					<div className="risk">
						<label>Total Cost</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputRisk" disabled/>
						</div>
					</div>
					<div className="profit">
						<label>Profitability</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputProfit" disabled />
						</div>
					</div>
				</div>
				{data.ID ? <input name="ID" type="hidden" value={data.ID}/> : ''}
				<input name="Symbol" type="hidden" className="symbol" value={`${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`}/>
				<input name="isMirror" type="hidden" className="mirror" value={data.isMirror}/>
				<input name="Side" type="hidden" className="side" value={(className)[0].toUpperCase() + (className).slice(1)}/>
				<div className="container">
					<div className="switch">
						<label className="checkbox">
							{
								data.Limit == undefined ?
									<input name="OrderType" type="checkbox" value="true" checked={checkboxProp}
										   onChange={this.onTypeChange.bind(this, checkboxProp)}/>
									:
									<input name="OrderType" type="checkbox" value="true" checked={checkboxProp}
										   onChange={this.props.actions.actionOnOrderTypeChange.bind(null, checkboxProp, this)}/>
							}
							<input name="OrderType" type="hidden" value="false"/>
							<span>{checkboxProp ? 'Limit' : 'Market'}</span>
						</label>
					</div>
					<i className="submit wave waves-input-wrapper waves-effect waves-button">
						<input type="submit" className={`btn ${className}`} value={className} style={{textTransform: 'uppercase'}}/>
					</i>
					{
						data.NewOrder ?
							<span className="delete" onClick={this.props.onOrderDelete}>{}</span>
							:
							''
					}
				</div>
				<div className="error_pop_up">
					<span>The connection to the server has been lost. Please check your internet connection or try again.</span>
					<span className="close"><span>{}</span></span>
				</div>
			</form>
		)
	}
}

// export default connect(state => ({
// 		orderForm: state.orderForm,
// 	}),
// 	dispatch => ({
// 		orderFormActions: bindActionCreators(orderFormActions, dispatch),
// 	})
// )(OrderForm)