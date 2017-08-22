/**
 * Created by Htmlbook on 31.05.2017.
 */
import React from 'react';


export default class ChangePassword extends React.PureComponent
{
	constructor()
	{
		super();

		this.state = {
			userName: ''
		}
	}

	componentDidMount()
	{
		let currentPass = '.wrapper_user_page #user_curr_pass',
			newPass = '.wrapper_user_page #user_pass',
			confirmPass = '.wrapper_user_page #user_confirm_pass',
			self = this;

		$(currentPass).keyup(function () {
			self._minCheck.bind(self)(this);
			self._compare.bind(self)({
				anotherText: $(this),
				context: newPass,
				sameText: confirmPass
			});
		});
		$(newPass).keyup(function () {
			self._minCheck.bind(self)(this);
			self._compare.bind(self)({
				context: $(this),
				sameText: confirmPass,
				anotherText: currentPass
			});
		});
		$(confirmPass).keyup(function () {
			self._minCheck.bind(self)(this);
			self._compare.bind(self)({
				context: $(this),
				sameText: newPass,
				anotherText: currentPass
			});
		});

	}

	render()
	{
        const { header } = this.props.data;


		return <div className={"tab_item " + (this.props.data.active ? "active" : "")}>
			<h2 className="section_user passw_change">Change Password</h2>
			{header}
			<form className="setting-form change_password" onSubmit={::this._onSubmit}>

				<span className="input_group  pass_container">
					<input  className="input" id="user_curr_pass" name="OldPassword" placeholder="Current Password" type="password"/>
					<span className="show_password show-passw">{}</span>
					<label  className="input__label input__label--yoshiko" htmlFor="user_curr_pass">
						<span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Current Password</span>
					</label>
					<span className="error">{}</span>
				</span>

				<span className="input_group pass_container">
					<input className="input" id="user_pass" name="NewPassword" type="password" placeholder="New Password"/>
					<span className="show_password show-passw">{}</span>
					<label className="input__label input__label--yoshiko" htmlFor="user_pass">
						<span className="input__label-content input__label-content--yoshiko" data-content="New Password">New Password</span>
					</label>
					<span className="error">{}</span>
				</span>

				<span className="input_group  pass_container passw_opacity">
					<input className="input" id="user_confirm_pass" name="ConfirmPassword" type="password" placeholder="Confirm Password"/>
					<span className="show_password show-passw">{}</span>
					<label className="input__label input__label--yoshiko" htmlFor="user_confirm_pass">
						<span className="input__label-content input__label-content--yoshiko" data-content="Confirm Password">Confirm Password</span>
					</label>
					<span className="error">{}</span>
				</span>
				<span className="input_group  submit_container">
					<input type="submit" value="Change Password" id="submit" className="btn wave submit"/>
					<span className="answer_message">{}</span>
				</span>
			</form>
		</div>
	}

	_onSubmit(event)
	{
		event.preventDefault();
		const data = $(event.currentTarget).serialize();
		const currentPass = '.wrapper_user_page #user_curr_pass',
			newPass = '.wrapper_user_page #user_pass',
			confirmPass = '.wrapper_user_page #user_confirm_pass',
			self = this;

		const minLengthValid = self._minCheck.bind(self)(currentPass, newPass, confirmPass);
		const valid = self._compare.bind(self)({
			context: newPass,
			sameText: confirmPass,
			anotherText: currentPass
		});

		if(!(valid && minLengthValid)) return false;


		function onSuccessAjax(answer)
		{
			let message = $('.wrapper_user_page .change_password .answer_message');
			if (answer.Error) {
				message.removeClass('validJs').addClass('error').text(answer.Error);
				$('.wrapper_user_page #user_curr_pass').removeClass('validJs').addClass('invalidJs')
			}
			else if (answer.ErrorUpdate)
				message.removeClass('validJs').addClass('error').text(answer.ErrorUpdate);
			else {
				message.removeClass('error').addClass('validJs')
					   .text('Your password was successfully changed');

				setTimeout(() => {
					$('.wrapper_user_page .pass_container').removeClass('input--filled');
					$('.wrapper_user_page .change_password [type=password]').removeClass('error validJs valid').val('');
					$('.wrapper_user_page .change_password .error').text('');
				}, 100);
			}

			setTimeout(() => {
				message.removeClass('valid error').text('');
			}, 5000);

			$(event.currentTarget).find('[type=submit]').removeAttr('disabled')
		}

		function onErrorAjax(x, y)
		{
			console.log('XMLHTTPRequest object: ', x);
			console.log('textStatus: ', y);
			defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
			$(event.currentTarget).find('[type=submit]').removeAttr('disabled')
		}

		function onBeginAjax()
		{
			$(event.currentTarget).find('[type=submit]').attr('disabled', true)
		}

		defaultMethods.sendAjaxRequest({
			url: appData.pageAccountChangePassUrl,
			success: onSuccessAjax,
			error: onErrorAjax,
			beforeSend: onBeginAjax,
			data: data,
		});
	}

	_minCheck(...context)
	{
		let valid = [], self = this;
		$(context).each(function () {
			if($(this).val().length < 3){
				$(this).addClass('invalidJs').removeClass('validJs');
				self._showMessage('password min length is 3 characters', this);
				valid.push(false);
			}
			else{
				$(this).addClass('validJs').removeClass('invalidJs');
				self._showMessage('', this);
				valid.push(true);
			}
		});
		valid = valid.every(item => item);

		return valid;
	}

	_compare(elements)
	{
		let valid = false;
		if(elements.context && elements.anotherText && elements.sameText){
			let contextLength = $(elements.context).val().length >= 3,
				sameTextLength = $(elements.sameText).val().length >= 3,
				anotherTextLength = $(elements.anotherText).val().length >= 3;

			if($(elements.context).val() !== $(elements.sameText).val() &&
				contextLength && sameTextLength){
				$(elements.context).addClass('invalidJs').removeClass('validJs');
				$(elements.sameText).addClass('invalidJs').removeClass('validJs');
				this._showMessage('Password aren`t match', elements.context, elements.sameText);
				valid = false;
				if($(elements.context).val() !== $(elements.anotherText).val() &&
					$(elements.sameText).val() !== $(elements.anotherText).val()){
					$(elements.anotherText).addClass('validJs').removeClass('invalidJs');
					this._showMessage('',	elements.anotherText);
				}
			}
			else{
				if(contextLength) {
					$(elements.context).addClass('validJs').removeClass('invalidJs');
					this._showMessage('', elements.context);
					valid = true;
				}
				if(sameTextLength) {
					$(elements.sameText).addClass('validJs').removeClass('invalidJs');
					this._showMessage('',	elements.sameText);
					valid = true;
				}
				if(anotherTextLength) {
					$(elements.anotherText).addClass('validJs').removeClass('invalidJs');
					this._showMessage('',	elements.anotherText);
					valid = true;
				}
			}

			if($(elements.context).val() === $(elements.anotherText).val() &&
				contextLength && anotherTextLength){
				$(elements.context).addClass('invalidJs').removeClass('validJs');
				$(elements.anotherText).addClass('invalidJs').removeClass('validJs');
				this._showMessage('Old password and new password are match', elements.context, elements.anotherText);
				valid = false;
			}

			if($(elements.sameText).val() === $(elements.anotherText).val() &&
				sameTextLength && anotherTextLength){
				$(elements.sameText).addClass('invalidJs').removeClass('validJs');
				$(elements.anotherText).addClass('invalidJs').removeClass('validJs');
				this._showMessage('Old password and new password are match', elements.sameText, elements.anotherText);
				valid = false;
			}
		}

		return valid;
	}

	_showMessage(errorText, ...context) {
		$(context).each(function () {
			$(this).parent().find('.error').text(errorText);
		});
	}

}