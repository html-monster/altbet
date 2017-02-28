/**
 * Created by Htmlbook on 28.02.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import headerActions from '../actions/headerActions.ts';
import AnimateOnUpdate from '../components/Animation';

class Header extends React.Component
{
	constructor()
	{
		super();
	}

	componentDidMount()
	{
		this.props.actions.onSocketMessage();
	}

	render()
	{
		const { serverData } = this.props;

		if(serverData.GainLost){
			serverData.Profitlost = serverData.GainLost;
			serverData.Exposure = serverData.Invested;
			serverData.Available= serverData.CurrentBalance;
		}

		return <div className="header_info">
			{/*<div className="video btn">*/}
				{/*<span className="title">Watch video</span>*/}
				{/*<button className="eng btn">Eng</button>*/}
				{/*<button className="ru btn">Ru</button>*/}
			{/*</div>*/}
			<div className="header_right">
				<span data-js-connect-label="" className="connect">{}</span>

				{
					ABpp.User.userIdentity ?
						<AnimateOnUpdate
							component="div"
							className={`user_info ${ABpp.User.userIdentity ? 'active' : ''}`}
							transitionName={{
								enter: 'fadeColorOut',
							}}
							transitionAppear={false}
							transitionLeave={false}
							transitionEnterTimeout={800}
							data={serverData}
						>
								<span className="win-lost animated" data-verify={'Profitlost'}>P/L: <strong className={'animated ' + serverData.Profitlost >= 0 ? 'win' : 'lost'}>
									{serverData.Profitlost >= 0 ?
										`$${(serverData.Profitlost).toFixed(2)}`
										:
										`($${(serverData.Profitlost).toFixed(2).toString().replace('-', '')})`}
									</strong>
								</span>
							<span className="invested animated" data-verify={'Exposure'}>Exposure: <strong className="animated">${Math.round10(serverData.Exposure, -2)}</strong></span>
							<span className="available animated" data-verify={'Available'}>Available: <strong className="animated">${Math.round10(serverData.Available, -2)}</strong></span>
						</AnimateOnUpdate>
						:
						''
				}
				{ ABpp.User.userIdentity ? <a className="my_order btn" href={ABpp.baseUrl + '/eng/home/positions-orders'}>My Positions | Orders</a> : ''}
				{ ABpp.User.userIdentity ? <a href={ABpp.baseUrl + '/eng/Account#/funds/deposit'} className="btn deposit">Deposit</a> : ''}
				{/*<button className="price_plan btn">Pricing Plans</button>*/}
				{/*<form className="header_form">*/}
					{/*<div className="select">*/}
						{/*<select className="language img" name="odds" id="change_language" style="width: 80px;">*/}
							{/*<option value="en" data-title="English">English</option>*/}
						{/*</select>*/}
					{/*</div>*/}
				{/*</form>*/}
			</div>
			<div className="user">
				{
					ABpp.User.userIdentity ?
						<div className="log_in">
							<ul className="user-menu">
								<li>
									<strong className="change-color">
										Theme color
										<button className="dark color_pick" title="dark theme">{}</button>
										<button className="light color_pick" title="light theme">{}</button>
									</strong>
								</li>
								<li><a href={ABpp.baseUrl + '/Account'}>Account</a></li>
								<li><a href={ABpp.baseUrl + '/Account/Logout'}>Log out</a></li>
							</ul>
							<span className="count_message">
								{/*<span className="count">99</span>*/}
							</span>
							<span className="user-name">{ABpp.User.login}</span>
						</div>
						:
						<div className="log_out">
							<a href="#login" className="sign_in">Join/Login</a>
							<div className="change-color">
								<strong>Theme color</strong>
								<button className="dark color_pick" title="dark theme">{}</button>
								{' '}
								<button className="light color_pick" title="light theme">{}</button>
							</div>
						</div>
				}
			</div>
			{/*<button className="chat">{}</button>*/}
		</div>
	}
}

export default connect(state => ({
		...state.header,
	}),
	dispatch => ({
		actions: bindActionCreators(headerActions, dispatch),
	})
)(Header)