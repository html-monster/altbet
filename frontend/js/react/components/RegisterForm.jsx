/**
 * Created by Vlasakh on 01.03.2017.
 */


import React from 'react';

import FormValidation from './FormValidation';
import InputValidation from './formValidation/InputValidation';
import {passwordValidation, regexValidation, lengthValidation, mailValidation, emptyValidation} from './formValidation/validation';

export class RegisterForm extends React.Component
{
	constructor(props)
	{
		super(props);
	}


    componentDidMount()
    {
        if( __DEV__ )
        {
            0||console.log( 'emulate here' )
            setTimeout(() =>
                {$(".log_out .sign_in").click();
                    setTimeout(() => $(".register").click(), 500)
                }, 700)
        } // endif
    }


    inputRender({ id, className, label, hint, inputLabel, type, meta: { error, dirty }, ...input })
    {
        return <span className="input_animate input--yoshiko">
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                <input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
                <label className="input__label input__label--yoshiko" htmlFor={id}>
                    <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                </label>
                {/*<span className="validation-summary-errors"></span>*/}
                {
                    hint && <span className="info top">
                        <i>{hint}</i>
                    </span>
                }
            </span>;
    }


    chkBoxRender({ id, meta: { error, dirty }, ...input })
    {
        return <div className="checkbox_container">
                <input type="checkbox" name={name} id={id} {...input}/><label htmlFor={id}>{this.props.children}</label>
            </div>;
    }


	render()
	{


/*
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
*/


		const formContent = ({ input, error, successMessage, format/*, data:{ data, plan, depositQuantity, pricePlan }*/, handleSubmit }) => {
            //return <form action={`${ABpp.baseUrl}/Account/Register'`} method="post" onSubmit={handleSubmit}>
            return <form action="http://localhost/AltBet.Admin/Category/TestAction" ref="F1regForm" method="post" onSubmit={handleSubmit}>
			{/*;<form action={`${ABpp.baseUrl}/Payment/${format ? 'SkrillOut' : 'SkrillIn'}`}  autoComplete="off" onSubmit={handleSubmit}>
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
*/}
                                    <div className="left_column column">
                                        {/*<!--<h2>Your details</h2>-->*/}
                                        <InputValidation renderContent={this.inputRender} id='f_name' name="FirstName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="Fedor"
                                                         label="First Name" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), lengthValidation.bind(null, {min: 2, max: 50})]} input={input}
                                                         hint="Your first name as specified in your passport"/>

                                        <InputValidation renderContent={this.inputRender} id='l_name' name="LastName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="Boyarin"
                                                         label="Second Name" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), lengthValidation.bind(null, {min: 2})]} input={input}
                                                         hint="Your second name as specified in your passport"/>

                                        <InputValidation renderContent={this.inputRender} id='n_name' name="NickName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="FedoryakaBest"
                                                         label="User Name" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z\.\-_]+$/, message: "Allowed: symbols, digits, .-_"}), lengthValidation.bind(null, {min: 3, max: 20})]} input={input}
                                                         hint="User's login allow to use symbols such as: symbols, digits, dot, underscore, dash"/>

                                        <InputValidation renderContent={this.inputRender} id='user_b_day' name="DateOfBirth"
                                                         className={'input__field input__field--yoshiko datePickerJs'}
                                                         initialValue="2 Mar 01"
                                                         label="Date of birth" type='text'
                                                         validate={[emptyValidation]} input={input}/>

                                        <InputValidation renderContent={this.inputRender} id='c_name' name="Country"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="Ukraine"
                                                         label="Country" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), lengthValidation.bind(null, {min: 3, max: 50})]} input={input}
                                                         hint="Indicate the country of your permanent residence"/>

                                        <InputValidation renderContent={this.inputRender} id='s_name' name="Address"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="Kiev, Frunse, 11"
                                                         label="Address" type='text'
                                                         validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 200})]} input={input}
                                                         hint="Enter address manually"/>

                                        <InputValidation renderContent={this.inputRender} id='t_number' name="Phone"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="0503272223333"
                                                         label="Phone" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[0-9]+$/, message: "Only digits are allowed"}),  lengthValidation.bind(null, {min: 4, max: 30})]} input={input}/>
                                    </div>

                                    <div className="right_column column">
                                        <InputValidation renderContent={this.inputRender} id='e_name' name="Email"
                                                         className={'input__field input__field--yoshiko'}
                                                         label="Email Address" type='text'
                                                         initialValue="zz@xx.com"
                                                         validate={[emptyValidation, mailValidation, lengthValidation.bind(null, {max: 128})]} input={input}
                                                         hint="Specify your valid email. A message with registration
                                                            confirmation will be sent at that address. Also that address
                                                            will be used for communication with you"/>

                                        <InputValidation renderContent={this.inputRender} id='r_pass' name="Password"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="123"
                                                         label="Password" type='password'
                                                         validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 20})]} input={input}/>

                                        <InputValidation renderContent={this.inputRender} id='r_confirm_pass' name="Password"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue="123"
                                                         label="Confirm Password" type='password'
                                                         validate={[emptyValidation, passwordValidation.bind(null, "r_pass")]} input={input}/>

{/*
    <input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Email can not exceed 128 characters" data-val-length-max="128" data-val-regex="Incorrect Email address" data-val-regex-pattern="^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$" data-val-required="Email is required" id="e_name" maxlength="128" name="Email" type="email" value="">
    <input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3 characters" data-val-length-max="20" data-val-length-min="3" data-val-required="Password is required" id="r_pass" maxlength="20" name="Password" type="password">
    <input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-equalto="Password do not match" data-val-equalto-other="*.Password" data-val-required="Confirm Password  is required" id="r_confirm_pass" maxlength="20" name="ComparePassword" type="password">
*/}
                                    </div>
                                    <hr/>
                                    <div className="agreement">
                                        <InputValidation renderContent={this.chkBoxRender} id='agreement' name="agreement" validate={[]} input={input}>
                                            Agree to the <a href="/conditions.html" className="text_decoration">Terms of Use</a> and <a href="#" className="text_decoration">Privacy Notice</a>
                                        </InputValidation>
                                        <InputValidation renderContent={this.chkBoxRender} id='agreement' name="agreement" validate={[]} input={input}>
                                            I confirm that I am at least 18 years of age.
                                        </InputValidation>

                                        {/*<div className="checkbox_container">
                                            <input type="checkbox" id="agreement"/><label htmlFor="agreement">Agree to the <a href="/conditions.html" className="text_decoration">Terms of Use</a> and <a href="#" className="text_decoration">Privacy Notice</a></label>
                                        </div>
                                        <div className="checkbox_container">
                                            <input type="checkbox" id="agreement_age"/><label htmlFor="agreement_age">I confirm that I am at least 18 years of age.</label>
                                        </div>*/}
                                    </div>
                                    <div className="submit">
                                        <input type="submit" value="Register" id="submit_sign_up" className="btn"/>
                                    </div>
                                </form>
		};


		return <FormValidation
			renderContent={formContent}
			/*data={this.props.data}
			format={this.props.format}*/
			handleSubmit={this.props.onSubmit}
			serverValidation={true}
		/>;
	}
}