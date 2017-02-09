/**
 * Created by tianna on 09.02.17.
 */

import React from 'react';


export class Settings extends React.PureComponent
{
    render()
    {
        var {header, active} = this.props.data;
        return <div className={"tab_item settings " + (active ? "active" : "")}>
                <h2>Settings</h2>
                {header}
            <form>
                <div className="column">

                    <h3 className="section_user">Personal info</h3>
                    <hr/>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.FirstName, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.FirstName, new {@class = "input__field input__field--yoshiko", id = "f_name", maxlength = "50"})*/}
                        <label className="input__label input__label--yoshiko" for="f_name">
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
                        <label className="input__label input__label--yoshiko" for="l_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="Last Name">Last Name</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                        <span className="info top">
                            <i>Your second name as specified in your passport</i>
                        </span>
                    </span>


                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.TextBoxFor(m => m.UserName, new { @class = "input__field input__field--yoshiko", id = "n_name", @disabled = "disabled" })*/}
                        <label className="input__label input__label--yoshiko" for="n_name">
                            <span className="input__label-content input__label-content--yoshiko" data-content="User Name">User Name</span>
                        </label>
                        <span className="validation-summary-errors"></span>
                    </span>

                        <span className="input_animate input--yoshiko input--filled">
                             {/*@Html.TextBoxFor(m => m.DateOfBirth, String.Format("{0:MM/dd/yyyy}", Model.DateOfBirth), new { @class = "input__field input__field--yoshiko datePickerJs", id = "user_b_day" })*/}
                            <label className="input__label input__label--yoshiko" for="user_b_day">
                                <span className="input__label-content input__label-content--yoshiko" data-content="Date of birth">Date of birth</span>
                            </label>
                            <span className="validation-summary-errors"></span>
                        </span>
                    <h3 className="section_user">Contact Info</h3>
                    <hr/>

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.TextBoxFor(m => m.Email, new { @class = "input__field input__field--yoshiko", id = "e_name", @disabled = "disabled" })*/}
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

                    <span className="input_animate input--yoshiko input--filled">
                        {/*@Html.ValidationMessageFor(m => m.Country, null, new { @class = "validation-summary-errors" })*/}
                        {/*@Html.TextBoxFor(m => m.Country, new { @class = "input__field input__field--yoshiko", id = "c_name", maxlength = "128" })*/}
                        <label className="input__label input__label--yoshiko" for="c_name">
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
                        <label className="input__label input__label--yoshiko" for="s_name">
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
                        <label className="input__label input__label--yoshiko" for="t_number">
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
        </div>;
    }
}