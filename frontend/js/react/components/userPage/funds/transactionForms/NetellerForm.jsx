/**
 * Created by Htmlbook on 10.01.2017.
 */
import React from 'react';

import FormValidation from '../../../FormValidation';
import InputValidation from '../../../formValidation/InputValidation';
import {minLengthValidation, mailValidation, netellerSecureId} from '../../../formValidation/validation';

export default class NetellerForm extends React.Component
{
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
			return <form action={`${ABpp.baseUrl}/Payment/${withdraw ? 'NetellerOut' : 'NetellerIn'}`}  autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{/* костыль для отмены браузерного автозаполнение полей */}
					<input type="text" style={{display: 'none'}}/>
					<input type="password" style={{display: 'none'}}/>
					{/* =================================================== */}
					{
						withdraw ?
							<InputValidation renderContent={inputRender} id={'neteller_id'} name="Email"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'E-mail'} type={'text'} filled={data.UserInfo.Email}
											 validate={mailValidation} input={input}
											 maxLength="50"/>
						:
							<InputValidation renderContent={inputRender} id={'neteller_id'} name="ClientId"
											 className={'input__field input__field--yoshiko'}
											 initialValue={data.UserInfo.Email}
											 label={'Neteller ID or e-mail'} type={'text'} filled={data.UserInfo.Email}
											 validate={minLengthValidation} input={input}
											 maxLength="50"/>
					}


					{
						!withdraw &&
						<InputValidation renderContent={inputRender} id={'ntl_sec_id'} name="SecureId"
										 className={'input__field input__field--yoshiko'}
										 label={'Secure ID or Authentication Code'} type={'password'}
										 inputLabel={'password'}
										 validate={netellerSecureId} input={input}
										 maxLength="50"/>
					}
					{
						withdraw &&
						<InputValidation renderContent={inputRender} id={'neteller_total'}
										 className={'input__field input__field--yoshiko total number'}
										 label={'Withdrawal amount'} type={'tel'} filled={depositQuantity}
										 inputLabel={'total'} name="Sum"
										 value={depositQuantity || ''}
										 disabled={true} input={input}/>
					}
					{withdraw && <input type="submit" className="wave btn" defaultValue={'Submit'} />}
					{withdraw && <span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>}
					{withdraw && <span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>}
				</div>
				{
					!withdraw &&
					<div className="container">
						<InputValidation renderContent={inputRender} id={'neteller_total'}
										 className={'input__field input__field--yoshiko total number'}
										 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
										 inputLabel={'total'} name="Sum"
										 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
										 disabled={true} input={input}/>

						<input type="submit" className="wave btn" defaultValue={'Submit'}  />
						<span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
						<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
					</div>
				}
				{!withdraw && <InputValidation renderContent={inputHidden} type={'hidden'} name="Plan" value={plan} input={input}/>}
				{/*<div className="payment_message approve pop_up" ref="paymentMessage">
					<div className="pop_up_container">
						<div className="pop_up_content">
							<span>Are you sure?</span>
							<button className="btn">Yes</button>
							<span className="btn no hide">No</span>
						</div>
					</div>
				</div>*/}
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
