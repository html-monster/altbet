/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

import FormValidation from '../../FormValidation';
import InputValidation from '../../formValidation/InputValidation';
import {mailValidation} from '../../formValidation/validation';

export default class EcoPayzForm extends React.Component{
	constructor()
	{
		super();
	}
	render()
	{
		// const {data, plan, depositQuantity, pricePlan} = this.props.data;
		// const actions = this.props.actions;
		const inputRender = ({ id, className, label, filled, inputLabel, type, meta: { error, dirty }, ...input }) => {
			// console.log(input);
			return <span className={'1input_animate input--yoshiko ' + (filled ? 'input--filled' : '')}>
					<input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
					<label className="input__label input__label--yoshiko" htmlFor={id}>
						<span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
					</label>
					{ inputLabel && <span className="label">$</span> }
					{ dirty && error && <span className="validation-summary-errors">{error}</span> }
				</span>
		};
		const formContent = ({ data:{ data, plan, depositQuantity, pricePlan }, handleSubmit}) => {
			// console.log(depositQuantity || pricePlan ? depositQuantity + pricePlan : '');
			return <form autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{/* костыль для отмены браузерного автозаполнение полей */}
					{/*<input type="text" style={{display: 'none'}}/>*/}
					{/*<input type="password" style={{display: 'none'}}/>*/}
					{/* =================================================== */}
									 {/*initialValue={data.UserInfo.Email}*/}
					<InputValidation renderContent={inputRender} id={'skrill_id'} name="clientId"
									 className={'input__field input__field--yoshiko'}
									 label={'From Address'} type={'text'} filled={data.UserInfo.Email}
									 validate={mailValidation}/>


					<InputValidation renderContent={inputRender} id={'skrill_total'}
									 className={'input__field input__field--yoshiko total number'}
									 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
									 inputLabel={true} name="sum"
									 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
									 disabled={true}/>

					<input type="submit" defaultValue={'Submit'}/>
				</div>
				<input type="hidden" name="plan" value={plan}/>
			</form>
		};
		return <FormValidation
			formId="EcoPayzForm"
			data={this.props.data}
			renderContent={formContent}
			handleSubmit={this.props.onSubmit}
		/>;
	}
}

