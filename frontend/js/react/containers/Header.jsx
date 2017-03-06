/**
 * Created by Htmlbook on 28.02.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import headerActions from '../actions/headerActions.ts';
import AnimateOnUpdate from '../components/Animation';
import OddsConverter from '../models/oddsConverter/oddsConverter.js';


class Header extends React.Component
{
	constructor()
	{
		super();
		this.OddsConverterObj = new OddsConverter();
	}

	componentDidMount()
	{
		this.props.actions.onSocketMessage();
	}

	listSlide(toggle, event)
	{
		event.stopPropagation();

		if(toggle)
			$(this.refs.oddsList).slideToggle(200);
		else
			$(this.refs.oddsList).slideUp(200);
	}

	render()
	{
		const { actions, serverData } = this.props;
        const profitlost = serverData.Profitlost ? (serverData.Profitlost).toFixed(2) : "";

		if(serverData.GainLost != undefined){
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
								<span className="win-lost animated" data-verify={'Profitlost'}>P/L: <strong className={'animated ' + serverData.Profitlost < 0 ? 'lost' : 'win'}>
									{serverData.Profitlost >= 0 ?
										`$${profitlost}`
										:
										`($${profitlost.toString().replace('-', '')})`}
									</strong>
								</span>
							<span className="invested animated" data-verify={'Exposure'}>Exposure: <strong className="animated">${(Math.round10(serverData.Exposure, -2)).toFixed(2)}</strong></span>
							<span className="available animated" data-verify={'Available'}>Available: <strong className="animated">${Math.round10(serverData.Available, -2)}</strong></span>
						</AnimateOnUpdate>
						:
						''
				}
				{ ABpp.User.userIdentity ? <a className="my_order btn" href={ABpp.baseUrl + '/eng/home/positions-orders'}>My Positions | Orders</a> : ''}
				{ ABpp.User.userIdentity ? <a href={ABpp.baseUrl + '/eng/Account#/funds/deposit'} className="btn deposit">Deposit</a> : ''}
				{/*<button className="price_plan btn">Pricing Plans</button>*/}
				<div className="odds_converter select">
					<span className="active_selection active_odd btn wave" onClick={this.listSlide.bind(this, true)}>{this.OddsConverterObj.getSystemName()}</span>
					<ul className="select_list odds_list" ref="oddsList" onClick={this.listSlide.bind(this, false)}>
						<li onClick={actions.changeOddSystem.bind(null, 'Implied')}>Implied</li>
						<li onClick={actions.changeOddSystem.bind(null, 'Decimal')}>Decimal</li>
						<li onClick={actions.changeOddSystem.bind(null, 'American')}>American</li>
						<li onClick={actions.changeOddSystem.bind(null, 'Fractional')}>Fractional</li>
					</ul>
				</div>
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