/**
 * Created by Vlasakh on 01.03.2017.
 */


import React from 'react';

import FormValidation from './FormValidation';
import InputValidation from './formValidation/InputValidation';
import {regexValidation, minLengthValidation, maxLengthValidation, mailValidation, emptyValidation} from './formValidation/validation';

export class RegisterForm extends React.Component
{
	constructor(props)
	{
		super(props);
	}



	render()
	{
		const inputRender = ({ id, className, label, hint, inputLabel, type, meta: { error, dirty }, ...input }) => {
			return <span className="input_animate input--yoshiko">
                    { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                    <input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
                    <label className="input__label input__label--yoshiko" htmlFor={id}>
                        <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                    </label>
                    {/*<span className="validation-summary-errors"></span>*/}
                    <span className="info top">
                        <i>{hint}</i>
                    </span>
                </span>
		};


/*
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
*/


		const formContent = ({ input, error, successMessage, format/*, data:{ data, plan, depositQuantity, pricePlan }*/, handleSubmit }) => {
            return <form action={`${ABpp.baseUrl}/Account/Register'`} method="post" onSubmit={handleSubmit}>
			{/*<form action={`${ABpp.baseUrl}/Payment/${format ? 'SkrillOut' : 'SkrillIn'}`}  autoComplete="off" onSubmit={handleSubmit}>
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
                                        <InputValidation renderContent={inputRender} id='f_name' name="FirstName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue=""
                                                         label="First Name" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), minLengthValidation.bind(null, {size: 2}), maxLengthValidation.bind(null, {size: 50})]} input={input}
                                                         hint="Your first name as specified in your passport"
                                                         maxLength="50"/>

                                        <InputValidation renderContent={inputRender} id='l_name' name="LastName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue=""
                                                         label="Second Name" type='text'
                                                         validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), minLengthValidation.bind(null, {size: 2}), maxLengthValidation.bind(null, {size: 50})]} input={input}
                                                         hint="Your second name as specified in your passport"
                                                         maxLength="50"/>

                                        <InputValidation renderContent={inputRender} id='n_name' name="NickName"
                                                         className={'input__field input__field--yoshiko'}
                                                         initialValue=""
                                                         label="User Name" type='text'
                                                         validate={[emptyValidation, minLengthValidation.bind(null, {size: 3}), maxLengthValidation.bind(null, {size: 15})]} input={input}
                                                         hint="Your second name as specified in your passport"
                                                         maxLength="50"/>

{/*
                                            <input autocomplete="off" className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 2-50 characters" data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please" data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="First Name is required" id="f_name" maxlength="50" name="FirstName" type="text" value=""/>
                                            <input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 2-50 characters" data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please" data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="Last Name is required" id="l_name" maxlength="50" name="LastName" type="text" value=""/>

                                        <span className="input_animate input--yoshiko">
                                            <span class="field-validation-valid validation-summary-errors" data-valmsg-for="NickName" data-valmsg-replace="true"></span>
                                            <input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3-15 characters" data-val-length-max="15" data-val-length-min="3" data-val-required="User Name is required" id="n_name" maxlength="15" name="NickName" type="text" value=""/>
                                            <label className="input__label input__label--yoshiko" for="n_name">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="User Name">User Name</span>
                                            </label>
                                            /!*@*<span className="validation-summary-errors">User name must be at least 4 characters </span>*@*!/
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            /!*@Html.ValidationMessageFor(m => m.DateOfBirth, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.TextBoxFor(m => m.DateOfBirth, new {@class = "input__field input__field--yoshiko datePickerJs", id = "user_b_day"})*!/
                                            <label className="input__label input__label--yoshiko" for="user_b_day">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Date of birth">Date of birth</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            /!*@Html.ValidationMessageFor(m => m.Country, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.TextBoxFor(model => model.Country, new { @class = "input__field input__field--yoshiko", id = "c_name", autocomplete = "off", maxlength = "128" })*!/
                                            <label className="input__label input__label--yoshiko" for="c_name">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Country">Country</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                            <span className="info top">
                                                <i>Indicate the country of your permanent residence</i>
                                            </span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            /!*@Html.ValidationMessageFor(m => m.Address, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.TextBoxFor(model => model.Address, new { @class = "input__field input__field--yoshiko", id = "s_name", autocomplete = "off", maxlength = "200" })*!/
                                            <label className="input__label input__label--yoshiko" for="s_name">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Address">Address</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                            <span className="info top">
                                                <i>Enter address manually</i>
                                            </span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            /!*@Html.ValidationMessageFor(m => m.Phone, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.TextBoxFor(model => model.Phone, new { @class = "input__field input__field--yoshiko", id = "t_number", autocomplete = "off", maxlength = "30" })*!/
                                            <label className="input__label input__label--yoshiko" for="t_number">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Phone">Phone</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                        </span>*/}
                                    </div>

{/*
                                    <div className="right_column column">
                                        <span className="input_animate input--yoshiko">
                                            /!*@Html.ValidationMessageFor(model => model.Email, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.TextBoxFor(model => model.Email, new { @class = "input__field input__field--yoshiko", type = "email", id = "e_name", autocomplete = "off", maxlength = "128" })*!/
                                            <label className="input__label input__label--yoshiko" for="e_name">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Email Address">Email Address</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                            <span className="info bottom">
                                                <i>
                                                    Specify your valid email. A message with registration
                                                    confirmation will be sent at that address.Also that address
                                                    will be used for communication with you
                                                </i>
                                            </span>
                                        </span>

                                        <span className="input_animate input--yoshiko pass_container">
                                            /!*@Html.ValidationMessageFor(model => model.Password, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.PasswordFor(model => model.Password, new { @class = "input__field input__field--yoshiko", type = "password", id = "r_pass", autocomplete = "off", maxlength = "20" })*!/
                                            <span className="show_password"></span>
                                            <label className="input__label input__label--yoshiko" for="r_pass">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Password">Password</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                        </span>

                                        <span className="input_animate input--yoshiko pass_container">
                                            /!*@Html.ValidationMessageFor(model => model.ComparePassword, null, new { @class = "validation-summary-errors" })*!/
                                            /!*@Html.PasswordFor(model => model.ComparePassword, new { @class = "input__field input__field--yoshiko", type = "password", id = "r_confirm_pass", autocomplete = "off", maxlength = "20" })*!/
                                            <span className="show_password"></span>
                                            <label className="input__label input__label--yoshiko" for="r_confirm_pass">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Confirm Password">Confirm Password</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            <input className="input__field input__field--yoshiko" type="text" id="question"disabled autocomplete="off"/>
                                            <label className="input__label input__label--yoshiko" for="question">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Security question">Security question</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                            <span className="info top">
                                                <i>
                                                    In case you will forget the password, you can restore it, havin
                                                    specified a correct answer on the security question.
                                                    Please select a guastion that you will know the answer.
                                                </i>
                                            </span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            <input className="input__field input__field--yoshiko" type="text" id="answer"disabled autocomplete="off"/>
                                            <label className="input__label input__label--yoshiko" for="answer">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Security answer">Security answer</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                            <span className="info top">
                                                <i>It will be needed if you forget your password</i>
                                            </span>
                                        </span>

                                        <span className="input_animate input--yoshiko">
                                            <input className="input__field input__field--yoshiko" type="text" id="promo"disabled autocomplete="off"/>
                                            <label className="input__label input__label--yoshiko" for="promo">
                                                <span className="input__label-content input__label-content--yoshiko" data-content="Promo code(if applicable)">Promo code(if applicable)</span>
                                            </label>
                                            <span className="validation-summary-errors"></span>
                                        </span>
                                    </div>
*/}
{/*                                    <hr/>
                                    <div className="agreement">
                                        <div className="checkbox_container">
                                            <input type="checkbox" id="agreement"/><label for="agreement">Agree to the <a href="/conditions.html" className="text_decoration" >Terms of Use</a> and <a href="#" className="text_decoration">Privacy Notice</a></label>
                                        </div>
                                        <div className="checkbox_container">
                                            <input type="checkbox" id="agreement_age"/><label for="agreement_age">I confirm that I am at least 18 years of age.</label>
                                        </div>
                                    </div>*/}
                                    <div className="submit">
                                        <input type="submit" value="Register" id="submit_sign_up" className="btn"/>
                                    </div>
                                </form>
		};


		return <FormValidation
			renderContent={formContent}
			/*data={this.props.data}
			format={this.props.format}
			handleSubmit={this.props.onSubmit}
			serverValidation={true}*/
		/>;
	}
}