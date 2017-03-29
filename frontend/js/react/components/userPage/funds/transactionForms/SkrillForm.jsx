/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

import FormValidation from '../../../FormValidation';
import InputValidation from '../../../formValidation/InputValidation';
import {minLengthValidation, mailValidation} from '../../../formValidation/validation';

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
		const formContent = ({ input, error, successMessage, withdraw, data:{ data, plan, depositQuantity, pricePlan }, handleSubmit }) => {
			return <form action={`${ABpp.baseUrl}/Payment/${withdraw ? 'SkrillOut' : 'SkrillIn'}`}  autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{
						withdraw ?
							<InputValidation renderContent={inputRender} id={'skrill_id'} name="Email"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'E-mail'} type={'text'} filled={data.UserInfo.Email}
											 validate={mailValidation} input={input}
											 maxLength="50"/>
							:
							<InputValidation renderContent={inputRender} id={'skrill_id'} name="ClientId"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'E-mail'} type={'text'} filled={data.UserInfo.Email}
											 validate={mailValidation} input={input}
											 maxLength="50"/>
					}
					{
						withdraw ?
							<InputValidation renderContent={inputRender} id={'skrill_total'}
											 className={'input__field input__field--yoshiko total number'}
											 label={'Withdrawal amount'} type={'tel'} filled={depositQuantity}
											 inputLabel={'total'} name="Sum"
											 value={depositQuantity || ''}
											 disabled={true} input={input}/>
							:
							<InputValidation renderContent={inputRender} id={'skrill_total'}
											 className={'input__field input__field--yoshiko total number'}
											 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
											 inputLabel={'total'} name="Sum"
											 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
											 disabled={true} input={input}/>
					}

					<input type="submit" className="wave btn" defaultValue={'Submit'} />
					<span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
					<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
				</div>
				{!withdraw && <InputValidation renderContent={inputHidden} type={'hidden'} name="Plan" value={plan} input={input}/>}
			</form>
		};
		return <FormValidation
			data={this.props.data}
			withdraw={this.props.withdraw}
			renderContent={formContent}
			handleSubmit={this.props.onSubmit}
			serverValidation={true}
		/>;
	}
}

