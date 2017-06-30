/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
import NumericInput from 'react-numeric-input';

import Select from 'react-select';
// import 'react-select/dist/react-select.css';

export default class SelfExclusion extends React.Component
{
	constructor()
	{
		super();

		this.state = {
			answerMessage: '',
			answerClass: null,
			loading: false,
			// radioButtonsDisabled: appData.pageAccountData.Account.MailActivity,
			serverData: appData.pageAccountData.Account
		};
	}

	sendData(event)
	{
		event.preventDefault();

		const Phone = appData.pageAccountData.UserInfo.Phone;

		// Unchecked sms of my activity checkbox if phone is empty in settings
		if( this.state.serverData.SmsActivity && (!Phone || /^[^0-9]/gi.test(Phone)) )
		{
			this.setState({
				...this.state,
				answerMessage: `Enter your phone number in the <a href="${ABpp.baseUrl}/Account#/settings" class="link">settings</a>`,
				answerClass: 'invalid_message',
				loading: false,
				serverData: {
					...this.state.serverData,
					SmsActivity: true
				}
			});
			return false;
		}

		defaultMethods.sendAjaxRequest({
			context   : $(event.currentTarget),
			url       : appData.pageAccountPreferencesUrl,
			callback  : onSuccessAjax.bind(this),
			onError   : onErrorAjax.bind(this),
			beforeSend: beforeSend.bind(this)
		});

		function onSuccessAjax(error)
		{
			if(error)
			{
				if(defaultMethods.getClass(error) === 'String')
				{
					this.setState({
						...this.state,
						answerMessage: error,
						answerClass: 'invalid_message',
						loading: false
					});
				}
				// else if(error.Link)
				// {
				// 	// this.setState({
				// 	// 	...this.state,
				// 	// 	answerMessage: `If you want to renew the subscription, you need to go <a href="${error.Link}" target="_blank" class="link">here</a>`,
				// 	// 	answerClass: 'invalid_message',
				// 	// 	loading: false,
				// 	// 	serverData: {
				// 	// 		...this.state.serverData,
				// 	// 		MailNews: false
				// 	// 	}
				// 	// });
				// }
				else
				{
					this.setState({
						...this.state,
						answerMessage: 'Server error. Please try again or try again later.',
						answerClass: 'invalid_message',
						loading: false
					});
				}
			}
			else
				this.setState({
					...this.state,
					answerMessage: 'Your data has been successfully updated',
					answerClass: 'validJs',
					loading: false
				});

		}

		function beforeSend()
		{
			this.setState({
				...this.state,
				answerMessage: '',
				answerClass: '',
				loading: true
			});
		}

		function onErrorAjax(x, y)
		{
			this.setState({
				...this.state,
				answerMessage: 'The connection to the server has been lost. Please check your internet connection or try again.',
				answerClass: 'invalid_message',
				loading: false
			});
			console.log('XMLHTTPRequest object: ', x);
			console.log('textStatus: ',  y);
		}
	}

    render()
    {
        const { SelfExclusion } = this.state.serverData;
        const { header, active } = this.props.data;
        const { loading } = this.state;

        let Select = require('react-select');

let getOptions = function(input, callback) {
  setTimeout(function() {
    callback(null, {
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      // CAREFUL! Only set this to true when there are no more options,
      // or more specific queries will not be sent to the server.
      complete: true
    });
  }, 500);
};

		function logChange(val) {
  			console.log("Selected: " + val);
		}


        return <div className={"tab_item selfexclusion " + (active ? "active" : "")}>
                <h2>Self Exclusion</h2>
                {header}
				<form action={appData.pageAccountPreferencesUrl} className={loading ? 'loading' : ''} onSubmit={::this.sendData}
					  // id="form0" method="post" noValidate="novalidate"
					  // data-ajax="true"
					  // data-ajax-failure="ajaxPreferencesClass.onErrorAjax"
					  // data-ajax-success="ajaxPreferencesClass.onSuccessAjax"
					  // data-ajax-url={appData.pageAccountPreferencesUrl}
				>
					<section className="section" style={{'border': '1px solid red', 'padding': '10px'}}>
                        <h4>Responsible Gaming Deposit limits</h4>
                        <span>Please note: <br /> Increasing of instanceof existing depaosit limit will take effect only after 72 hours
                         following request async part of our measures against compulsive trading. </span>
                        <ul className="preferences_list">
							<li>
								<div className={'container' } style={{marginLeft: 10}}>
									<label className="radio_button">
										<input type="radio" name="DepositLimit" value={'daily'}
											   defaultChecked={SelfExclusion === 'daily' || SelfExclusion === 'never'}
											   />
										<span>daily</span>
									</label>
									<label className="radio_button">
										<input type="radio" name="DepositLimit" value={'weekly'}
											   defaultChecked={SelfExclusion === 'weekly'}
											   />
										<span>weekly</span>
									</label>
									<label className="radio_button">
										<input type="radio" name="DepositLimit" value={'monthly'}
											   defaultChecked={SelfExclusion === 'monthly'}
											   />
										<span>monthly</span>
									</label>
									<label className="radio_button">
										<input type="radio" name="DepositLimit" value={'noLimit'}
											   defaultChecked={SelfExclusion === 'noLimit'}
											   />
										<span>No Limits</span>
									</label>
								</div>
							</li>
						</ul>
											<button type="submit" id="submit_sign_up" className="register wave btn btn_lg_icon btn_blue">ok</button>

					</section>

				</form>

				<form action={appData.pageAccountPreferencesUrl} className={loading ? 'loading' : ''} onSubmit={::this.sendData}>
					<section className="section" style={{'border': '1px solid green', 'padding': '10px'}}>
						<h4>Responsible Gaming Time out</h4>
						<span> Self Exclusion </span>
						<span> This will block you from using the site for 6 months. <br /> this aactions cannot be reversed under any circumstances</span>



							<span className="input_animate input--yoshiko pass_container">
					         <input className="input__field input__field--yoshiko" id="user_curr_pass" name="OldPassword" type="password"/>
					          <span className="show_password">{}</span>
					            <label className="input__label input__label--yoshiko" htmlFor="user_curr_pass">
						        <span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Password</span>
					            </label>
					             <span className="validation-summary-errors">{}</span>
                            </span>




											<button type="submit" id="submit_sign_up" className="register wave btn btn_lg_icon btn_blue">ok</button>

					</section>
					</form>
				<form action={appData.pageAccountPreferencesUrl} className={loading ? 'loading' : ''} onSubmit={::this.sendData}>
					<section style={{'border': '1px solid yellow', 'padding': '10px'}}>
                        <h4>Time Out</h4>
                        <div className="pass_container">
                            <span className="input_animate input--yoshiko pass_container">
                            	<input className="input__field input__field--yoshiko" id="user_curr_pass" name="OldPassword" type="password"/>
					          		<span className="show_password">{}</span>
					          		<label className="input__label input__label--yoshiko" htmlFor="user_curr_pass">
						        		<span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Password</span>
					            	</label>
					             	<span className="validation-summary-errors">{}</span>
							</span>
						</div>
                        <div className="time_container">


<Select.Async
    name="form-field-name"
    loadOptions={getOptions}
/>


                        </div>
						<button type="submit" id="submit_sign_up" className="register wave btn btn_lg_icon btn_blue">ok</button>
					</section>
				</form>
            </div>;
    }
}