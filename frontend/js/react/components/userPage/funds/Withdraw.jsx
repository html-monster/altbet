/**
 * Created by Htmlbook on 18.01.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import NetellerForm from './transactionForms/NetellerForm';
import EcoPayzForm from './transactionForms/EcoPayzForm';
import * as actions from '../../../actions/userPage/withdrawActions';

class Withdraw extends React.Component{
	constructor()
	{
		super();
	}

	componentDidMount()
	{
		this.props.actions.actionOnSocketMessage();
	}

	scrollBottom()
	{
		$('html, body').animate({scrollTop: $(document).outerHeight(true)}, 800);
	}

	// lalal()
	// {
	// 	popUpClass.nativePopUpOpen('.wrapper_user_page .payment_message.approve')
	// }

	render()
	{
		const { approved, data, depositQuantity, sumValidation } = this.props.withdraw;
		const actions = this.props.actions;

		return <div className="tab_item funds">
			<h3>Withdraw funds</h3>
			<span className="account_balance">You currently have <span className="value">${Math.round10(data.UserAssets.CurrentBalance, -2)}</span> in your account</span>
			<div className="quantity_control">
				<strong>Select withdrawal amount</strong>
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
								<span className={'input_animate input--yoshiko ' + (depositQuantity ? 'input--filled' : '')}>
									<input className="input__field input__field--yoshiko total number" id="skrill_total" type="tel"
										   value={depositQuantity ? depositQuantity : ''} onChange={actions.actionOnInputQuantityChange} disabled={true}/>
									<label className="input__label input__label--yoshiko" htmlFor="skrill_total">
										<span className="input__label-content input__label-content--yoshiko" data-content="Withdrawal amount">Withdrawal amount</span>
									</label>
									<span className="label">$</span>
									<span className="validation-summary-errors">{}</span>
								</span>
								<input type="submit" className="wave btn" defaultValue={'Submit'} />
							</div>
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
						<NetellerForm data={this.props.withdraw} format={'withdraw'} onSubmit={actions.actionOnAjaxSend.bind(null, this)} />
						{/*<button className="btn wave approve" onClick={this.lalal}>{'Submit'}</button>*/}
					</div>
					<div className="tab_item payment_tab">
						<EcoPayzForm data={this.props.withdraw} format={'withdraw'} onSubmit={actions.actionOnAjaxSend.bind(null, this)} />
					</div>
				</div>
			</div>
			<div className="payment_message withdraw message pop_up" ref="paymentMessage">
				<div className="pop_up_container">
					{
						approved ?
							<div className="pop_up_content">
								<span><span className="amount">{}</span> are withdrawn from your account</span>
								{/*<a href={ABpp.baseUrl + '/eng'} className="btn">Trade Now</a>*/}
								<button className="btn hide" onClick={popUpClass.nativePopUpClose.bind(null, '.wrapper_user_page .withdraw.message')}>Ok</button>
							</div>
						:
							<div className="pop_up_content">
								<span>Please, confirm your action</span>
								<div className="btn_container">
									<button className="btn wave hide submit">Yes</button>
									<button className="btn wave hide no">No</button>
								</div>
							</div>
					}
				</div>
			</div>
		</div>
	}
}

export default connect(state => ({
		withdraw: state.withdraw,
	}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	})
)(Withdraw)

