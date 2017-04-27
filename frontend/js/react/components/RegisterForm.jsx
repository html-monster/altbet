/**
 * Created by Vlasakh on 01.03.2017.
 */


import React from 'react';


import FormValidation from './FormValidation';
import InputValidation from './formValidation/InputValidation';
import {passwordValidation, regexValidation, lengthValidation, mailValidation, emptyValidation, phoneValidation} from './formValidation/validation';
import {DropBox2} from './common/DropBox2';
import {DatePicker} from './common/DatePicker';


export class RegisterForm extends React.PureComponent
{
    countries = [];

	constructor(props)
	{
		super(props);


        // fill country data
        try {
		    const $countries = JSON.parse(appData.Registration.countries);
		    for( let val of $countries.Countries  )
		    {
                let item = {value: val['Code'], label: val['Country'], States: val['States']};
                // if (appData.Registration.currentCountry == val['Code']) item.selected = true;
                this.countries.push(item);
		    } // endfor


        } catch (e) {
            __DEV__&&console.warn( 'Registration countries get fail' );
            this.countries = [];
        }


        this.state = {States: []};
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


    datePickerRender({ id, className, label, hint, inputLabel, type, meta: { error, dirty, onCustomChange }, ...input })
    {
        return <span className="input_animate input--yoshiko">
                { dirty && error && <span className="field-validation-valid validation-summary-errors">{error}</span> }
                <DatePicker className={`${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} id={id} afterChange={onCustomChange} {...input}/>
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
                                     initialValue="FedoryakaBest"
                                     label="User Name" type='text'
                                     validate={[emptyValidation, regexValidation.bind(null, {tmpl: /^[a-zA-Z\.\-_]+$/, message: "Allowed: symbols, digits, .-_"}), lengthValidation.bind(null, {min: 3, max: 20})]} input={input}
                                     hint="User's login allow to use symbols such as: symbols, digits, dot, underscore, dash"/>

                    <InputValidation renderContent={this.inputRender} id='e_name' name="Email"
                                     className={'input__field input__field--yoshiko'}
                                     label="Email Address" type='text'
                                     initialValue="Zotaper@yandex.ru"
                                     validate={[emptyValidation, mailValidation, lengthValidation.bind(null, {max: 128})]} input={input}
                                     hint="Specify your valid email. A message with registration
                                        confirmation will be sent at that address. Also that address
                                        will be used for communication with you"/>

                    <InputValidation renderContent={this.inputRender} id='r_pass' name="Password"
                                     className={'input__field input__field--yoshiko'}
                                     initialValue="123"
                                     label="Password" type='password'
                                     validate={[emptyValidation, lengthValidation.bind(null, {min: 3, max: 20})]} input={input}/>

                    <InputValidation renderContent={this.inputRender} id='r_confirm_pass' name="ComparePassword"
                                     className={'input__field input__field--yoshiko'}
                                     label="Confirm Password" type='password'
                                     validate={passwordValidation.bind(null, "r_pass")} input={input}/>

					<InputValidation renderContent={this.datePickerRender} id='user_b_day' name="DateOfBirth"
									 className={'input__field input__field--yoshiko js-dateofbirth'}
									 label="Date of birth" type='text'
									 validate={[emptyValidation]} input={input}/>


                    <InputValidation renderContent={this.dropBoxRender} id='c_name' name="Country"
                                     className=""
                                     items={this.countries}
                                     initLabel="Select country ..."
                                     validate={[emptyValidation]} input={input}
                                     afterChange={::this._dropCountryChange}
                                     hint="Indicate the country of your permanent residence"/>

                    <InputValidation renderContent={this.dropBoxRender} id='st_name' name="State"
                                     className={'country-states' + (this.state.States.length ? "" : " states-hidden")}
                                     items={this.state.States}
                                     initLabel="Select state ..."
                                     validate={this.state.States.length ? [emptyValidation] : []} input={input}
                                     hint=""/>



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
                </div>

                <hr/>
                <div className={'answer-message' + (error && ' validation-summary-errors')}>{error}</div>
                <div className="submit">
                    <input type="submit" value="Register" id="submit_sign_up" className="submit btn wave"/>
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


    /**
     * Check for states
     * @private
     * @param onCustomChange - for validation
     * @param val - new dd value
     * @param item - item from source array
     */
	_dropCountryChange(onCustomChange, val, item)
    {
        let newItems = [];

        if( item && item[0] && item[0].States )
        {
            newItems = item[0].States.map(val => {return{value: val['Code'], label: val['State']}});
        } // endif

        this.setState({...this.state, States: newItems});

        onCustomChange(val);
    }
}
