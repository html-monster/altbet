/**
 * Created by Htmlbook on 31.05.2017.
 */
import React from 'react';


export default class ChangePassword extends React.PureComponent
{
	render()
	{
			        const { header, active } = this.props.data;

        return <div className={"tab_item " + (this.props.data.active ? "active" : "")}>
			<h2>Change Password</h2>
			{header}

			<form action={appData.pageAccountChangePassUrl}
				  className="change_password" data-ajax="true" data-ajax-failure="ajaxChangePassClass.onErrorAjax"
				  data-ajax-success="ajaxChangePassClass.onSuccessAjax" data-ajax-url={appData.pageAccountChangePassUrl}
				  id="form2" method="post" noValidate="novalidate" style={{marginTop: 25}}>
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
				<span className="input_animate input--yoshiko submit_container">
					<input type="submit" value="Change Password" id="submit" className="btn wave submit"/>
					<span className="answer_message">{}</span>
				</span>
			</form>
		</div>
	}
}