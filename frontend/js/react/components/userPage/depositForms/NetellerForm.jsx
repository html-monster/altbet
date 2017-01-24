/**
 * Created by Htmlbook on 10.01.2017.
 */
import React from 'react';

import FormValidation from '../../FormValidation';
import InputValidation from '../../formValidation/InputValidation';
import {mailValidation, netellerSecureId} from '../../formValidation/validation';

// import asyncValidate from './asyncValidate'

export default class NetellerForm extends React.Component{
	constructor()
	{
		super();
	}
	render()
	{
		const inputRender = ({ id, className, label, filled, inputLabel, type, meta: { error, dirty }, ...input }) => {
			return <span className={'1input_animate input--yoshiko ' + (filled ? 'input--filled' : '')}>
					<input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
					<label className="input__label input__label--yoshiko" htmlFor={id}>
						<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
					</label>
				{ inputLabel && <span className="label">$</span> }
				{ dirty && error && <span className="validation-summary-errors">{error}</span> }
				</span>
		};
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
		const formContent = ({ input, format, data:{ data, plan, depositQuantity, pricePlan }, handleSubmit }) => {
			return <form action={`${ABpp.baseUrl}/Payment/${format ? 'NetellerOut' : 'NetellerIn'}`} autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{/* костыль для отмены браузерного автозаполнение полей */}
					<input type="text" style={{display: 'none'}}/>
					<input type="password" style={{display: 'none'}}/>
					{/* =================================================== */}
					<InputValidation renderContent={inputRender} id={'neteller_id'} name="clientId"
									 className={'input__field input__field--yoshiko'}
									 initialValue={data.UserInfo.Email}
									 label={'Neteller ID or e-mail'} type={'text'} filled={data.UserInfo.Email}
									 validate={mailValidation} input={input}
									 maxLength="50"/>

					{
						!format &&
						<InputValidation renderContent={inputRender} id={'ntl_sec_id'} name="secureId"
										 className={'input__field input__field--yoshiko'}
										 label={'Secure ID or Authentication Code'} type={'password'}
										 validate={netellerSecureId} input={input}
										 maxLength="50"/>
					}
					{
						format &&
						<InputValidation renderContent={inputRender} id={'neteller_total'}
										 className={'input__field input__field--yoshiko total number'}
										 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
										 inputLabel={true} name="sum"
										 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
										 disabled={true} input={input}/>
					}
					{format && <input type="submit" defaultValue={'Submit'} />}
				</div>
				{
					!format &&
					<div className="container">
						<InputValidation renderContent={inputRender} id={'neteller_total'}
										 className={'input__field input__field--yoshiko total number'}
										 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
										 inputLabel={true} name="sum"
										 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
										 disabled={true} input={input}/>

						<input type="submit" defaultValue={'Submit'} />
					</div>
				}
				{!format && <InputValidation renderContent={inputHidden} type={'hidden'} name="plan" value={plan} input={input}/>}
			</form>
		};
		return <FormValidation
			data={this.props.data}
			format={this.props.format}
			renderContent={formContent}
			handleSubmit={this.props.onSubmit}
			serverValidation={true}
		/>;
	}
}

// const renderField = ({ input, id, className, filled, type, label, val, inputLabel, meta, ...rest }) => {
// 	// console.log(input);
// 	if(!meta.dirty && val) input.value = val;
// 	return <span className={'input_animate input--yoshiko animated' + (filled ? ' input--filled' : '') + (meta.touched && meta.error ? ' shake' : '')}>
// 		<input id={id} className={`${className} ${(!inputLabel && meta.touched && (meta.error ? ' invalidJs' : ' validJs'))}`} type={type}
// 			    {...input} {...rest}/>
// 		<label className="input__label input__label--yoshiko" htmlFor={id}>
// 			<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
// 		</label>
// 		{inputLabel && <span className="label">$</span>}
// 		{meta.touched && meta.error && <span className="validation-summary-errors">{meta.error}</span>}
// 	</span>
// };

// const NetellerForm = (props) => {
// 	const { handleSubmit, plan, data, pricePlan, depositQuantity, actions } = props;
// 	return (
// 		<form onSubmit={handleSubmit} autoComplete="off">
// 			<div className="container">
// 				{/* костыль для отмены браузерного автозаполнение полей */}
// 				<input type="text" style={{display: 'none'}}/>
// 				<input type="password" style={{display: 'none'}}/>
// 				{/* =================================================== */}
// 				<Field name="clientId" component={renderField} id="neteller_id" type="text" filled={data.UserInfo.Email}
// 					   label="Neteller ID or e-mail" val={data.UserInfo.Email} className="input__field input__field--yoshiko"  />
// 				<Field name="secureId" component={renderField} id="ntl_sec_id" type="password"
// 					   label="Secure ID or Authentication Code" className="input__field input__field--yoshiko" />
// 			</div>
// 			<div className="container">
// 				<Field name="sum" component={renderField} id="neteller_total" type="tel" filled={depositQuantity || pricePlan}
// 					   label="Deposit amount" inputLabel={true} val={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
// 					   onChange={actions.actionOnInputQuantityChange} className="input__field input__field--yoshiko total number" disabled={true} />
//
// 				<input type="submit" defaultValue={'Submit'} />
// 			</div>
// 			<input type="hidden" name="plan" value={plan}/>
// 		</form>
// 	)
// };

// export default reduxForm({
// 	form: 'netellerForm', // a unique identifier for this form
// 	enableReinitialize: false,
// 	validate,
// })(NetellerForm)

