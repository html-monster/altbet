/**
 * Created by Htmlbook on 20.01.2017.
 */

import React from 'react';

import AccountBalance from './funds/AccountBalance';
import Deposit from './funds/Deposit';
import Withdraw from './funds/Withdraw';
import TransHistory from './funds/TransHistory';

export default class Funds extends React.PureComponent{
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
		var {header, active} = this.props.data;


		return <div className={"tab_item funds " + (active ? "active" : "")}>
			<h2>Funds</h2>
			{header}
			<div className="funds_tab">
				<div className="wrapper_user">
					<div className="tabs">
						<span className="tab btn wave active">Account Balance</span>
						<span className="tab btn wave">Deposit Funds</span>
						<span className="tab btn wave">Withdraw Funds</span>
						<span className="tab btn wave">Transaction History</span>
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

