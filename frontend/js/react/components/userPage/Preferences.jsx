/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';

import {CheckBox} from '../common/CheckBox';


export default class Preferences extends React.Component
{
	constructor()
	{
		super();

		this.state = {
			answerMessage: '',
			answerClass: null,
			loading: false,
			radioButtonsDisabled: appData.pageAccountData.Account.MailActivity,
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
					SmsActivity: false
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
				if(defaultMethods.getType(error) === 'String')
				{
					this.setState({
						...this.state,
						answerMessage: error,
						answerClass: 'invalid_message',
						loading: false
					});
				}
				else if(error.Link)
				{
					this.setState({
						...this.state,
						answerMessage: `If you want to renew the subscription, you need to go <a href="${error.Link}" target="_blank" class="link">here</a>`,
						answerClass: 'invalid_message',
						loading: false,
						serverData: {
							...this.state.serverData,
							MailNews: false
						}
					});
				}
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

			// setTimeout(() => {
			// 	this.setState({
			// 		answerMessage: '',
			// 		answerClass: null,
			// 		loading: false
			// 	});
			// }, 5000);
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
        const { IsMode, IsBettor, IsTrade, MailActivity, MailFrequency, MailNews, MailUpdates, SmsActivity } = this.state.serverData;
        const { header, active } = this.props.data;
        const { answerMessage, answerClass, loading, radioButtonsDisabled } = this.state;



        return <div className={"tab_item preferences " + (active ? "active" : "")}>
                <h2>Preferences</h2>
                {header}
				<form action={appData.pageAccountPreferencesUrl} className={loading ? 'loading' : ''} onSubmit={::this.sendData}
					  // id="form0" method="post" noValidate="novalidate"
					  // data-ajax="true"
					  // data-ajax-failure="ajaxPreferencesClass.onErrorAjax"
					  // data-ajax-success="ajaxPreferencesClass.onSuccessAjax"
					  // data-ajax-url={appData.pageAccountPreferencesUrl}
				>
					<section className="section">
						<h3 className="section_user">General</h3>
						<hr/>
						<ul className="preferences_list color_scheme_switch">
							<li>
								<label className="change-color">
									<strong className="label">Theme color:</strong>
									<button className={'dark color_pick' + (globalData.theme === 'dark' ? ' active' : '')} title="dark theme">{}</button>&nbsp;
									<button className={'light color_pick' + (globalData.theme === 'light' ? ' active' : '')} title="light theme">{}</button>
								</label>
							</li>
						</ul>
						<ul className="preferences_list">
							<li>
								{/*<input id="IsMode" type="checkbox" checked={this.state.IsMode} onChange={this._onChkChange.bind(this, "IsMode")}/>*/}
								{/*@Html.CheckBoxFor(m=>m.IsMode, new { @checked = Model.IsMode })*/}
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsMode", checked: IsMode}}>
									<strong className="label">Expert Mode:</strong>
								</CheckBox>
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsBettor", checked: IsBettor}}>
									<strong className="label">Active Player:</strong>
								</CheckBox>
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsTrade", checked: IsTrade}}>
									<strong className="label">Auto Trade:</strong>
								</CheckBox>
							</li>
						</ul>
					</section>
					<section className="section">
						<h3 className="section_user">Email Notifications:</h3>
						<hr/>
						<h4>Alt.Bet Promotions</h4>
						<ul className="preferences_list">
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "MailNews", checked: MailNews, alwaysUpdate: true}}
										  onChange={::this._saveCheckboxState}>
									<strong className="label">Send me Alt.Bet news and offers:</strong>
								</CheckBox>
							</li>
						</ul>
						<h4>Gameday Updates</h4>
						<ul className="preferences_list">
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "MailUpdates", checked: MailUpdates}}>
									<strong className="label">Send me updates on my upcoming games:</strong>
								</CheckBox>
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "MailActivity", checked: radioButtonsDisabled}}
										  onChange={::this._radioButtonsDisabling}>
									<strong className="label" style={{paddingRight: 20}}>
										Send me information on my activity:
										<span className="help">
											<span className="help_message w200">
												<strong>You will receive information on your played orders</strong>
											</span>
										</span>
									</strong>
								</CheckBox>
								<div className={'container' + (radioButtonsDisabled ? '' : ' inactive')} style={{marginLeft: 10}}>
									<label className="radio_button">
										<input type="radio" name="MailFrequency" value={'daily'}
											   defaultChecked={MailFrequency === 'daily' || MailFrequency === 'never'}
											   disabled={!radioButtonsDisabled}/>
										<span>daily</span>
									</label>
									<label className="radio_button">
										<input type="radio" name="MailFrequency" value={'weekly'}
											   defaultChecked={MailFrequency === 'weekly'}
											   disabled={!radioButtonsDisabled}/>
										<span>weekly</span>
									</label>
									<label className="radio_button">
										<input type="radio" name="MailFrequency" value={'monthly'}
											   defaultChecked={MailFrequency === 'monthly'}
											   disabled={!radioButtonsDisabled}/>
										<span>monthly</span>
									</label>
								</div>
							</li>
						</ul>
					</section>
					<section>
						<h3 className="section_user">Sms Notifications:</h3>
						<hr/>
						<h4>Gameday Updates</h4>
						<ul className="preferences_list">
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "SmsActivity", checked: SmsActivity, alwaysUpdate: true}}
										  onChange={::this._saveCheckboxState}>
									<strong className="label">Send me sms on my activity:</strong>
								</CheckBox>
							</li>
						</ul>
					</section>
					<div className="input_animate input--yoshiko submit_container">
						<input type="submit" value="Submit" className="btn wave submit" disabled={loading}/>
						<span className={`answer_message ${answerClass}`} dangerouslySetInnerHTML={{__html: answerMessage}}>{}</span>
					</div>
				</form>
            </div>;
    }

	/**
	 * save checkbox state if it changed, need to unchecked checkbox
	 * @param context - checkbox context
	 * @param event
	 * @private
	 */
	_saveCheckboxState(event, context)
	{
		this.state.serverData[context.name] = event.target.checked;
	}

	/**
	 * Disabled radiobuttons if checkbox unchecked
	 * @private
	 */
	_radioButtonsDisabling(event)
	{
		this.setState({...this.state, radioButtonsDisabled: event.currentTarget.checked})
	}

	/**
	 * @private
	 */
	_onChkChange(opt, ee)
	{
		// 0||console.log( 'ee', ee.target, ee.target.dataset, this.state );
		// 0||console.log( 'this.state.filters[ee.target.dataset.filter]', this.state.filters[ee.target.dataset.filter], this.state );
		this.state[opt] = !this.state[opt];
		this.setState({...this.state});
	}
}