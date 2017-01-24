/**
 * Created by Htmlbook on 20.01.2017.
 */

import React from 'react';

import AccountBalance from './funds/AccountBalance';
import Deposit from './funds/Deposit';
import Withdraw from './funds/Withdraw';
import TransHistory from './funds/TransHistory';

export default class Funds extends React.Component{
	constructor()
	{
		super();
	}

	componentDidMount()
	{
		// this.props.actions.actionOnSocketMessage();
	}

	render()
	{
		// const { data, plan, payYearly, depositQuantity, pricePlan, sumValidation } = this.props.deposit;
		// const actions = this.props.actions;
		const staticData = appData.pageAccountData;

		return <div className="funds">
			<h2>Account</h2>
			<div className="user_info">
				<div className="personal_info">
					<h3 className="mail">{staticData.UserInfo.Email}</h3>
					<strong>{`${staticData.UserInfo.FirstName} ${staticData.UserInfo.LastName}`}</strong>
				</div>
			</div>
			<div className="funds_tab">
				<div className="wrapper_user">
					<div className="tabs">
						<span className="tab btn wave">Account Balance</span>
						<span className="tab btn wave">Deposit Funds</span>
						<span className="tab btn wave">Withdraw Funds</span>
						<span className="tab btn wave active">Transaction History</span>
					</div>
					<div className="tab_content">
						<AccountBalance staticData={staticData}/>
						<Deposit />
						<Withdraw />
						<TransHistory staticData={staticData} />
					</div>
				</div>
			</div>
		</div>
	}
}

