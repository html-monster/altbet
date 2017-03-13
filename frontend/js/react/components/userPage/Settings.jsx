/**
 * Created by tianna on 09.02.17.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FormValidation from '../FormValidation';
import InputValidation from '../formValidation/InputValidation';
import { emptyValidation, minLengthValidation, maxLengthValidation, lettersOnlyValidation,
    checkOnSpecialSymbolsValidation, mailValidation, phoneValidation } from '../formValidation/validation';
import {DateLocalization} from '../../models/DateLocalization';
import settingsActions from '../../actions/userPage/settingsActions';


class Settings extends React.PureComponent
{
    render()
    {
        const { actions, data: { header, active } } = this.props;
        const { FirstName, LastName, UserName, DateOfBirth, Email, Country, Address, Phone } = appData.pageAccountData.UserInfo;

		const inputRender = ({ id, className, info, label, filled, inputLabel, meta: { error, dirty }, ...input }) => {
			return  <span className={'input_animate input--yoshiko input--filled' + (filled ? ' input--filled' : '')}>
                        <input className={`input__field input__field--yoshiko ${className} ${dirty && (error ? ' invalidJs' : ' validJs')}`} {...input}/>
                        <label className="input__label input__label--yoshiko" htmlFor={id}>
                            <span className="input__label-content input__label-content--yoshiko" data-content={label}>{label}</span>
                        </label>
				        { dirty && error && <span className="validation-summary-errors">{error}</span> }
                        { info && <span className="info top"><i>{ info }</i></span> }
                    </span>
		};

		const formContent = ({ input, error, successMessage, userInfo:{ FirstName, LastName, UserName, DateOfBirth, Email,
            Country, Address, Phone }, handleSubmit }) => {
			return <div className="column">
                    <h3 className="section_user">Personal info</h3>
                    <hr/>
                    <form action={appData.pageAccountUserInfoUrl} className="setting_form" data-ajax-failure="ajaxUserDataUpdate.OnFailureJs"
                          data-ajax-success="ajaxUserDataUpdate.OnSuccessJs" data-ajax-url={appData.pageAccountUserInfoUrl}
                          id="form1" method="post" noValidate="novalidate" onSubmit={handleSubmit}>
                    <InputValidation renderContent={inputRender} id={'f_name'} name="FirstName"
                                     initialValue={FirstName} info="Your first name as specified in your passport"
                                     label={'First Name'} type={'text'} filled={FirstName}
                                     validate={[emptyValidation, minLengthValidation.bind(null, 2),
                                         maxLengthValidation.bind(null, 20), lettersOnlyValidation]}
                                     input={input} maxLength="20"/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" data-val-length="Please enter at least 2-50 characters"
                               data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please"
                               data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="First Name is required" id="f_name"
                               maxLength="50" name="FirstName" type="text" defaultValue={FirstName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="f_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="First Name">First Name</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                        <span className="info top">
                            <i>Your first name as specified in your passport</i>
                        </span>
                    </span>*/}

                    <InputValidation renderContent={inputRender} id={'l_name'} name="LastName"
                                     initialValue={LastName} info="Your second name as specified in your passport"
                                     label={'Last Name'} type={'text'} filled={LastName}
                                     validate={[emptyValidation, minLengthValidation.bind(null, 2),
										 maxLengthValidation.bind(null, 20), lettersOnlyValidation]} input={input}
                                     maxLength="20"/>
                    {/*<span className="input_animate input--yoshiko  input--filled">
                        <input className="input__field input__field--yoshiko" data-val-length="Please enter at least 2-50 characters"
                               data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please"
                               data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="Last Name is required" id="l_name"
                               maxLength="50" name="LastName" type="text" defaultValue={LastName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="l_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Last Name">Last Name</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                        <span className="info top">
                            <i>Your second name as specified in your passport</i>
                        </span>
                    </span>*/}


                    <InputValidation renderContent={inputRender} id={'n_name'} name="UserName"
                                     initialValue={UserName}
                                     label={'User Name'} type={'text'} filled={UserName}
                                     validate={[emptyValidation, minLengthValidation.bind(null, 2),
										 maxLengthValidation.bind(null, 20)]} input={input}
                                     maxLength="20"/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" disabled="disabled" id="n_name" name="UserName" type="text" defaultValue={UserName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="n_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="User Name">User Name</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                    </span>*/}

                    <InputValidation renderContent={inputRender} id={'user_b_day'} name="DateOfBirth"
                                     className={'datePickerJs'}
                                     initialValue={(new DateLocalization()).fromSharp(DateOfBirth, 0).unixToLocalDate({format: "DD MMM Y"})}
                                     label={'Date of birth'} type={'text'} filled={true}
                                     validate={emptyValidation} input={input}/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko datePickerJs" data-val-date="The field DateOfBirth must be a date."
                               data-val-required="Date Of birth is required" id="user_b_day" name="DateOfBirth" type="text"
                               defaultValue={(new DateLocalization()).fromSharp(DateOfBirth, 0).unixToLocalDate({format: "DD MMM Y"})}/>
                        <label className="input__label input__label--yoshiko" htmlFor="user_b_day">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Date of birth">Date of birth</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                    </span>*/}


                    <h3 className="section_user">Contact Info</h3>
                    <hr/>

                    <InputValidation renderContent={inputRender} id={'e_name'} name="Email"
                                     initialValue={Email}
                                     info={`Specify your valid email. A message with registration
                                     confirmation will be sent at that address. Also that address
                                     will be used for communication with you`}
                                     label={'Email Address'} type={'email'} filled={Email}
                                     validate={[emptyValidation, mailValidation]} input={input}/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" disabled="disabled" id="e_name" name="Email" type="text" defaultValue={Email}/>
                        <label className="input__label input__label--yoshiko" htmlFor="e_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Email Address">Email Address</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                        <span className="info bottom">
                            <i>
                                Specify your valid email. A message with registration
                                confirmation will be sent at that address.Also that address
                                will be used for communication with you
                            </i>
                        </span>
                    </span>*/}

                    <InputValidation renderContent={inputRender} id={'c_name'} name="Country"
                                     initialValue={Country} info="Indicate the country of your permanent residence"
                                     label={'Country'} type={'text'} filled={Country}
                                     validate={[emptyValidation, minLengthValidation.bind(null, 2),
										 maxLengthValidation.bind(null, 128)]}
                                     input={input} maxLength="20"/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" data-val-length="Please enter at least 3-50 characters"
                               data-val-length-max="128" data-val-length-min="3" data-val-regex="Use letters only please"
                               data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="Country is required" id="c_name"
                               maxLength="128" name="Country" type="text" defaultValue={Country}/>
                        <label className="input__label input__label--yoshiko" htmlFor="c_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Country">Country</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                        <span className="info top">
                            <i>Indicate the country of your permanent residence</i>
                        </span>
                    </span>*/}

                    <InputValidation renderContent={inputRender} id={'s_name'} name="Address"
                                     initialValue={Address} info="Enter address manually"
                                     label={'Address'} type={'text'} filled={Address}
                                     validate={[emptyValidation, minLengthValidation.bind(null, 2),
										 maxLengthValidation.bind(null, 200) , checkOnSpecialSymbolsValidation]} input={input}
                                     maxLength="200"/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" data-val-length="Please enter at least 3-50 characters"
                               data-val-length-max="200" data-val-length-min="3" data-val-required="Address is required" id="s_name"
                               maxLength="200" name="Address" type="text" defaultValue={Address}/>
                        <label className="input__label input__label--yoshiko" htmlFor="s_name">
                            <span className="input__label-content input__label-content--yoshiko"
                                  data-content="Address">Address</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                        <span className="info top">
                            <i>Enter address manually</i>
                        </span>
                    </span>*/}

                    <InputValidation renderContent={inputRender} id={'t_number'} name="Phone"
                                     initialValue={Phone}
                                     label={'Phone'} type={'tel'} filled={Phone}
                                     validate={[emptyValidation, phoneValidation]} input={input}
                                     maxLength="20"/>
                    {/*<span className="input_animate input--yoshiko input--filled">
                        <input className="input__field input__field--yoshiko" data-val-length="Please enter at least 3-50 characters"
                               data-val-length-max="30" data-val-length-min="3" data-val-regex="Not a valid phone number"
                               data-val-regex-pattern="^[0-9]+$" data-val-required="Phone is required" id="t_number" maxLength="30"
                               name="Phone" type="tel" defaultValue={Phone}/>
                        <label className="input__label input__label--yoshiko" htmlFor="t_number">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Phone">Phone</span>
                        </label>
                        <span className="validation-summary-errors">{}</span>
                    </span>*/}

                    <span className="input_animate input--yoshiko">
                        <input type="submit" value="Submit" className="btn wave"/>
                        {/*<span className="answer_message"></span>*/}
                        <span className={'answer_message' + (error && ' validation-summary-errors')}>{error}</span>
						<span className={'answer_message' + (successMessage && ' validJs')}>{successMessage}</span>
                    </span>
                </form>
            </div>
		};

        return <div className={"tab_item settings " + (active ? "active" : "")}>
                <h2>Settings</h2>
                {header}
            <FormValidation
                data={this.props.data}
                userInfo={appData.pageAccountData.UserInfo}
                renderContent={formContent}
                handleSubmit={actions.actionAjaxUserDataUpdate}
                serverValidation={true}
            />


            <form action={appData.pageAccountChangePassUrl}
                  className="change_password" data-ajax="true" data-ajax-failure="ajaxChangePassClass.onErrorAjax"
                  data-ajax-success="ajaxChangePassClass.onSuccessAjax" data-ajax-url={appData.pageAccountChangePassUrl}
                  id="form2" method="post" noValidate="novalidate" style={{marginTop: 25}}>
                <h3 className="section_user">Change Password</h3>
                <hr/>
                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_curr_pass" name="OldPassword" type="password"/>
                    <span className="show_password">{}</span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_curr_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Current Password</span>
                    </label>
                    <span className="validation-summary-errors">{}</span>
                </span>

                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_pass" name="NewPassword" type="password"/>
                    <span className="show_password">{}</span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="New Password">New Password</span>
                    </label>
                    <span className="validation-summary-errors">{}</span>
                </span>

                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_confirm_pass" name="ConfirmPassword" type="password"/>
                    <span className="show_password">{}</span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_confirm_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="Confirm Password">Confirm Password</span>
                    </label>
                    <span className="validation-summary-errors">{}</span>
                </span>
                <span className="input_animate input--yoshiko">
                    <input type="submit" value="ChangePassword" id="submit" className="btn wave"/>
                    <span className="answer_message"></span>
                </span>
            </form>
        </div>;
    }
}

export default connect(
	state => ({
		// data: state.myPosReduce,
		// test: state.Ttest,
	}),
	dispatch => ({
		actions: bindActionCreators(settingsActions, dispatch),
		// myPositionsActions: bindActionCreators(myPositionsActions, dispatch),
	})
)(Settings)