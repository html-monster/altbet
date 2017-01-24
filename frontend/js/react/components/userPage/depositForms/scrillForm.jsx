/**
 * Created by Htmlbook on 13.01.2017.
 */

import FormValidation from '../../formValidation';

const ScrillForm = <form>
	<div className="container">
		<span className={'input_animate input--yoshiko ' + (data.UserInfo.Email ? 'input--filled' : '')}>
			<input className="input__field input__field--yoshiko" id="skrill_id" type="text" defaultValue={data.UserInfo.Email}/>
			<label className="input__label input__label--yoshiko" htmlFor="skrill_id">
				<span className="input__label-content input__label-content--yoshiko" data-content="From Address">From Address</span>
			</label>
			<span className="validation-summary-errors">{}</span>
		</span>
		<span className={'input_animate input--yoshiko ' + (depositQuantity || pricePlan ? 'input--filled' : '')}>
			<input className="input__field input__field--yoshiko total number" id="skrill_total" type="tel"
				   value={depositQuantity || pricePlan ? depositQuantity + pricePlan : ''} onChange={actions.actionOnInputQuantityChange} disabled={true}/>
			<label className="input__label input__label--yoshiko" htmlFor="skrill_total">
				<span className="input__label-content input__label-content--yoshiko" data-content="Deposit amount">Deposit amount</span>
			</label>
			<span className="label">$</span>
			<span className="validation-summary-errors">{}</span>
		</span>
		<input type="submit" defaultValue={'Submit'} />
	</div>
	<input type="hidden" name="plan" value={plan}/>
</form>;


