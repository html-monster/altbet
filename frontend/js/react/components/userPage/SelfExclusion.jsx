/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';

import Select from 'react-select';

import {DropBox2} from '../common/DropBox2';


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


		function logChange(val) {
  		console.log("Selected: " + JSON.stringify(val.value));
		}


        return <div className={"tab_item self_exclusion " + (active ? "active" : "")}>
        <h2>Self Exclusion</h2>
			{header}

				{/*<form action={appData.pageAccountPreferencesUrl} className={loading ? 'loading' : ''} onSubmit={::this.sendData}>*/}
					{/*{<section className="section">}*/}
                        {/*<h4>Responsible Gaming Deposit limits</h4>*/}
                        {/*<span>Please note: <br /> Increasing of instanceof existing depaosit limit will take effect only after 72 hours*/}
                         {/*following request async part of our measures against compulsive trading. </span>*/}
                        {/*<ul className="preferences_list">*/}
							{/*<li>*/}
								{/*<div className={'container' } style={{marginLeft: 10}}>*/}
									{/*<label className="radio_button">*/}
										{/*<input type="radio" name="DepositLimit" value={'daily'}*/}
											   {/*defaultChecked={SelfExclusion === 'daily' || SelfExclusion === 'never'}*/}
											   {/*/>*/}
										{/*<span>daily</span>*/}
									{/*</label>*/}
									{/*<label className="radio_button">*/}
										{/*<input type="radio" name="DepositLimit" value={'weekly'}*/}
											   {/*defaultChecked={SelfExclusion === 'weekly'}*/}
											   {/*/>*/}
										{/*<span>weekly</span>*/}
									{/*</label>*/}
									{/*<label className="radio_button">*/}
										{/*<input type="radio" name="DepositLimit" value={'monthly'}*/}
											   {/*defaultChecked={SelfExclusion === 'monthly'}*/}
											   {/*/>*/}
										{/*<span>monthly</span>*/}
									{/*</label>*/}
									{/*<label className="radio_button">*/}
										{/*<input type="radio" name="DepositLimit" value={'noLimit'}*/}
											   {/*defaultChecked={SelfExclusion === 'noLimit'}*/}
											   {/*/>*/}
										{/*<span>No Limits</span>*/}
									{/*</label>*/}
								{/*</div>*/}
							{/*</li>*/}
						{/*</ul>*/}
						{/*<button type="submit"" className="save_button wave btn btn_yellow">ok</button>*/}
					{/*</section>*/}
				{/*</form>*/}
			<section>

				<form action={appData.pageAccountPreferencesUrl} className={'first_form'} onSubmit={::this.sendData}>

                        <h4>Monthly Deposit Limit</h4>
                        <h5>Set a monthly deposit limit. This limit cannot be changed for 90 days.</h5>
						<span className="alert_block">Block me if my monthly deposits reaches/exceeds</span>
                        <div className="time_container">
 							<DropBox2 name='MonthlyDeposit'
 							     items={[
								  { value: '1000', label: '$ 1,000'},
								  { value: '750', label: '$ 750'},
								  { value: '500', label: '$ 500'},
								  { value: '250', label: '$ 250'},
								  { value: '100', label: '$ 100'}]}
								 clearable={false}
								 value="1000"
								 placeholder="$ 1,000"
								 searchable={true}
								 afterChange={logChange} />

                            <button type="submit" className="save_button wave btn btn_yellow">Save</button>

                        </div>
				</form>
			</section>

        <section>			<form action={appData.pageAccountPreferencesUrl} onSubmit={::this.sendData}>

                        <h4>Entries Limits</h4>
						<h5>Set the max number of entries you want to enter each week.</h5>
						<span className="alert_block">Alert me if my total number of weekly entries reaches/exceeds</span>

                        <div className="time_container">
 							<DropBox2 name='alertEntriesLimits'
 							     items={[
 							      { value: 'none', label: 'No Alerts'},
								  { value: '100', label: 'Alert after 100 entries'},
								  { value: '50', label: 'Alert after 50 entries'},
								  { value: '20', label: 'Alert after 20 entries'},
								  { value: '10', label: 'Alert after 10 entries'},
								  { value: '5', label: 'Alert after 5 entries'}	]}
								 clearable={false}
								 value="None"
								 placeholder="No Alerts"
								 searchable={true}
								 afterChange={logChange} />
                            <button type="submit" className="save_button wave btn btn_yellow">Save</button>

                        </div>

				</form>

				<form action={appData.pageAccountPreferencesUrl} onSubmit={::this.sendData}>

                      <span className="alert_block">Block me if my total number of weekly entries reaches/exceeds</span>
                        <div className="time_container">

 							<DropBox2 name='blockEntriesLimits'
 							     items={[
								  { value: 'none', label: 'No Alerts'},
								  { value: '100', label: 'Block after 100 entries'},
								  { value: '50', label: 'Block after 50 entries'},
								  { value: '20', label: 'Block after 20 entries'},
								  { value: '10', label: 'Block after 10 entries'},
								  { value: '5', label: 'Block after 5 entries'}]}
								 clearable={false}
								 value="None"
								 placeholder="Don't block"
								 searchable={true}
								 afterChange={logChange} />
						<button type="submit" className="save_button wave btn btn_yellow">Save</button>
                        </div>

				</form>

		</section>


		<section>
		                <form action={appData.pageAccountPreferencesUrl} onSubmit={::this.sendData}>
                        <h4>Set Entry Fee Limit</h4>
						<h5>If you would like to limit yourself from playing our higher priced contests, set an entry fee limit below.</h5>
						<span className="alert_block">Alert me if the contest entry fee is equal to or greater than</span>

                        <div className="time_container">
 							<DropBox2 name='alert_Entry_Fee_Limit'
 							     items={[
								  { value: 'none', label: 'No Alerts'},
								  { value: '50', label: '$ 50'},
								  { value: '10', label: '$ 10'},
								  { value: '5', label: '$ 5'},
								 ]}
								 clearable={false}
								 value="None"
								 placeholder="No Alerts"
								 searchable={true}
								 afterChange={logChange} />
                            <button type="submit" className="save_button wave btn btn_yellow">Save</button>

                        </div>

				</form>

				<form action={appData.pageAccountPreferencesUrl} onSubmit={::this.sendData}>

                      <span className="alert_block">Block me if the contest entry fee is equal to or greater than</span>
                        <div className="time_container">
 							<DropBox2 name='block_Entry_Fee_Limit'
 							      items={[
								  { value: 'none', label: 'No Block'},
								  { value: '50', label: '$ 50'},
								  { value: '10', label: '$ 10'},
								  { value: '5', label: '$ 5'}]}
								 clearable={false}
								 value="None"
								 placeholder="Don't block"
								 searchable={true}
								 afterChange={logChange} />
						<button type="submit" className="save_button wave btn btn_yellow">Save</button>
                        </div>

				</form>

		</section>

    <section>

				<form action={appData.pageAccountPreferencesUrl}  onSubmit={::this.sendData}>
						<h4>Responsible Gaming Time out</h4>
						<h5> Self Exclusion </h5>
						<span className="alert_block for_cont_pass"> This will block you from using the site for 6 months this actions cannot be reversed under any circumstances</span>
                       <div className="time_container">
                           <span className="input_animate input--yoshiko pass_container Password">
					            <input className="input__field input__field--yoshiko" id="resp_time_pass"
									   name="Password" type="password"/>
					             <span className="show_password">{}</span>
					                <label className="input__label input__label--yoshiko" htmlFor="resp_time_pass">
						        <span className="input__label-content input__label-content--yoshiko" data-content="Current Password">Password</span>
					            </label>
					             <span className="validation-summary-errors">{}</span>
                            </span>
						<button type="submit" className="save_button wave btn btn_yellow">Save</button>
                       </div>
					</form>

    </section>
    <section>

				<form action={appData.pageAccountPreferencesUrl} onSubmit={::this.sendData}>
                        <h4>Time Out</h4>

                        <div className="pass_container">
                            <span className="input_animate input--yoshiko pass_container Password">
                            	<input className="input__field input__field--yoshiko" id="time_pass" name="Password" type="password"/>
					          		<span className="show_password">{}</span>
					          		<label className="input__label input__label--yoshiko" htmlFor="time_pass">
						        		<span className="input__label-content input__label-content--yoshiko" data-content="Current password">Password</span>
					            	</label>
					             	<span className="validation-summary-errors">{}</span>
							</span>
						</div>


                        <div className="time_container">
 							<DropBox2 name='SelfExclusion'
 							     items={[
								  { value: 'None', label: 'None' },
								  { value: '1 hr', label: '1 hr' },
								  { value: '3 hr', label: '3 hr' },
								  { value: '6 hr', label: '6 hr' },
								  { value: '12 hr', label: '12 hr' },
								  { value: '24 hr', label: '24 hr' },
								  { value: '48 hr', label: '48 hr' },
								  { value: '72 hr', label: '72 hr' },
								  { value: '1 week', label: '1 week' },
								  { value: '2 week', label: '1 week' },
								  { value: '1 month', label: '1 month' },
								  { value: '3 month', label: '3 month' }]}
								 clearable={false}
								 value="None"
								 searchable={true}
								 afterChange={logChange} />

						<button type="submit" className="save_button wave btn btn_yellow">Save</button>
                        </div>
				</form>
    </section>
            </div>;
    }

}