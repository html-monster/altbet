/**
 * Created by Htmlbook on 10.01.2017.
 */
import React from 'react'
import { Field, reduxForm } from 'redux-form'

import validate from './validation'
// import asyncValidate from './asyncValidate'

const renderField = ({ input, id, className, filled, type, label, val, inputLabel, meta, ...rest }) => {
	// console.log(input);
	if(!meta.dirty && val) input.value = val;
	return <span className={'input_animate input--yoshiko animated' + (filled ? ' input--filled' : '') + (meta.touched && meta.error ? ' shake' : '')}>
		<input id={id} className={`${className} ${(!inputLabel && meta.touched && (meta.error ? ' invalidJs' : ' validJs'))}`} type={type}
			    {...input} {...rest}/>
		<label className="input__label input__label--yoshiko" htmlFor={id}>
			<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
		</label>
		{inputLabel && <span className="label">$</span>}
		{meta.touched && meta.error && <span className="validation-summary-errors">{meta.error}</span>}
	</span>
};

const NetellerForm = (props) => {
	const { handleSubmit, plan, data, pricePlan, depositQuantity, actions } = props;
	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<div className="container">
				{/* костыль для отмены браузерного автозаполнение полей */}
				<input type="text" style={{display: 'none'}}/>
				<input type="password" style={{display: 'none'}}/>
				{/* =================================================== */}
				<Field name="clientId" component={renderField} id="neteller_id" type="text" filled={data.UserInfo.Email}
					   label="Neteller ID or e-mail" val={data.UserInfo.Email} className="input__field input__field--yoshiko"  />
				<Field name="secureId" component={renderField} id="ntl_sec_id" type="password"
					   label="Secure ID or Authentication Code" className="input__field input__field--yoshiko" />
			</div>
			<div className="container">
				{/*<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>*/}
					{/*<input className="input__field input__field--yoshiko total number" id="neteller_total" type="tel" name="sum"*/}
						   {/*value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true} />*/}
					{/*<label className="input__label input__label--yoshiko" htmlFor="neteller_total">*/}
						{/*<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>*/}
					{/*</label>*/}
					{/*<span className="label">$</span>*/}
				{/*</span>*/}
				<Field name="sum" component={renderField} id="neteller_total" type="tel" filled={depositQuantity || pricePlan}
					   label="Deposit amount" inputLabel={true} val={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
					   onChange={actions.actionOnInputQuantityChange} className="input__field input__field--yoshiko total number" disabled={true} />

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
};

export default reduxForm({
	form: 'netellerForm', // a unique identifier for this form
	enableReinitialize: false,
	validate,
})(NetellerForm)

