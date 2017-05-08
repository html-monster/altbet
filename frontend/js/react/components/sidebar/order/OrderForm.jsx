import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as orderFormActions from '../../../actions/order/orderFormActions.ts';
import InputNumber from '../../inputNumber';
import OddsConverter from '../../../models/oddsConverter/oddsConverter.js';

let OddsConverterObj = new OddsConverter();


/**
 * props:{
 * 	formUrl - string, form action *required
 * 	id - string
 * 	limit - boolean *required
 * 	side - string, order side *required
 * 	price - order price
 * 	quantity
 * 	isMirror - *required
 * 	symbol - event symbol *required
 *  orderMode - string, can be: 'expert', 'basic', 'normal'
 *  showDeleteButton - boolean
 *  focus - string, turn on or off focus on price or quantity input; can be: 'price', 'quantity', 'normal'
 *  focusOn - boolean, put focus on input or not
 *  onSubmit - function
 *  onDelete - function
 *  onTypeChange - function
 * }
 */
export default class OrderForm extends React.Component{
	constructor(props)
	{
		super();
		this.state = {
			focus: 'normal', // свойство показывающее в какое поле надо поставить фокус
			focusOn: true, // надо ли вообще ставить фокус
			currentOddSystem: ABpp.config.currentOddSystem,
			...props
		};
		const price = this.state.side === 'sell' ? Math.round10(1 - this.state.price, -2) : this.state.price;
		this.OddsConverterObj = new OddsConverter();
		this.state.sum = Math.round10(price * this.state.quantity, -2);
		if(this.state.price === undefined) this.state.price = '0.';
		// if(this.state.limit === undefined) this.state.limit = true;

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

	onInputIncrement(input, value, event)
	{
		const { onKeyDownQuantity } = this.props;
		const state = this.state;
		const refs = this.refs;

		// if(input === 'sum' && +state.price){
		// 	const price = state.side === 'sell' ? 1 - state.price : state.price;
		// 	const sum = Math.round10(+state[input] + value, -2);
		//
		// 	if(sum > 0 && sum <= 9999999) state[input] = sum.toFixed(2);
		//
		// 	input = 'quantity';
		// 	value = Math.round(sum / price);
		// 	refs.inputSum.refs.input.focus();
		//
		// 	if(value <= 0)
		// 		state[input] = 1;
		// 	else if(value > 9999999)
		// 		state[input] = 9999999;
		// 	else
		// 		state[input] = value;
		// }
		// else{
			if(input === 'quantity' && onKeyDownQuantity) onKeyDownQuantity(value, event);
			value = Math.round10(+state[input] + value, -2);
			if(input === 'price'){
				if(value <= 0)
					state[input] = value = 0.01;
				else if(value > 0.99)
					state[input] = value = 0.99;
				else
					state[input] = value.toFixed(2);

				const price = state.side === 'sell' ? 1 - value : value;
				state['sum'] =  (Math.round10(state.quantity * price, -2)).toFixed(2);
				refs.inputPrice.refs.input.focus();
			}
			else{
				if(value <= 0)
					state[input] = 1;
				else if(value > 9999999)
					state[input] = 9999999;
				else{
					if(input === 'quantity'){
						const price = state.side === 'sell' ? 1 - state.price : state.price;
						state[input] = value;
						value = Math.round10(value * price, -2);
						refs.inputQuantity.refs.input.focus();
					}
					else
						refs.inputSum.refs.input.focus();

					state['sum'] = value.toFixed(2);
					// state[input] = value;
				}

			}
		// }
		state.focusOn = false;

		this.setState(state)
	}

	onInputKeyDown(input, event)
	{
		const code = event.which || event.charCode || event.keyCode;

		if(code === 38){
			event.preventDefault();
			this.onInputIncrement(input, input === 'price' ? 0.01 : 1, event);
		}
		else if(code === 40){
			this.onInputIncrement(input, input === 'price' ? -0.01 : -1, event);
		}
	}

	onInputChange(input, event)
	{
		const state = this.state;
		const { onChangeQuantity } = this.props;
		const inputValue = ((event.target.value).replace('$', ''));
		let value;

		// if(input === 'sum' && +state.price){
		// 	value = Math.round(+inputValue / (state.side === 'sell' ? 1 - state.price : state.price));
		// 	state['quantity'] = value;
		// 	state[input] = inputValue;
		// }
		// else
			if(input === 'price'){
			value = inputValue;
			state[input] = value;
			const price = state.side === 'sell' ? 1 - value : value;
			value = Math.round10(state.quantity * price, -2);
			if(inputValue !== '0.') state['sum'] = value.toFixed(2);
			// console.dir(event.handler);
		}
		else{
			value = inputValue;
			if(input === 'quantity'){
				const price = state.side === 'sell' ? 1 - state.price : state.price;
				state[input] = value;
				value = Math.round10(value * price, -2);
				if(onChangeQuantity) onChangeQuantity(event);
			}
			state['sum'] = value.toFixed(2);
		}
		// console.log(value);
		// state[input] = value || '';
		// console.log(state[input]);
		state.focusOn = false;

		this.setState(state);
	}

	onTypeChange(checkboxProp)
	{
		let state = this.state;
		const { newOrder, onTypeChange } = this.props;
		// const price = $(this.refs.inputPrice.refs.input);
		// const quantity = $(this.refs.inputQuantity.refs.input);

		state.limit = !checkboxProp;

		this.setState(state);

		this.componentFocus();

		if(onTypeChange) onTypeChange(checkboxProp);
	}

	shouldComponentUpdate(nextProps, nextState)
	{
		// console.log(this.props.limit, nextProps.limit);
		// console.log(JSON.stringify(this.props) === JSON.stringify(nextProps));
		// console.log('this.state:', this.state.quantity);
		// console.log('nextState:', nextState.quantity);
		if((JSON.stringify(this.props) === JSON.stringify(nextProps) &&
			this.state === nextState && this.state.currentOddSystem === ABpp.config.currentOddSystem))
		{
			return false;
		}
		this.state.currentOddSystem = ABpp.config.currentOddSystem;
		// console.log(JSON.stringify(this.props.data));
		// console.log(JSON.stringify(nextProps.data));
		if(this.props.price !== nextProps.price || this.props.quantity !== nextProps.quantity
			|| this.props.limit !== nextProps.limit || this.props.focusOn !== nextProps.focusOn)
		{
			this.state.price = nextProps.price;
			this.state.quantity = nextProps.quantity;
			this.state.limit = nextProps.limit;
			this.state.sum = Math.round10(nextProps.price * nextProps.quantity, -2);
			if(nextProps.focusOn !== undefined) this.state.focusOn = nextProps.focusOn
		}

		return true;
	}

	onPriceFocus()
	{
		if(!this.state.limit) this.onTypeChange(false);
	}

	onBlur()
	{
		let state = this.state;

		state.price = (+state.price).toFixed(2);

		this.setState(state);
	}

	rippleHide()
	{
		$('.waves-ripple').remove();
	}

	onClickSide(side)
	{
		// console.log('side:', side);
		// console.log('this.state:', this.state);
		this.setState({...this.state, side})
	}

	componentFocus()
	{
		const { focus, focusOn, limit } = this.state;
		const price = this.refs.inputPrice.refs.input;
		const quantity = this.refs.inputQuantity.refs.input;

		if(focusOn){
			switch (focus){
				case 'price':
					price.focus();
					break;
				case 'quantity':
					quantity.focus();
					break;
				default:
					if (limit) price.focus();
					else quantity.focus();
			}
		}
	}

	componentDidUpdate(prevProps, prevState)
	{
		const props = this.props;
		// const state = this.state;
		// console.log('props.quantity:', props.quantity);
		// console.log('prevProps.quantity:', prevProps.quantity);
		// console.log('state.quantity:', state.quantity);
		// console.log('prevState.quantity:', prevState.quantity);
		if(props.price !== prevProps.price || (props.quantity !== prevProps.quantity /*&& props.quantity !== state.quantity*/)
			|| props.limit !== prevProps.limit){
			this.componentFocus();
		}
	}

	componentDidMount()
	{
		this.componentFocus();
	}

	render()
	{
		const stateData = this.state;
		const { formUrl, id, side, limit, isMirror, symbol, newOrder = true, orderMode, price, showDeleteButton = true, onSubmit, onDelete} = this.props;
		const fees = Math.round10(ABpp.config.takerFees * stateData.quantity, -2);
		let checkboxProp = stateData.limit;
		let formClass;

		if(orderMode === 'expert')
			formClass = '';
		else if(orderMode === 'basic'){
			formClass = ' basic_mode';
			// checkboxProp = true
		}
		else
			formClass = ABpp.config.basicMode ? ' basic_mode' : '';

		// const style = checkboxProp ? {display: 'block'} : {display: 'none'};

		return (
			<form action={formUrl} className={side + formClass + ' animated'} autoComplete="off"
					  onSubmit={onSubmit} method="post"
				  noValidate="novalidate" data-verify={['price', 'quantity']}>
				<div className="container">
					<div className="price">
						<label className="with_info" htmlFor={`${id}_price`}>
							{
								checkboxProp ?
									'Per Entry'
									:
									'Market price'
							}
							{
								<div className="help">
									<div className="help_message right">
										<p>
											{`${this.OddsConverterObj.getSystemName()} odds : ${checkboxProp ?
												+stateData.price ? this.OddsConverterObj.convertToOtherSystem(stateData.price) : ''
												:
												+price ? this.OddsConverterObj.convertToOtherSystem(stateData.price) : ''}`}

										</p>
									</div>
								</div>
							}
						</label>
						<div className="input">
							<InputNumber type="tel" id={`${id}_price`} className="number"
										 maxLength="5" autoComplete="off"
										 onChange={this.onInputChange.bind(this, 'price')}
										 onKeyDown={this.onInputKeyDown.bind(this, 'price')}
										 onFocus={::this.onPriceFocus}
										 onBlur={::this.onBlur}
										 value={checkboxProp ? stateData.price : price}
										 key={price}
										 hard={true} label={true} disabled={orderMode === 'basic' && !limit}
										 ref="inputPrice" inputValidate = 'price'/>
							<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>
							{
								orderMode === 'basic' && !limit ?
									''
									:
									<div className="regulator">
											<span className="plus" onClick={this.onInputIncrement.bind(this, 'price', 0.01)}
												  title="Press Arrow Up">{}</span>
										<span className="minus" onClick={this.onInputIncrement.bind(this, 'price', -0.01)}
											  title="Press Arrow Down">{}</span>
									</div>
							}
						</div>
					</div>
					<div className="volume">
						<label htmlFor={`${id}_quantity`}>{_t('Quantity')}</label>
						<div className="input">
							<InputNumber type="tel" id={`${id}_quantity`} className="number" data-validation="123"
										 maxLength="7" name="Quantity" autoComplete="off"
										 onChange={this.onInputChange.bind(this, 'quantity')}
										 onKeyDown={this.onInputKeyDown.bind(this, 'quantity')}
										 value={stateData.quantity}
										 ref="inputQuantity" inputValidate = 'integer'/>
							<div className="warning" style={{display: 'none'}}>
								<p>Available integer value more than 0</p>
							</div>
							<div className="regulator">
								<span className="plus" onClick={this.onInputIncrement.bind(this, 'quantity',  1)}
									  title="Press Arrow Up">{}</span>
								<span className="minus" onClick={this.onInputIncrement.bind(this, 'quantity',  -1)}
									  title="Press Arrow Down">{}</span>
							</div>
						</div>
					</div>
					{/*<div className="obligations">*/}
						{/*<label htmlFor={`${id}_sum`}>Amount</label>*/}
						{/*<div className="input">*/}
							{/*<InputNumber type="tel" id={`${id}_sum`} className="number" data-validation="40.59" hard={true}*/}
										 {/*onChange={this.onInputChange.bind(this, 'sum')}*/}
										 {/*onKeyDown={this.onInputKeyDown.bind(this, 'sum')}*/}
										 {/*value={checkboxProp ? (!stateData.sum ||stateData.sum === '0.00' ? '' : stateData.sum) : ''}*/}
										 {/*label={true}*/}
										 {/*maxLength="8" autoComplete="off" disabled={!(checkboxProp)} ref="inputSum"/>*/}
							{/*<div className="warning right" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>*/}
							{/*{*/}
								{/*<div className="regulator" style={style}>*/}
									{/*<span className="plus" onClick={this.onInputIncrement.bind(this, 'sum', 1)}*/}
										  {/*title="Press Arrow Up">{}</span>*/}
									{/*<span className="minus" onClick={this.onInputIncrement.bind(this, 'sum', -1)}*/}
										  {/*title="Press Arrow Down">{}</span>*/}
								{/*</div>*/}
							{/*}*/}
						{/*</div>*/}
					{/*</div>*/}
				</div>
				<div className="container info">
					{/*<div className="fees">*/}
						{/*<label className="with_info">*/}
							{/*<span>Fees</span>*/}
							{/*<div className="help">*/}
								{/*<div className="help_message right">*/}
									{/*<p>{_t('MaxAltBetFees')}</p>*/}
								{/*</div>*/}
							{/*</div>*/}
						{/*</label>*/}
						{/*<div className="input">*/}
							{/*<input type="text" className="number" autoComplete="off" ref="inputFees"*/}
								   {/*onChange={null} value={stateData.quantity ? '$' + fees.toFixed(2) || '' : ''} disabled/>*/}
						{/*</div>*/}
					{/*</div>*/}
					{/*<div className="risk">*/}
						{/*<label className="with_info">*/}
							{/*Total Fees*/}
							{/*<div className="help">*/}
								{/*<div className="help_message">*/}
									{/*<p><span style={{padding: 0}}>Total Pay-to Play Fees<br/>*/}
										{/*{checkboxProp && 'Formula:'}</span> {checkboxProp ?*/}
										{/*+stateData.sum ? `$${(+stateData.sum).toFixed(2)} + $${(fees).toFixed(2)}` : ''*/}
										{/*:*/}
										{/*''}</p>*/}
								{/*</div>*/}
							{/*</div>*/}
						{/*</label>*/}
						{/*<div className="input">*/}
							{/*<input type="text" className="number" autoComplete="off" ref="inputRisk"*/}
								   {/*onChange={null} value={checkboxProp ?*/}
									   {/*+stateData.sum ? '$' + (Math.round10(+stateData.sum + fees, -2)).toFixed(2) : ''*/}
									   {/*:*/}
									   {/*''} disabled/>*/}
						{/*</div>*/}
					{/*</div>*/}
					<div className="profit">
						<strong className="info_string">
							Potential Prize <span>{stateData.quantity ? `$${(+stateData.quantity).toFixed(2)}` : '$0.00'}</span>
						</strong>
						{/*<label>*/}
							{/*{_t('Profitability')}*/}
						{/*</label>*/}
						{/*<div className="input">*/}
							{/*<input type="text" className="number" autoComplete="off" ref="inputProfit"*/}
								   {/*onChange={null} value={stateData.quantity ? `$${(+stateData.quantity).toFixed(2)}` : ''}*/}
								   {/*disabled />*/}
							{/*/!*checkboxProp && +price && stateData.Volume ? Math.round10((1 - price) * stateData.Volume, -2) || '' : ''*!/*/}
						{/*</div>*/}
					</div>
				</div>
				{!newOrder && id ? <input name="ID" type="hidden" value={id}/> : ''}
				<input name="LimitPrice" type="hidden" value={checkboxProp ? stateData.price : price}/>
				<input name="Symbol" type="hidden" className="symbol" value={symbol}/>
				<input name="isMirror" type="hidden" className="mirror" value={isMirror}/>
				<input name="Side" type="hidden" className="side" value={(stateData.side)[0].toUpperCase() + (stateData.side).slice(1)}/>
				<input name="OrderType" type="hidden" value={checkboxProp}/>
				<div className="container">
					{/*<div className="switch">*/}
						{/*<label className="checkbox">*/}
							{/*<input name="OrderType" type="checkbox" value="true" checked={checkboxProp}*/}
								   {/*onChange={this.onTypeChange.bind(this, checkboxProp)}/>*/}
							{/*{*/}
								{/*checkboxProp ? '' : <input name="OrderType" type="hidden" value="false"/>*/}
							{/*}*/}
							{/*<span>{checkboxProp ? 'Limit' : 'Market'}</span>*/}
						{/*</label>*/}
					{/*/!*</div>*!/*/}
					{/*<span className="help amount left balloon_only">*/}
						{/*${(Math.round10(stateData.price * stateData.quantity, -2)).toFixed(2)}*/}
						{/*<span className="help_message">*/}
							{/*<strong>Total Pay-to Play Fees: <br/>*/}
								{/*${(Math.round10(stateData.price * stateData.quantity, -2)).toFixed(2)}*/}
								{/*{' + '}${fees.toFixed(2) + ' '}*/}
							{/*</strong>*/}
						{/*</span>*/}
					{/*</span>*/}
					{/*<span className="help amount right balloon_only">*/}
						{/*${(Math.round10((1 - stateData.price) * stateData.quantity, -2)).toFixed(2)}*/}
						{/*<span className="help_message"><strong>MM/DD/YYYY HH:MM</strong></span>*/}
					{/*</span>*/}
					<i className="submit wave waves-input-wrapper waves-effect waves-button">
						<button type="submit" className={`btn buy submit`}
								style={{textTransform: 'uppercase'}}
								onClick={this.onClickSide.bind(this, 'buy')}
								onMouseUp={this.rippleHide}>
							Buy
							<span className="amount">
								<span className="help balloon_only">
									${(Math.round10(stateData.price * stateData.quantity + fees, -2)).toFixed(2)}
									<span className="help_message right">
										<strong>Total Pay-to Play Fees: <br/>
											${(Math.round10(stateData.price * stateData.quantity, -2)).toFixed(2)}
											{' + '}${fees.toFixed(2) + ' '}
										</strong>
									</span>
								</span>
							</span>
						</button>
					</i>
					<i className="submit wave waves-input-wrapper waves-effect waves-button">
						<button type="submit" className={`btn sell submit`}
								style={{textTransform: 'uppercase'}}
								onClick={this.onClickSide.bind(this, 'sell')}
								onMouseUp={this.rippleHide}>
							<span className="amount">
								<span className="help balloon_only">
									${(Math.round10((1 - stateData.price) * stateData.quantity + fees, -2)).toFixed(2)}
									<span className="help_message">
										<strong>Total Pay-to Play Fees: <br/>
											${(Math.round10((1 - stateData.price) * stateData.quantity, -2)).toFixed(2)}
											{' + '}${fees.toFixed(2) + ' '}
										</strong>
									</span>
								</span>
							</span>
							Sell
						</button>
					</i>
						{
							showDeleteButton && onDelete ?
								<span className="delete" onClick={onDelete}>{}</span>
								:
								''
						}
								{/*<span className="close" onClick={onDelete}><span>{}</span></span>*/}
				</div>
				{/*<div className="error_pop_up">*/}
					{/*<span>The connection to the server has been lost. Please check your internet connection or try again.</span>*/}
					{/*<span className="close"><span>{}</span></span>*/}
				{/*</div>*/}
			</form>
		)
	}
}
