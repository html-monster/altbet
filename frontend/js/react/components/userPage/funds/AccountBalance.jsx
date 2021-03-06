/**
 * Created by Htmlbook on 20.01.2017.
 */

import React from 'react';

export default class AccountBalance extends React.Component
{
	constructor(props)
	{
		super();

		this.state = { data: props.staticData }
	}

	componentDidMount()
	{
		let UserAssets = this.state.data.UserAssets;
		// console.log(CurrentBalance);
		// console.log(UserAssets.CurrentBalance);
		window.ee.addListener('accountData.update', (newData) =>
		{
			const {CurrentBalance, Invested, GainLost} = UserAssets;
			// console.log(this.state.data.UserAssets);
			// console.log(newData);
			// console.log(UserAssets.CurrentBalance != newData.Available);
			if(CurrentBalance !== newData.Available) UserAssets.CurrentBalance = newData.Available;
			if(Invested !== newData.Exposure) UserAssets.Invested = newData.Exposure;
			if(GainLost !== newData.Profitlost) UserAssets.GainLost = newData.Profitlost;
			// console.log(CurrentBalance !== newData.Available);
			if(CurrentBalance !== newData.Available
				|| Invested !== newData.Exposure
				|| GainLost !== newData.Profitlost){
				this.setState(this.state);
				accountClass.balanceAnimation();
				__DEV__ && console.log('re-render');
			}
		});
	}

	render()
	{
		const data = this.state.data;
		// const { data, plan, payYearly, depositQuantity, pricePlan, sumValidation } = this.props.deposit;
		// const actions = this.props.actions;

		return <div className={"tab_item user_balance" + (this.props.active ? ' active' : '')}>
			<div className="color_map">
				<ul>
					<li className="pl">{_t("WinLoss")} = <span>$0</span></li>
					<li className="inv">{_t("AtStake")} = <span>$0</span></li>
					<li className="ava">{_t("Balance")} = <span>$0</span></li>
				</ul>
			</div>
			<div className="user_content balance">
				<span className="pl"><strong data-content={(data.UserAssets.GainLost).toFixed(2)}>{}</strong></span>
				<span className="inv"><strong data-content={(data.UserAssets.Invested).toFixed(2)}>{}</strong></span>
				<span className="ava"><strong data-content={(data.UserAssets.CurrentBalance).toFixed(2)}>{}</strong></span>
			</div>
		</div>
	}
}

