/**
 * Created by Htmlbook on 28.12.2016.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import NetellerForm from './transactionForms/NetellerForm';
import EcoPayzForm from './transactionForms/EcoPayzForm';
import * as actions from '../../../actions/userPage/depositActions';

class Deposit extends React.Component{
	constructor()
	{
		super();
		this.state = {toggle: 'Show'};
	}

	componentDidMount()
	{
		this.props.actions.actionOnSocketMessage();
	}

	pricePlanHover(mouseLocation, event)
	{
		if(mouseLocation == 'enter')
			$(event.target).parents('.item_container').find('ul.info').slideDown();
		else
			$(event.target).parents('.item_container').find('ul.info').hide();
	}

	scrollBottom()
	{
		$('html, body').animate({scrollTop: $(document).outerHeight(true)}, 800);
	}

	plansToggle()
	{
		$(this.refs.plans).slideToggle();
		$(this.refs.total).slideToggle();

		if(this.state.toggle == 'Hide')
			this.setState({toggle: 'Show'});
		else
			this.setState({toggle: 'Hide'});
	}

	render()
	{
		const { data, plan, payYearly, depositQuantity, pricePlan, sumValidation } = this.props.deposit;
		const actions = this.props.actions;

		return <div className="tab_item funds active">
			<h3>Add funds</h3>
			<span className="account_balance">You currently have <span className="value">${Math.round10(data.UserAssets.CurrentBalance, -2)}</span> in your account</span>
			<div className="quantity_control">
				<strong>Select deposit amount</strong>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>10</button>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>25</button>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>50</button>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>100</button>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>250</button>
				<button className="btn wave" onClick={actions.actionOnButtonQuantityClick.bind(null, actions)}>500</button>
				<input type="tel" className={`number ${sumValidation ? 'invalidJs' : ''}`} value={depositQuantity}
					   onChange={actions.actionOnInputQuantityChange.bind(null, actions)} maxLength="7" autoFocus/>
				<span className="validation-summary-errors">{sumValidation}</span>
				<span className="label">$</span>
			</div>
			<div className="recommended_block" onClick={::this.plansToggle}>
				<h4>Also the subscription is recommended</h4>
				<button className="btn wave">{this.state.toggle} Pricing plans</button>
			</div>
			<div className="price_wrapper price_plan_form" ref="plans">
				<div className="container">
					<div className="item_fees">
						<h5>Removing Liquidity (Taker's Fees)</h5>
						<span>${ABpp.CONSTS.TAKER_FEES}/contract</span>
					</div>
					<div className="item_fees">
						<h5>Adding Liquidity ( Maker's Fees)</h5>
						<span>(${ABpp.CONSTS.MAKER_FEES})/contract</span>
						<span className="description">* subject to periodic revisons by AltBet Exchange. B.V. </span>
					</div>
				</div>
				<div className="container">
					<div className="item_container" onClick={actions.actionOnPricePlanChange.bind(null, 'free', 0, 0)} onMouseLeave={this.pricePlanHover.bind(this, 'leave')}
						 onMouseEnter={this.pricePlanHover.bind(this, 'enter')}>
						<div className={'item ' + (plan == 'free' ? 'active' : '')}>
							<h4>Free</h4>
							<strong className="price"><span className="value">$</span>0</strong>
							<span className="time">PER MONTH</span>
							<ul className="main_info">
								<li>Low Fees</li>
								<li>Rebates for Liquidity Adding</li>
								<li>Low Settlement Fees</li>
							</ul>
							<ul className="info">
								<li>No Deposit Fees</li>
								<li>$10 Deposit Minimum</li>
								<li>Pass Through Withdrawal Fees</li>
							</ul>
						</div>
					</div>
					<div className="item_container" onClick={actions.actionOnPricePlanChange.bind(null, 'bronze', 10, 99)} onMouseLeave={this.pricePlanHover.bind(this, 'leave')}
						 onMouseEnter={this.pricePlanHover.bind(this, 'enter')}>
						<div className={'item ' + (plan == 'bronze' ? 'active' : '')}>
							<h4>Bronze</h4>
							<strong className="price"><span className="value">$</span>10</strong>
							<span className="time">PER MONTH <span className="same">(or $<span className="price">99</span>/year)</span></span>
							<ul className="main_info">
								<li>1500 contracts included</li>
								<li>(18000/year contracts included)</li>
							</ul>
							<ul className="info">
								<li>Low Fees</li>
								<li>Rebates for Liquidity Adding</li>
								<li>Waived Settlement Fees</li>
								<li>No Deposit Fees</li>
								<li>No Deposit Minimum</li>
								<li>Waived Withdrawal Fees</li>
								<li>save up to <strong>36%</strong></li>
							</ul>
						</div>
					</div>
					<div className="item_container" onClick={actions.actionOnPricePlanChange.bind(null, 'silver', 30, 299)} onMouseLeave={this.pricePlanHover.bind(this, 'leave')}
						 onMouseEnter={this.pricePlanHover.bind(this, 'enter')}>
						<div className={'item ' + (plan == 'silver' ? 'active' : '')}>
							<h4>Silver</h4>
							<strong className="price"><span className="value">$</span>30</strong>
							<span className="time">PER MONTH <span className="same">(or $<span className="price">299</span>/year)</span></span>
							<ul className="main_info">
								<li>5000 contracts included</li>
								<li>(60000/year contracts included)</li>
							</ul>
							<ul className="info">
								<li>Low Fees</li>
								<li>Rebates for Liquidity Adding</li>
								<li>Waived Settlement Fees</li>
								<li>No Deposit Fees</li>
								<li>No Deposit Minimum</li>
								<li>Waived Withdrawal Fees</li>
								<li>save up to <strong>42%</strong></li>
							</ul>
						</div>
					</div>
					<div className="item_container" onClick={actions.actionOnPricePlanChange.bind(null, 'gold', 100, 999)} onMouseLeave={this.pricePlanHover.bind(this, 'leave')}
						 onMouseEnter={this.pricePlanHover.bind(this, 'enter')}>
						<div className={'item ' + (plan == 'gold' ? 'active' : '')}>
							<h4>Gold</h4>
							<strong className="price"><span className="value">$</span>100</strong>
							<span className="time">PER MONTH <span className="same">(or $<span className="price">999</span>/year)</span></span>
							<ul className="main_info">
								<li>20000 contracts included</li>
								<li>(240000/year contracts included)</li>
							</ul>
							<ul className="info">
								<li>Low Fees</li>
								<li>Rebates for Liquidity Adding</li>
								<li>Waived Settlement Fees</li>
								<li>No Deposit Fees</li>
								<li>No Deposit Minimum</li>
								<li>Waived Withdrawal Fees</li>
								<li>save up to <strong>52%</strong></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="container period">
					<button className={'btn color wave waves-effect waves-button' + (!payYearly ? ' active' : '')} onClick={actions.actionOnPeriodChange.bind(null, this, false)}>Pay monthly</button>
					<button className={'btn color wave waves-effect waves-button' + (payYearly ? ' active' : '')} onClick={actions.actionOnPeriodChange.bind(null, this, true)}>Pay yearly</button>
				</div>
			</div>
			<div className="total_container" ref="total">
				<span>Deposit amount: <span className="value">{depositQuantity ? '$' + depositQuantity : '$0'}</span></span>
				<span>Price of plan: <span className="value">{pricePlan ? '$' + pricePlan : '$0'}</span></span>
				<span>Total: <span className="value">{depositQuantity || pricePlan ? '$' + (depositQuantity + pricePlan) : '$0'}</span></span>
			</div>
			<div className="payment_container">
				<div className="tabs">
					<span className="tab btn wave VisaMC" onClick={this.scrollBottom}><span>{}</span></span>
					<span className="tab btn wave Skrill" onClick={this.scrollBottom}><span>{}</span></span>
					<span className="tab btn wave Neteller active" onClick={this.scrollBottom}><span>{}</span></span>
					<span className="tab btn wave Ecopayz" onClick={this.scrollBottom}><span>{}</span></span>
				</div>
				<div className="tab_content">
					<div className="tab_item payment_tab">
						<form>
							<div className="container">
								<span className={'input_animate input--yoshiko'}>
									<input className="input__field input__field--yoshiko number" id="card_number" type="tel" maxLength="19"/>
									<label className="input__label input__label--yoshiko" htmlFor="card_number">
										<span className="input__label-content input__label-content--yoshiko"
										  data-content="Card Number">Card Number</span>
									</label>
									<span className="validation-summary-errors">{}</span>
								</span>
								<span className={'input--yoshiko static'}>
									<label htmlFor="card_date">Expiration Date (MM/YY)</label>
										<input className="input__field--yoshiko number exp_date" id="card_date" type="tel" maxLength="2"/> / <input className="input__field--yoshiko number exp_date"
															id="card_date" type="tel" maxLength="2"/>
										<span className="validation-summary-errors">{}</span>
								</span>
								<span className={'input_animate input--yoshiko static'}>
									<input className="input__field input__field--yoshiko number cvv" id="card_number" type="tel" maxLength="3"/>
									<label className="input__label input__label--yoshiko" htmlFor="card_number">
										<span className="input__label-content input__label-content--yoshiko" data-content="CVV">CVV</span>
									</label>
									<span className="validation-summary-errors">{}</span>

									{/*<label htmlFor="cvv">CVV</label>*/}
									{/*<input className="input__field--yoshiko number cvv" id="cvv" type="tel" maxLength="4"/>*/}
									{/*<span className="validation-summary-errors">{}</span>*/}
								</span>
								<input type="submit" className="wave btn" defaultValue={'Submit'}/>
							</div>
						</form>
					</div>
					<div className="tab_item payment_tab">
						<form>
							<div className="container">
								<span className={'input_animate input--yoshiko ' + (data.UserInfo.Email ? 'input--filled' : '')}>
									<input className="input__field input__field--yoshiko" id="skrill_id" type="text" defaultValue={data.UserInfo.Email}/>
									<label className="input__label input__label--yoshiko" htmlFor="skrill_id">
										<span className="input__label-content input__label-content--yoshiko" data-content="From Address">From Address</span>
									</label>
									<span className="validation-summary-errors">{}</span>
								</span>
								<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>
									<input className="input__field input__field--yoshiko total number" id="skrill_total" type="tel"
										   value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true}/>
									<label className="input__label input__label--yoshiko" htmlFor="skrill_total">
										<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>
									</label>
									<span className="label">$</span>
									<span className="validation-summary-errors">{}</span>
								</span>
								<input type="submit" className="wave btn" defaultValue={'Submit'} />
							</div>
							<input type="hidden" name="plan" value={plan}/>
						</form>
					</div>
					<div className="tab_item payment_tab active">
						{/*<form>*/}
							{/*<div className="container">*/}
								{/*<span className={'input_animate input--yoshiko ' + (data.UserInfo.Email ? 'input--filled' : '')}>*/}
									{/*<input className="input__field input__field--yoshiko" id="neteller_id" type="text" defaultValue={data.UserInfo.Email}/>*/}
									{/*<label className="input__label input__label--yoshiko" htmlFor="neteller_id">*/}
										{/*<span className="input__label-content input__label-content--yoshiko" data-content="Neteller ID or e-mail">Neteller ID or e-mail</span>*/}
									{/*</label>*/}
									{/*<span className="validation-summary-errors">{}</span>*/}
								{/*</span>*/}
									{/*<span className="input_animate input--yoshiko">*/}
									{/*<input className="input__field input__field--yoshiko" id="ntl_sec_id" type="password"/>*/}
									{/*<label className="input__label input__label--yoshiko" htmlFor="ntl_sec_id">*/}
										{/*<span className="input__label-content input__label-content--yoshiko" data-content="Secure ID or Authentication Code">Secure ID or Authentication Code</span>*/}
									{/*</label>*/}
									{/*<span className="validation-summary-errors">Secure ID must be 6 digits</span>*/}
								{/*</span>*/}
							{/*</div>*/}
							{/*<div className="container">*/}
									{/*<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>*/}
										{/*<input className="input__field input__field--yoshiko total number" id="neteller_total" type="tel"*/}
											   {/*value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true} />*/}
										{/*<label className="input__label input__label--yoshiko" htmlFor="neteller_total">*/}
											{/*<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>*/}
										{/*</label>*/}
										{/*<span className="label">$</span>*/}
										{/*<span className="validation-summary-errors">{}</span>*/}
									{/*</span>*/}
								{/*<input type="submit" defaultValue={'Submit'} />*/}
							{/*</div>*/}
							{/*<input type="hidden" name="plan" value={plan}/>*/}
						{/*</form>*/}
						<NetellerForm data={this.props.deposit} onSubmit={actions.actionOnAjaxSend.bind(null, this)} />
					</div>
					<div className="tab_item payment_tab">
						<EcoPayzForm data={this.props.deposit} onSubmit={actions.actionOnAjaxSend} />
					</div>
				</div>
			</div>
			<div className="payment_message pop_up" ref="paymentMessage">
				<div className="pop_up_container">
                    <div className="pop_up_content">
                        <span>Your account balance is refilled with <span className="amount">$100</span></span>
						<a href={ABpp.baseUrl + '/eng'} className="btn">Trade Now</a>
                        {/*<button className="btn">Ok</button>*/}
                    </div>
				</div>
			</div>
		</div>
	}
}

export default connect(state => ({
		deposit: state.deposit,
	}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	})
)(Deposit)

