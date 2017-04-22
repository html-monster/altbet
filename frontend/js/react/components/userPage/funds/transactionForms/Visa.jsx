/**
 * Created by Htmlbook on 08.03.2017.
 */

import React from 'react';

import FormValidation from '../../../FormValidation';
import InputValidation from '../../../formValidation/InputValidation';

export default class Visa extends React.Component{
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
		const formContent = ({ input, error, successMessage, withdraw, data:{ data, plan, depositQuantity, pricePlan }, handleSubmit }) => {
			return <form action={`${ABpp.baseUrl}/Payment/${withdraw ? 'OtherPaymentsOut' : 'OtherPaymentsIn'}`} autoComplete="off" onSubmit={handleSubmit}>
				<div className="container">
					{
						withdraw ?
							<InputValidation renderContent={inputRender} id={'visa_total'}
											 className={'input__field input__field--yoshiko total number'}
											 label={'Withdrawal amount'} type={'tel'} filled={depositQuantity}
											 inputLabel={'total'} name="Sum"
											 value={depositQuantity || ''}
											 disabled={true} input={input}/>
							:
							<InputValidation renderContent={inputRender} id={'visa_total'}
											 className={'input__field input__field--yoshiko total number'}
											 label={'Deposit amount'} type={'tel'} filled={depositQuantity || pricePlan}
											 inputLabel={'total'} name="Sum"
											 value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''}
											 disabled={true} input={input}/>
					}

					<input type="submit" className="wave btn submit" defaultValue={'Submit'} />
					<span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
					<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
				</div>
				<InputValidation renderContent={inputHidden} type={'hidden'} name="PaymentType" value={'VSA'} input={input}/>
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

// export default FormValidation({
// 	formId: "EcoPayzForm",
// 	renderContent: formContent,
// 	// handleSubmit: this.props.onSubmit
// });

