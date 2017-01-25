/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

import FormValidation from '../../../FormValidation';
import InputValidation from '../../../formValidation/InputValidation';
import {mailValidation} from '../../../formValidation/validation';

export default class EcoPayzForm extends React.Component{
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
		const formContent = ({ input, error, successMessage, format, data:{ data, plan, depositQuantity, pricePlan }, handleSubmit }) => {
			return <form autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					<InputValidation renderContent={inputRender} id={'skrill_id'} name="clientId"
									 className={'input__field input__field--yoshiko'}
									 initialValue={data.UserInfo.Email}
									 label={'From Address'} type={'text'} filled={data.UserInfo.Email}
									 validate={mailValidation} input={input}
									 maxLength="50"/>


					<InputValidation renderContent={inputRender} id={'skrill_total'}
									 className={'input__field input__field--yoshiko total number'}
									 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
									 inputLabel={true} name="sum"
									 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
									 disabled={true} input={input}/>

					<input type="submit" className="wave btn" defaultValue={'Submit'} disabled={input.sending}/>
					<span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
					<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
				</div>
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

// export default FormValidation({
// 	formId: "EcoPayzForm",
// 	renderContent: formContent,
// 	// handleSubmit: this.props.onSubmit
// });
