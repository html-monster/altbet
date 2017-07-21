/**
 * Created by Vlasakh on 01.03.2017.
 */


import React from 'react';


import FormValidation from './FormValidation';
import InputValidation from './formValidation/InputValidation';
import {passwordValidation, regexValidation, lengthValidation, mailValidation, emptyValidation, customValidation} from './formValidation/validation';
import {DropBox2} from './common/DropBox2';
import {DatePicker} from './common/DatePicker';
import {Common} from '../common/Common';
import classnames from 'classnames';


var __DEBUG__ = !true;


export class RegisterForm extends React.PureComponent
{
    /**@private*/ defaultAgeRestriction = "18";
    /**@private*/ countries = [];
    /**@private*/ currentCountry = {age: 0, States: null};
    /**@private*/ birthDate = {date: null}; // for standart format value


	constructor(props)
	{
		super(props);


        // fill country data
        try {
		    const $countries = JSON.parse(appData.Registration.countries);
		    for( let val of $countries.Countries  )
		    {
                let item = {value: val['Code'], label: val['Country'], States: val['States'], age: val['ageRestrict']};
                // if (appData.Registration.currentCountry == val['Code']) item.selected = true;
                this.countries.push(item);
		    } // endfor


        } catch (e) {
            __DEV__&&console.warn( 'Registration countries get fail' );
            this.countries = [];
        }


        this.state = {States: [], ageRestrict: 18, deniedText: '', birthDate: ""};
	}


    componentDidMount()
    {
        if( __DEBUG__ )
        {
            0||console.log( 'emulate here' )
            setTimeout(() =>
                {$(".log_out .sign_in").click();
                    setTimeout(() => $(".register").click(), 500)
                }, 700)
        } // endif


        var { onCustomChange } = this.props;

		// let input = $( "input.js-dateofbirth" );
		// input.keyup(() => false);
		// input.keydown(() => false);
		// input.keypress(() => false);
		// input.datepicker({
		// 	yearRange: "1901:c+0",
		// 	dateFormat: "d M yy",
		// 	maxDate: "0",
		// 	minDate: new Date(1, 1 - 1, 1),
		// 	changeMonth: true,
		// 	changeYear: true,
		// 	showAnim: 'slideDown',
		// 	onClose: (text, p2) => input.val(text),
		// });

		// $(this.refs.datePicker)
		// input.daterangepicker({
         //    "singleDatePicker": true,
         //    "showDropdowns": true,
         //    "showWeekNumbers": true,
         //    "autoApply": true,
         //    "startDate": moment(),
		// }, (from, to) => 0||console.log( 'from, to', from, to ));
    }


    hiddenInputRender({ id, className, label, hint, inputLabel, currVal, type, meta: { error, dirty }, ...input })
    {
        delete input.value;
        0||console.log( 'input', input );
        return <input type="hidden" value={currVal} {...input}/>;
    }


    inputRender({ id, className, label, hint, inputLabel, type, meta: { error, dirty }, ...input })
    {
        return <span className={classnames(`input_animate input--yoshiko`, {NickName: input.name === 'NickName'},{Email: input.name === 'Email'}, {Password: input.name === 'Password'},{ComparePassword: input.name === 'ComparePassword'}) + (type === 'password' ? ' pass_container' : '')}>
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                <input className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} type={type} {...input}/>
				{ type === 'password' ? <span className="show_password">{}</span> : '' }
                <label className="input__label input__label--yoshiko" htmlFor={id}>
                    <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                </label>
                {/*<span className="validation-summary-errors"></span>*/}
                {
                    hint && <span className="info bottom">
                        <i>{hint}</i>
                    </span>
                }
            </span>;

    }

    datePickerRender({ id, className, label, hint, inputLabel, currVal, type, afterChange, meta: { error, dirty, onCustomChange }, ...input })
    {
        delete input.value;
        return <span className="input_animate input--yoshiko datePickerRender">
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                <DatePicker className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id}
                    exdata={{afterChange: afterChange.bind(null, onCustomChange), dateFormat: "d M yy"}}
                    value={currVal}
                    {...input}
                />
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

    dropBoxRender({ id, label, hint, items, name, initLabel, className, afterChange, meta: { dirty, error, onCustomChange }, ...input })
    {
        return <span className={"input_animate input--yoshiko " + className}>
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                {/*<DropBox2 className="" name={name} items={items} initLabel={initLabel} hint={hint} input={input}*/}
						 {/*onCustomChange={onCustomChange} options={{maxHeight: 250}} />*/}
                <DropBox2 name={name} items={items} clearable={true} value="" searchable={true} placeholder={initLabel}
						  afterChange={afterChange ? afterChange.bind(null, onCustomChange) : onCustomChange} />

{/*
                <label className="input__label input__label--yoshiko" htmlFor={id}>
                    <span className="input__label-content input__label-content--yoshiko" data-content={label}>{}</span>
                </label>
*/}
            </span>
    }


/*
		const inputHidden = ({ type, meta, ...input }) => {
			return <input type={type} {...input}/>
		};
*/

    /**
     * Check age restrictions
     * @param props - form verify data
     * @return {boolean,string} - false if verify success
     */
    dateBirthCheck(props)
    {
        // 0||console.log( 'this.currentCountry', this.currentCountry );
        let deniedText = '', $error = '';
        let errorAge = `Your must be greater than <var> years of age`;
        let errorDeny = `Notice: Residents of <var> are NOT eligible to participate in the service for real money.`;
        let duration = Common.dateDiff(this.birthDate.date, Date.now());
        let years = Math.floor(duration.asYears());
        // 0||console.log( 'years', years );

        if( this.currentCountry.States === null )
        {
            let $age = this.currentCountry.age;
            if( $age === 0 ) $error = "Select your Country";
            else if( $age === -1 )
            {
                deniedText = errorDeny.replace("<var>", this.currentCountry.label);
                if (18 > years) $error = errorAge.replace("<var>", this.defaultAgeRestriction);
            }
            else if( $age > years ) {
                $error = errorAge.replace("<var>", $age);
            }
            else $error = false;
        }
        else if( this.currentCountry.States === true )
        {
            $error = "Select your State";
        }
        else if( this.currentCountry.States.age )
        {
            let $age = this.currentCountry.States.age;
            if( $age === -1 )
            {
                deniedText = errorDeny.replace("<var>", this.currentCountry.States.label);
                if (18 > years) errorAge.replace("<var>", this.defaultAgeRestriction);
            }
            else if( $age > years ) $error = errorAge.replace("<var>", $age);
            else $error = false;
        }
        else $error = false;

        this.setState({...this.state, deniedText});
        return $error;
    }


    /**
     * Check for states
     * @private
     * @param onCustomChange - for validation
     * @param val - new dd value
     * @param item - item from source array
     */
	dropCountryChange(onCustomChange, val, item)
    {
        let newItems = [];
        // 0||console.log( 'val,', val,  item, this.countries);

        if( item && item[0] )
        {
            this.currentCountry = {...item[0]};
            this.currentCountry.States = item[0].States ? true : null; // set no state choosed
            this.state.ageRestrict = this.currentCountry.age > -1 ? this.currentCountry.age : this.defaultAgeRestriction;

            if( item && item[0] && item[0].States )
            {
                newItems = item[0].States.map(val => {return{value: val['Code'], label: val['State'], age: val['ageRestrict']}});
            } // endif
        }

        this.setState({...this.state, States: newItems});

        onCustomChange(val);
    }


    /**
     * States change
     * @private
     * @param onCustomChange - for validation
     * @param val - new dd value
     * @param item - item from source array
     */
	dropStateChange(onCustomChange, val, item)
    {
        // 0||console.log( 'val,', val,  item);

        if( item && item[0] )
        {
            this.currentCountry.States = item[0];
            this.setState({...this.state, ageRestrict: this.currentCountry.States.age > -1 ? this.currentCountry.States.age : this.defaultAgeRestriction});
        }


        onCustomChange(val);
    }



    /**
     * Date birth change
     * @private
     * @param birthStore - object for validation
     * @param onCustomChange - for validation
     * @param val - new value for user
     * @param date - date from datepicker in common format
     */
	dateBirthChange(onCustomChange, val, date)
    {
        this.birthDate = {date};
        this.setState({...this.state, birthDate: val});
        // 0||console.log( 'onCustomChange, val, date', onCustomChange, val, date );

        onCustomChange(date);
    }

	render()
	{
		const formContent = ({ input, error, successMessage, format/*, data:{ data, plan, depositQuantity, pricePlan }*/, handleSubmit }) => {
            //return <form action="http://localhost/AltBet.Admin/Category/TestAction" ref="F1regForm" method="post" onSubmit={handleSubmit}>
            return <form action={`${ABpp.baseUrl}/Account/Register`} onSubmit={handleSubmit}>
                <div className="column">
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
                                     initialValue={__DEBUG__ ? "FedoryakaBest" : ""}
                                     label="User Name" type='text'
                                     validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z0-9\.\-_]+$/, message: "Allowed: symbols, digits, .-_"}), lengthValidation.bind(null, {min: 3, max: 20})]} input={input}
                                     hint="User's login allow to use symbols such as: symbols, digits, dot, underscore, dash"/>

                    <InputValidation renderContent={this.inputRender} id='e_name' name="Email"
                                     className={'input__field input__field--yoshiko'}
                                     label="Email Address" type='text'
                                     initialValue={__DEBUG__ ? "Zotaper@yandex.ru" : ""}
                                     validate={[emptyValidation, mailValidation, lengthValidation.bind(null, {max: 128})]} input={input}
                                     hint="Specify your valid email. A message with registration
                                        confirmation will be sent at that address. Also that address
                                        will be used for communication with you"/>

                    <InputValidation renderContent={this.inputRender} id='r_pass' name="Password"
                                     className={'input__field input__field--yoshiko '}
                                     initialValue={__DEBUG__ ? "123" : ""}
                                     label="Password" type='password'
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 20}),
										 passwordValidation.bind(null, "r_confirm_pass")]} input={input}/>

                    <InputValidation renderContent={this.inputRender} id='r_confirm_pass' name="ComparePassword"
                                     className={'input__field input__field--yoshiko '}
									 initialValue={__DEBUG__ ? "123" : ""}
                                     label="Confirm Password" type='password'
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 20}),
										 passwordValidation.bind(null, "r_pass")]} input={input}/>

                    <InputValidation renderContent={this.dropBoxRender} id='c_name' name="Country"
                                     className=""
                                     items={this.countries}
                                     initLabel="Select Country ..."
                                     validate={[emptyValidation]} input={input}
                                     afterChange={::this.dropCountryChange}
                                     hint="Indicate the country of your permanent residence"/>

                    <InputValidation renderContent={this.dropBoxRender} id='st_name' name="State"
                                     className={'country-states' + (this.state.States.length ? "" : " states-hidden")}
                                     items={this.state.States}
                                     initLabel="Select state ..."
                                     afterChange={::this.dropStateChange}
                                     validate={this.state.States.length ? [emptyValidation] : []} input={input}
                                     hint=""/>

					<InputValidation renderContent={this.datePickerRender} id='user_b_day' name="DateOfBirth"
									 className={'input__field input__field--yoshiko js-dateofbirth'}
									 label="Date of Birth" type='text'
									 afterChange={this.dateBirthChange.bind(this)}
									 // initialValue={__DEBUG__ ? "12 Apr 1999" : ""}
									 currVal={this.state.birthDate ? this.state.birthDate : __DEBUG__ ? "12 Apr 1999" : ""}
									 validate={[emptyValidation, customValidation.bind(null, ::this.dateBirthCheck)]} input={input}/>

{/*
                    <InputValidation renderContent={::this.hiddenInputRender} name="DateOfBirth"
									 // afterChange={this.dateBirthChange.bind(this)}
									 currVal={this.state.birthDate}
									 validate={[]} input={input}/>
*/}

                    {/*<input type="hidden" name="DateOfBirth" value={this.state.birthDate}/>*/}

                    <div className="agreement">
                        <InputValidation renderContent={this.chkBoxRender} id='agreement' input={input}>
                            <span>Agree to the <a href={ABpp.baseUrl + '/eng/footer/TermsAndConditions'} className="text_decoration">Terms of Use</a> and <a href={ABpp.baseUrl + "/eng/footer/CookiePolicy"} className="text_decoration">Privacy Notice</a></span>
                        </InputValidation>

                        <InputValidation renderContent={this.chkBoxRender} id='agreement_age' input={input}>
                            I confirm that I am at least {this.state.ageRestrict} years of age.
                        </InputValidation>

                        {/*<div className="checkbox_container">
                            <input type="checkbox" id="agreement"/><label htmlFor="agreement">Agree to the <a href="/conditions.html" className="text_decoration">Terms of Use</a> and <a href="#" className="text_decoration">Privacy Notice</a></label>
                        </div>
                        <div className="checkbox_container">
                            <input type="checkbox" id="agreement_age"/><label htmlFor="agreement_age">I confirm that I am at least 18 years of age.</label>
                        </div>*/}
                    </div>

                    {this.state.deniedText &&
                        <div className="denied-text">{this.state.deniedText}</div>
                    }
                </div>

                <hr/>
                <div className={'register_form_message answer-message' + (error && ' validation-summary-errors')}>{error}</div>
                <div className="submit">
                    {/*<input type="submit" value="Register" id="submit_sign_up" className="register wave btn btn_lg_icon btn_blue"/>*/}
                    <button type="submit" id="submit_sign_up" className="register wave btn btn_lg_icon btn_blue">Join to ALT.BET!</button>

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
