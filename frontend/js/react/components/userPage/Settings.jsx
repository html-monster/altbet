/**
 * Created by tianna on 09.02.17.
 */

import React from 'react';

import {DateLocalization} from '../../models/DateLocalization';


export default class Settings extends React.PureComponent
{
    render()
    {
        const {header, active} = this.props.data;
        const {FirstName, LastName, UserName, DateOfBirth, Email, Country, Address, Phone} = appData.pageAccountData.UserInfo;


        return <div className={"tab_item settings " + (active ? "active" : "")}>
                <h2>Settings</h2>
                {header}
            <form action={appData.pageAccountUserInfoUrl} className="setting_form" data-ajax="true" data-ajax-failure="ajaxUserDataUpdate.OnFailureJs" data-ajax-success="ajaxUserDataUpdate.OnSuccessJs" data-ajax-url={appData.pageAccountUserInfoUrl} id="form1" method="post" noValidate="novalidate">
                <div className="column">

                    <h3 className="section_user">Personal info</h3>
                    <hr/>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.FirstName, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.FirstName, new {@class = "input__field input__field--yoshiko", id = "f_name", maxlength = "50"})*/}
                        <span className="field-validation-valid validation-summary-errors" data-valmsg-htmlFor="FirstName" data-valmsg-replace="true"></span>
                        <input className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 2-50 characters" data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please" data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="First Name is required" id="f_name" maxLength="50" name="FirstName" type="text" defaultValue={FirstName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="f_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="First Name">First Name</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                        <span className="info top">
                            <i>Your first name as specified in your passport</i>
                        </span>
                    </span>

                    <span className="input_animate input--yoshiko  input--filled">
                        {/*@Html.ValidationMessageFor(m => m.LastName, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.LastName, new {@class = "input__field input__field--yoshiko", id = "l_name", maxlength = "50"})*/}
                        <span className="field-validation-valid validation-summary-errors" data-valmsg-htmlFor="LastName" data-valmsg-replace="true"></span>
                        <input className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 2-50 characters" data-val-length-max="50" data-val-length-min="2" data-val-regex="Use letters only please" data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="Last Name is required" id="l_name" maxLength="50" name="LastName" type="text" defaultValue={LastName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="l_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Last Name">Last Name</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                        <span className="info top">
                            <i>Your second name as specified in your passport</i>
                        </span>
                    </span>


                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.TextBoxFor(m => m.UserName, new { @class = "input__field input__field--yoshiko", id = "n_name", @disabled = "disabled" })*/}
                        <input className="input__field input__field--yoshiko" disabled="disabled" id="n_name" name="UserName" type="text" defaultValue={UserName}/>
                        <label className="input__label input__label--yoshiko" htmlFor="n_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="User Name">User Name</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                    </span>

                        <span className="input_animate input--yoshiko input--filled">
                             {/*@Html.TextBoxFor(m => m.DateOfBirth, String.Format("{0:MM/dd/yyyy}", Model.DateOfBirth), new { @class = "input__field input__field--yoshiko datePickerJs", id = "user_b_day" })*/}
                            <input className="input__field input__field--yoshiko datePickerJs" data-val="true" data-val-date="The field DateOfBirth must be a date." data-val-required="Date Of birth is required" id="user_b_day" name="DateOfBirth" type="text" defaultValue={(new DateLocalization()).fromSharp(DateOfBirth, 0).unixToLocalDate({format: "DD MMM Y"})}/>
                            <label className="input__label input__label--yoshiko" htmlFor="user_b_day">
                                <span className="input__label-content input__label-content--yoshiko" data-content="Date of birth">Date of birth</span>
                            </label>
                            <span className="validation-summary-errors"></span>
                        </span>


                    <h3 className="section_user">Contact Info</h3>
                    <hr/>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.TextBoxFor(m => m.Email, new { @class = "input__field input__field--yoshiko", id = "e_name", @disabled = "disabled" })*/}
                        <input className="input__field input__field--yoshiko" disabled="disabled" id="e_name" name="Email" type="text" defaultValue={Email}/>
                        <label className="input__label input__label--yoshiko" htmlFor="e_name">
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

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.Country, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.Country, new { @class = "input__field input__field--yoshiko", id = "c_name", maxlength = "128" })*/}
                        <span className="field-validation-valid validation-summary-errors" data-valmsg-htmlFor="Country" data-valmsg-replace="true"></span>
                        <input className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3-50 characters" data-val-length-max="128" data-val-length-min="3" data-val-regex="Use letters only please" data-val-regex-pattern="^[a-zA-Z]+$" data-val-required="Country is required" id="c_name" maxLength="128" name="Country" type="text" defaultValue={Country}/>
                        <label className="input__label input__label--yoshiko" htmlFor="c_name">
                            <span className="input__label-content input__label-content--yoshiko"
                                  data-content="Country">Country</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                        <span className="info top">
                            <i>Indicate the country of your permanent residence</i>
                        </span>
                    </span>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.Address, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.Address, new { @class = "input__field input__field--yoshiko", id = "s_name", maxlength = "200" })*/}
                        <span className="field-validation-valid validation-summary-errors" data-valmsg-htmlFor="Address" data-valmsg-replace="true"></span>
                        <input className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3-50 characters" data-val-length-max="200" data-val-length-min="3" data-val-required="Address is required" id="s_name" maxLength="200" name="Address" type="text" defaultValue={Address}/>
                        <label className="input__label input__label--yoshiko" htmlFor="s_name">
                            <span className="input__label-content input__label-content--yoshiko"
                                  data-content="Address">Address</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                        <span className="info top">
                            <i>Enter address manually</i>
                        </span>
                    </span>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.Phone, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.Phone, new { @class = "input__field input__field--yoshiko", id = "t_number", maxlength = "30" })*/}
                        <span className="field-validation-valid validation-summary-errors" data-valmsg-htmlFor="Phone" data-valmsg-replace="true"></span>
                        <input className="input__field input__field--yoshiko" data-val="true" data-val-length="Please enter at least 3-50 characters" data-val-length-max="30" data-val-length-min="3" data-val-regex="Not a valid phone number" data-val-regex-pattern="^[0-9]+$" data-val-required="Phone is required" id="t_number" maxLength="30" name="Phone" type="text" defaultValue={Phone}/>
                        <label className="input__label input__label--yoshiko" htmlFor="t_number">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Phone">Phone</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                    </span>
                    <span className="input_animate input--yoshiko">
                        <input type="submit" value="Submit" className="btn wave"/>
                        <span className="answer_message"></span>
                    </span>
                </div>
            </form>


            <form action={appData.pageAccountChangePassUrl} className="change_password" data-ajax="true" data-ajax-failure="ajaxChangePassClass.onErrorAjax" data-ajax-success="ajaxChangePassClass.onSuccessAjax" data-ajax-url={appData.pageAccountChangePassUrl} id="form2" method="post" noValidate="novalidate">
                <h3 className="section_user">Change Password</h3>
                <hr/>
                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_curr_pass" name="OldPassword" type="password"/>
                    <span className="show_password"></span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_curr_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Current Password</span>
                    </label>
                    <span className="validation-summary-errors"></span>
                </span>

                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_pass" name="NewPassword" type="password"/>
                    <span className="show_password"></span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="New Password">New Password</span>
                    </label>
                    <span className="validation-summary-errors"></span>
                </span>

                <span className="input_animate input--yoshiko pass_container">
                    <input className="input__field input__field--yoshiko" id="user_confirm_pass" name="ConfirmPassword" type="password"/>
                    <span className="show_password"></span>
                    <label className="input__label input__label--yoshiko" htmlFor="user_confirm_pass">
                        <span className="input__label-content input__label-content--yoshiko" data-content="Confirm Password">Confirm Password</span>
                    </label>
                    <span className="validation-summary-errors"></span>
                </span>
                <span className="input_animate input--yoshiko">
                    <input type="submit" value="ChangePassword" id="submit" className="btn wave"/>
                    <span className="answer_message"></span>
                </span>
            </form>
        </div>;
    }
}