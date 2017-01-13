/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

export default class EcoPayzForm extends React.Component{
	constructor()
	{
		super();
	}
	render()
	{
		const {data, plan, depositQuantity, pricePlan} = this.props.data;
		const formContent = <form>
			<div className="container">
			<span className={'input_animate input--yoshiko ' + (data.UserInfo.Email ? 'input--filled' : '')}>
				<input className="input__field input__field--yoshiko" id="neteller_id" type="text" defaultValue={data.UserInfo.Email}/>
				<label className="input__label input__label--yoshiko" htmlFor="neteller_id">
					<span className="input__label-content input__label-content--yoshiko" data-content="Neteller ID or e-mail">Neteller ID or e-mail</span>
				</label>
				<span className="validation-summary-errors">{}</span>
			</span>
				<span className="input_animate input--yoshiko">
				<input className="input__field input__field--yoshiko" id="ntl_sec_id" type="password"/>
				<label className="input__label input__label--yoshiko" htmlFor="ntl_sec_id">
					<span className="input__label-content input__label-content--yoshiko" data-content="Secure ID or Authentication Code">Secure ID or Authentication Code</span>
				</label>
				<span className="validation-summary-errors">Secure ID must be 6 digits</span>
			</span>
			</div>
			<div className="container">
			<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>
				<input className="input__field input__field--yoshiko total number" id="neteller_total" type="tel"
					   value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true} />
				<label className="input__label input__label--yoshiko" htmlFor="neteller_total">
					<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>
				</label>
				<span className="label">$</span>
				<span className="validation-summary-errors">{}</span>
			</span>
				<input type="submit" defaultValue={'Submit'} />
			</div>
			<input type="hidden" name="plan" value={plan}/>
		</form>;
	}
}

