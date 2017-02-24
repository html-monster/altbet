/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

import FormValidation from '../../../FormValidation';
import InputValidation from '../../../formValidation/InputValidation';
import {minLengthValidation, mailValidation, netellerSecureId} from '../../../formValidation/validation';

export default class ScrillForm extends React.Component{
	constructor()
	{
		super();
	}
	render()
	{
		const inputRender = ({ id, className, label, filled, inputLabel, type, meta: { error, dirty }, ...input }) => {
			return <span className={'input_animate input--yoshiko ' + ((inputLabel == 'password') ? 'pass_container ' : '') + (filled ? 'input--filled' : '')}>
					<input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
				{ inputLabel == 'password' && <span className="show_password">{}</span> }
				<label className="input__label input__label--yoshiko" htmlFor={id}>
						<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
					</label>
				{ inputLabel == 'total' && <span className="label">$</span> }
				{ dirty && error && <span className="validation-summary-errors">{error}</span> }
				</span>
		};
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
		const formContent = ({ input, error, successMessage, format, data:{ data, plan, depositQuantity, pricePlan }, handleSubmit }) => {
			return <form action={`${ABpp.baseUrl}/Payment/${format ? 'SkrillOut' : 'SkrillIn'}`}  autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{
						format ?
							<InputValidation renderContent={inputRender} id={'skrill_id'} name="email"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'From Address'} type={'text'} filled={data.UserInfo.Email}
											 validate={mailValidation} input={input}
											 maxLength="50"/>
							:
							<InputValidation renderContent={inputRender} id={'skrill_id'} name="clientId"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'From Address'} type={'text'} filled={data.UserInfo.Email}
											 validate={mailValidation} input={input}
											 maxLength="50"/>
					}

					<InputValidation renderContent={inputRender} id={'neteller_total'}
									 className={'input__field input__field--yoshiko total number'}
									 label={'Withdrawal amount'} type={'tel'} filled={depositQuantity}
									 inputLabel={'total'} name="sum"
									 value={depositQuantity || ''}
									 disabled={true} input={input}/>

					<input type="submit" className="wave btn" defaultValue={'Submit'} />
					<span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
					<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
				</div>
				{format && <InputValidation renderContent={inputHidden} type={'hidden'} name="plan" value={plan} input={input}/>}
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

