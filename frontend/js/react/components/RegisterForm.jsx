/**
 * Created by Vlasakh on 01.03.2017.
 */


import React from 'react';


import FormValidation from './FormValidation';
import InputValidation from './formValidation/InputValidation';
import {passwordValidation, regexValidation, lengthValidation, mailValidation, emptyValidation, phoneValidation} from './formValidation/validation';
import {DropBox} from './common/DropBox';


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
        const child = input.children;
        delete input.children;

        return <div className="checkbox_container">
                <input type="checkbox" name={name} id={id} {...input} defaultChecked={false}/><label htmlFor={id}>{child}</label>
            </div>;
    }

    dropBoxRender({ id, label, meta: { error, dirty }, ...input })
    {
        return <span className="input_animate input--yoshiko">
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                <DropBox className="" name={name} items={['var 1', 'var 2', 'var 3', 'var 4', ]} />
                <label className="input__label input__label--yoshiko" htmlFor={id}>
                    <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                </label>
            </span>
    }


/*
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
*/

	render()
	{
		const formContent = ({ input, error, successMessage, format/*, data:{ data, plan, depositQuantity, pricePlan }*/, handleSubmit }) => {
            //return <form action={`${ABpp.baseUrl}/Account/Register'`} method="post" onSubmit={handleSubmit}>
            return <form action="http://localhost/AltBet.Admin/Category/TestAction" ref="F1regForm" method="post" onSubmit={handleSubmit}>
                <div className="left_column column">
{/*                    <InputValidation renderContent={this.inputRender} id='f_name' name="FirstName"
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
                                     hint="Your second name as specified in your passport"/>*/}

                    <InputValidation renderContent={this.inputRender} id='n_name' name="NickName"
                                     className={'input__field input__field--yoshiko'}
                                     initialValue="FedoryakaBest"
                                     label="User Name" type='text'
                                     validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z\.\-_]+$/, message: "Allowed: symbols, digits, .-_"}), lengthValidation.bind(null, {min: 3, max: 20})]} input={input}
                                     hint="User's login allow to use symbols such as: symbols, digits, dot, underscore, dash"/>

                    <InputValidation renderContent={this.inputRender} id='e_name' name="Email"
                                     className={'input__field input__field--yoshiko'}
                                     label="Email Address" type='text'
                                     initialValue="zz@xx.com"
                                     validate={[emptyValidation, mailValidation, lengthValidation.bind(null, {max: 128})]} input={input}
                                     hint="Specify your valid email. A message with registration
                                        confirmation will be sent at that address. Also that address
                                        will be used for communication with you"/>

                    <InputValidation renderContent={this.inputRender} id='user_b_day' name="DateOfBirth"
                                     className={'input__field input__field--yoshiko datePickerJs'}
                                     initialValue="2 Mar 01"
                                     label="Date of birth" type='text'
                                     validate={[emptyValidation]} input={input}/>


                    <InputValidation renderContent={this.inputRender} id='r_pass' name="Password"
                                     className={'input__field input__field--yoshiko'}
                                     initialValue="123"
                                     label="Password" type='password'
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 20})]} input={input}/>

                    <InputValidation renderContent={this.inputRender} id='r_confirm_pass' name="Password"
                                     className={'input__field input__field--yoshiko'}
                                     //initialValue="123"
                                     label="Confirm Password" type='password'
                                     validate={[emptyValidation, passwordValidation.bind(null, "r_pass")]} input={input}/>
                </div>

                <div className="right_column column">
                    <InputValidation renderContent={this.dropBoxRender} id='c_name' name="Country"
                                     className={'input__field input__field--yoshiko'}
                                     label="Country" type='text'
                                     validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z]+$/, message: "Only letters are allowed"}), lengthValidation.bind(null, {min: 3, max: 50})]} input={input}
                                     hint="Indicate the country of your permanent residence"/>

                    {/*<ul className="select_list odds_list" ref="oddsList" onClick={this.listSlide.bind(this, false)}>*/}

{/*
<input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Email can not exceed 128 characters" data-val-length-max="128" data-val-regex="Incorrect Email address" data-val-regex-pattern="^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$" data-val-required="Email is required" id="e_name" maxlength="128" name="Email" type="email" value="">
<input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3 characters" data-val-length-max="20" data-val-length-min="3" data-val-required="Password is required" id="r_pass" maxlength="20" name="Password" type="password">
<input autocomplete="off" class="input__field input__field--yoshiko" data-val="true" data-val-equalto="Password do not match" data-val-equalto-other="*.Password" data-val-required="Confirm Password  is required" id="r_confirm_pass" maxlength="20" name="ComparePassword" type="password">
*/}
                </div>
                <hr/>
                <div className={'answer-message' + (error && ' validation-summary-errors')}>{error}</div>
                <div className="agreement">
                    <InputValidation renderContent={this.chkBoxRender} id='agreement' name="agreement" validate={[]} input={input}>
                        <span>Agree to the <a href="/conditions.html" className="text_decoration">Terms of Use</a> and <a href="#" className="text_decoration">Privacy Notice</a></span>
                    </InputValidation>

                    <InputValidation renderContent={this.chkBoxRender} id='agreement_age' name="agreement_age" validate={[]} input={input}>
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
