import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as orderFormActions from '../../../actions/order/orderFormActions.ts';
import InputNumber from '../../inputNumber';
import OddsConverter from '../../../models/oddsConverter/oddsConverter.js';

let OddsConverterObj = new OddsConverter();

export default class OrderForm extends React.Component{
	constructor(props)
	{
		super();
		this.state = {
			...props.data,
			currentOddSystem: ABpp.config.currentOddSystem
		};
		const price = this.state.Side ? 1 - Math.round10(1 - this.state.Price, -2) : this.state.Price;
		this.OddsConverterObj = new OddsConverter();
		this.state.Sum = Math.round10(price * this.state.Volume, -2);
		if(this.state.Limit == undefined) this.state.Limit = true;

		// let arr = [];
		// for(let ii = 0.01; ii <= 0.99; ii += 0.01){
		// 	arr.push(OddsConverterObj.convertToOtherSystem(ii));
		// 	// console.log(`${Math.round10(ii, -2)}: `, OddsConverterObj.convertToOtherSystem(ii));
		// }
		// arr.push(OddsConverterObj.convertToOtherSystem(0.99));
		// arr.forEach(function (item) {
		// 	console.log(OddsConverterObj.convertToAltbetSystem(item));
		// });
		// console.log('==================================================================');
		// OddsConverterObj.convertToAltbetSystem('49/1');
		// console.log(`+104`, OddsConverterObj.convertToAltbetSystem('+104'));
		// console.log(`-233`, OddsConverterObj.convertToAltbetSystem('-233'));
		// console.log(`1/5`, OddsConverterObj.convertToAltbetSystem('1/5'));
		// console.log(`-5000`, OddsConverterObj.convertToAltbetSystem('-5000'));
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

	// ajaxSendHandler(e)
	// {
	// 	e.preventDefault();
	// 	defaultMethods.sendAjaxRequest({
	// 		httpMethod: 'POST',
	// 		url: this.props.formData.url,
	// 		callback: ::this.onSuccessAjax,
	// 		onError: ::this.onErrorAjax,
	// 		beforeSend: ::this.OnBeginAjax,
	// 		context: $(this.refs.orderForm)
	// 	});
	// }

	onInputIncrement(input, value, event)
	{
		const state = this.state;
		const refs = this.refs;

		// console.log(refs.inputSum.refs.input);
		if(input == 'Sum' && +state.Price){
			const price = state.Side ? 1 - state.Price : state.Price;
			const sum = Math.round10(+state[input] + value, -2);
			state[input] = sum;
			input = 'Volume';
			value = Math.round(sum / price);
			refs.inputSum.refs.input.focus();

			if(value <= 0)
				state[input] = 1;
			else if(value > 9999999)
				state[input] = 9999999;
			else
				state[input] = value;
		}
		else{
			value = Math.round10(+state[input] + value, -2);
			if(input == 'Price'){
				if(value <= 0)
					state[input] = value = 0.01;
				else if(value > 0.99)
					state[input] = value = 0.99;
				else
					state[input] = value;

				const price = state.Side ? 1 - value : value;
				state['Sum'] =  Math.round10(state.Volume * price, -2);
				refs.inputPrice.refs.input.focus();
			}
			else{
				if(value <= 0)
					state[input] = 1;
				else if(value > 9999999)
					state[input] = 9999999;
				else{
					if(input == 'Volume'){
						const price = state.Side ? 1 - state.Price : state.Price;
						state[input] = value;
						value = Math.round10(value * price, -2);
						refs.inputQuantity.refs.input.focus();
					}
					else
						refs.inputSum.refs.input.focus();

					state['Sum'] = value;
					// state[input] = value;
				}

			}
		}
		this.setState(state)
	}

	onInputKeyDown(input, event)
	{
		const code = event.which || event.charCode || event.keyCode;


		if(code == 38){
			event.preventDefault();
			this.onInputIncrement(input, input == 'Price' ? 0.01 : 1, event);
		}
		else if(code == 40)
			this.onInputIncrement(input, input == 'Price' ? -0.01 : -1, event)
	}

	onInputChange(input, event)
	{
		const state = this.state;
		const inputValue = event.target.value;
		let value;
		if(input == 'Sum' && +state.Price){
			value = Math.round(+inputValue / (state.Side ? 1 - state.Price : state.Price));
			state['Volume'] = value;
			state[input] = inputValue;
		}
		else if(input == 'Price'){
			value = inputValue;
			state[input] = value;
			const price = state.Side ? 1 - value : value;
			value = Math.round10(state.Volume * price, -2);
			if(inputValue != '0.') state['Sum'] = value;
			// console.dir(event.handler);
		}
		else{
			value = inputValue;
			if(input == 'Volume'){
				const price = state.Side ? 1 - state.Price : state.Price;
				state[input] = value;
				value = Math.round10(value * price, -2);
			}
			state['Sum'] = value;
		}
		// console.log(value);
		// state[input] = value || '';
		// console.log(state[input]);
		this.setState(state);

	}

	onTypeChange(checkboxProp)
	{
		// const price = $(this.refs.inputPrice.refs.input);
		const quantity = $(this.refs.inputQuantity.refs.input);

		this.state.Limit = !checkboxProp;
		this.setState(this.state);

		// if (!checkboxProp) {
		//
		// 	setTimeout(function () {
		// 		price.focus();
		// 		price[0].selectionStart = 4;
		// 	}, 300);
		// }
		// else {
			quantity.focus();
			quantity[0].selectionStart = quantity.val().length;
		// }
	}

	shouldComponentUpdate(nextProps, nextState){
			// console.log(this.props.data, nextProps.data);
		if((JSON.stringify(this.props.data) == JSON.stringify(nextProps.data) &&
			this.state == nextState && this.state.currentOddSystem == ABpp.config.currentOddSystem)){
			return false;
		}
		this.state.currentOddSystem = ABpp.config.currentOddSystem;
		// console.log(JSON.stringify(this.props.data));
		// console.log(JSON.stringify(nextProps.data));
		if(JSON.stringify(this.props.data) != JSON.stringify(nextProps.data)){
			this.state.Price = nextProps.data.Price;
			this.state.Volume = nextProps.data.Volume
		}

		return true;
	}

	componentFocus(){
		let data = this.props.data;

		if(data.NewOrder){
			let dom = this.refs;

			if(data.Limit && data.Price == '0.'){
				dom.inputPrice.refs.input.focus();
			}
			else
				dom.inputQuantity.refs.input.focus();
		}
	}

	componentDidUpdate(prevProps){
		const data = this.props.data;
		const prevData = prevProps.data;
		// const state = this.state;
		// console.log(state);
		// console.log(prevState);
		if(data.Price != prevData.Price || data.Volume != prevData.Volume || data.Limit != prevData.Limit){
			this.componentFocus();
		}
	}

	componentDidMount(){
		this.componentFocus();
	}

	render()
	{
		const stateData = this.state;
		const { actions, containerData, data, formData, onOrderDelete } = this.props;
		let className = data.Side ? 'sell' : 'buy';
		let orderId;
		const checkboxProp = (data.Limit == undefined) ?
			stateData.Limit
			:
			data.Limit;
		const style = checkboxProp ? {display: 'block'} : {display: 'none'};

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
		const price = stateData.Side ? Math.round10(1 - stateData.Price, -2) : stateData.Price;
		// const sum = +price && (/[0-9]+|[.][0-9]+/gi.test(data.Sum) || !data.Sum) ? Math.round10(price * data.Volume, -2) : data.Sum;
		const fees = Math.round10(ABpp.config.takerFees * stateData.Volume, -2);

		return (
			<form action={formData.url} className={className + (ABpp.config.basicMode ? ' basic_mode' : '') + ' animated'} autoComplete="off"
				  onSubmit={actions.actionOnAjaxSend.bind(null, this, containerData)} method="post"
				  noValidate="novalidate" ref="orderForm" data-verify={['Price', 'Volume']}>
				<div className="container">
					<div className="price">
						<label className="with_info" htmlFor={`${orderId}_price`}>
							{
								checkboxProp ?
									'Your price'
									:
									'Market price'
							}
							{
								<div className="help">
									<div className="help_message right">
										<p>
											{`${this.OddsConverterObj.getSystemName()} odds : ${checkboxProp ?
												+stateData.Price ? this.OddsConverterObj.convertToOtherSystem(stateData.Price) : ''
												:
												+data.Price ? this.OddsConverterObj.convertToOtherSystem(stateData.Price) : ''}`}

										</p>
									</div>
								</div>
							}
						</label>
						<div className="input">
							<InputNumber type="tel" id={`${orderId}_price`} className="number" data-validation="0.33"
										 maxLength="4" name="LimitPrice" autoComplete="off"
										 onChange={this.onInputChange.bind(this, 'Price')}
										 onKeyDown={this.onInputKeyDown.bind(this, 'Price')}
										 value={checkboxProp ? stateData.Price : data.Price}
										 key={checkboxProp}
										 disabled={!(checkboxProp)} ref="inputPrice" inputValidate = 'price'/>
							<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							{
								<div className="regulator" style={style}>
									<span className="plus" onClick={this.onInputIncrement.bind(this, 'Price', 0.01)}
										  title="Press Arrow Up">{}</span>
									<span className="minus" onClick={this.onInputIncrement.bind(this, 'Price', -0.01)}
										  title="Press Arrow Down">{}</span>
								</div>
							}
						</div>
					</div>
					<div className="volume">
						<label htmlFor={`${orderId}_quantity`}>Quantity</label>
						<div className="input">
							<InputNumber type="tel" id={`${orderId}_quantity`} className="number" data-validation="123"
										 maxLength="7" name="Quantity" autoComplete="off"
										 onChange={this.onInputChange.bind(this, 'Volume')}
										 onKeyDown={this.onInputKeyDown.bind(this, 'Volume')}
										 value={stateData.Volume}
										 ref="inputQuantity" inputValidate = 'integer'/>
							<div className="warning" style={{display: 'none'}}>
								<p>Available integer value more than 0</p>
							</div>
							<div className="regulator">
								<span className="plus" onClick={this.onInputIncrement.bind(this, 'Volume',  1)}
									  title="Press Arrow Up">{}</span>
								<span className="minus" onClick={this.onInputIncrement.bind(this, 'Volume',  -1)}
									  title="Press Arrow Down">{}</span>
							</div>
						</div>
					</div>
					<div className="obligations">
						<label htmlFor={`${orderId}_sum`}>Sum</label>
						<div className="input">
							<InputNumber type="tel" id={`${orderId}_sum`} className="number" data-validation="40.59" hard="true"
										 onChange={this.onInputChange.bind(this, 'Sum')}
										 onKeyDown={this.onInputKeyDown.bind(this, 'Sum')}
										 value={checkboxProp ? stateData.Sum || '' : ''}
										 maxLength="7" autoComplete="off" disabled={!(checkboxProp)} ref="inputSum"/>
							<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>
							{
								<div className="regulator" style={style}>
									<span className="plus" onClick={this.onInputIncrement.bind(this, 'Sum', 1)}
										  title="Press Arrow Up">{}</span>
									<span className="minus" onClick={this.onInputIncrement.bind(this, 'Sum', -1)}
										  title="Press Arrow Down">{}</span>
								</div>
							}
						</div>
					</div>
				</div>
				<div className="container">
					<div className="fees">
						<label className="with_info">
							<span>Max </span>Fees
							<div className="help">
								<div className="help_message right">
									<p>Max fees for this order</p>
								</div>
							</div>
						</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputFees"
								   onChange={null} value={stateData.Volume ? fees || '' : ''} disabled/>
						</div>
					</div>
					<div className="risk">
						<label className="with_info">
							Total Cost
							<div className="help">
								<div className="help_message right">
									<p><span>Combined cost of contracts and  applicable fees<br/>
										{checkboxProp && 'Formula:'}</span> {checkboxProp ?
										+stateData.Sum ? `${stateData.Sum} + ${fees}` : ''
										:
										''}</p>
								</div>
							</div>
						</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputRisk"
								   onChange={null} value={checkboxProp ?
									   +stateData.Sum ? Math.round10(+stateData.Sum + fees, -2) : ''
									   :
									   ''} disabled/>
						</div>
					</div>
					<div className="profit">
						<label className="with_info">
							Profitability
							<div className="help">
								<div className="help_message right">
									<p>
										<span>Possible maximum prize if position results in winning outcome<br/>
											{checkboxProp && 'Formula:'}</span> {
											checkboxProp && +price && stateData.Volume ? `(1 - ${price}) * ${stateData.Volume}` || '' : ''
										}
									</p>
								</div>
							</div>
						</label>
						<div className="input">
							<input type="text" className="number" autoComplete="off" ref="inputProfit"
								   onChange={null} value={checkboxProp && +price && stateData.Volume ? Math.round10((1 - price) * stateData.Volume, -2) || '' : ''}
								   disabled />
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
								data.NewOrder ?
									<input name="OrderType" type="checkbox" value="true" checked={checkboxProp}
										   onChange={actions.actionOnOrderTypeChange.bind(null, checkboxProp, this)}/>
									:
									<input name="OrderType" type="checkbox" value="true" checked={checkboxProp}
										   onChange={this.onTypeChange.bind(this, checkboxProp)}/>
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
							<span className="delete" onClick={onOrderDelete}>{}</span>
							:
							''
					}
				</div>
				{/*<div className="error_pop_up">*/}
					{/*<span>The connection to the server has been lost. Please check your internet connection or try again.</span>*/}
					{/*<span className="close"><span>{}</span></span>*/}
				{/*</div>*/}
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