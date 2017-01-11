/**
 * Created by Htmlbook on 10.01.2017.
 */
import React from 'react'
import { Field, reduxForm } from 'redux-form'

import validate from './validation'
// import asyncValidate from './asyncValidate'

const renderField = ({ input, id, filled, type, label, inputLabel, meta: { asyncValidating, touched, error }, ...rest }) => (
	<span className={'input_animate input--yoshiko' + (filled ? ' input--filled' : '')}>
		<input id={id} type={type} name={input.name} {...rest}/>
		<label className="input__label input__label--yoshiko" htmlFor={id}>
			<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
		</label>
		{inputLabel && <span className="label">$</span>}
		{touched && error && <span className="validation-summary-errors">{error}</span>}
	</span>
);

const NetellerForm = (props) => {
	const { handleSubmit, data, plan, pricePlan, depositQuantity, actions } = props;
	return (
		<form>
			<div className="container">
				<Field name="netellerId" component={renderField} id="neteller_id" type="text" filled={data.UserInfo.Email}
					   label="Neteller ID or e-mail" defaultValue={data.UserInfo.Email} className="input__field input__field--yoshiko" />
				<Field name="secureCode" component={renderField} id="ntl_sec_id" type="password"
					   label="Secure ID or Authentication Code" className="input__field input__field--yoshiko" />
			</div>
			<div className="container">
				<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>
					<input className="input__field input__field--yoshiko total number" id="neteller_total" type="tel"
						   value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true} />
					<label className="input__label input__label--yoshiko" htmlFor="neteller_total">
						<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>
					</label>
					<span className="label">$</span>
				</span>
				{/*<Field name="total" component={renderField} id="neteller_total" type="tel" filled={depositQuantity || pricePlan}*/}
					   {/*label="Deposit amount" inputLabel={true} value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}*/}
					   {/*onChange={actions.actionOnInputQuantityChange} className="input__field input__field--yoshiko total number" disabled={true} />*/}

				<input type="submit" defaultValue={'Submit'} />
			</div>
			<input type="hidden" name="plan" value={plan}/>
		</form>
		// <form onSubmit={handleSubmit}>
		// 	<Field name="username" type="text" component={renderField} label="Username"/>
		// 	<Field name="password" type="password" component={renderField} label="Password"/>
		// 	<div>
		// 		<button type="submit" disabled={submitting}>Sign Up</button>
		// 		<button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
		// 	</div>
		// </form>
	)
}

export default reduxForm({
	form: 'netellerForm', // a unique identifier for this form
	validate,
})(NetellerForm)

