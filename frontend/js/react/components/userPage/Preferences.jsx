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
			loading: false
		}
	}

	sendData(event)
	{
		event.preventDefault();

		defaultMethods.sendAjaxRequest({
			context   : $(event.currentTarget),
			url       : appData.pageAccountPreferencesUrl,
			callback  : onSuccessAjax.bind(this),
			onError   : onErrorAjax.bind(this),
			beforeSend: beforeSend.bind(this)
		});

		function onSuccessAjax(error)
		{
			if(error){
				this.setState({
					answerMessage: error,
					answerClass: 'invalid_message',
					loading: false
				});
			}
			else
				this.setState({
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
				loading: true
			});
		}

		function onErrorAjax(x, y)
		{
			this.setState({
				answerMessage: 'The connection to the server has been lost. Please check your internet connection or try again.',
				answerClass: 'invalid_message',
				loading: false
			});
			console.log('XMLHTTPRequest object: ', x);
			console.log('textStatus: ',  y);
		}
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



    render()
    {
        const { IsMode, IsBettor, IsTrade } = appData.pageAccountData.Account;
        const { header, active } = this.props.data;
        const { answerMessage, answerClass, loading } = this.state;

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
									<strong>Theme color:</strong>
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
									<strong className="label">Expert mode on:</strong>
								</CheckBox>
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsBettor", checked: IsBettor}}>
									<strong className="label">Active bettor on:</strong>
								</CheckBox>
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsTrade", checked: IsTrade}}>
									<strong className="label">Auto trade on:</strong>
								</CheckBox>
							</li>
						</ul>
					</section>
					<section className="section">
						<h3 className="section_user">Mail Preferences</h3>
						<hr/>
						<ul className="preferences_list">
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "MailNews", checked: IsBettor}}>
									<strong className="label" style={{paddingRight: 20}}>
										Send me news and offers:
										{/*<span className="help">*/}
											{/*<span className="help_message"><strong>Subscribe to Alt.bet news and offers</strong></span>*/}
										{/*</span>*/}
									</strong>
								</CheckBox>
								{/*Новости и придложения от нашего сайта*/}
							</li>
							<li>
								<CheckBox data={{className: "checkbox checkbox_horizontal", name: "MailNotification", checked: IsBettor}}>
									<strong className="label" style={{paddingRight: 20}}>
										Send me results of my bets:
										{/*<span className="help">*/}
											{/*<span className="help_message"><strong></strong></span>*/}
										{/*</span>*/}
									</strong>
								</CheckBox>
								{/*прислать результаты сыгранных ставок*/}
							</li>
						</ul>
					</section>
					<div className="input_animate input--yoshiko submit_container">
						<input type="submit" value="Submit" className="btn wave" disabled={loading}/>
						<span className={`answer_message ${answerClass}`}>{answerMessage}</span>
					</div>
				</form>
            </div>;
    }
}