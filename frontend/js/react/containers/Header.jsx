/**
 * Created by Htmlbook on 28.02.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import headerActions from '../actions/headerActions.ts';
import AnimateOnUpdate from '../components/Animation';
import OddsConverter from '../models/oddsConverter/oddsConverter.js';
import {DropBox} from '../components/common/DropBox';


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


	testSockOpen()
    {
        0||console.log( 'manual open' );
        ABpp.Websocket.connectSocketServer();
    }


	testSockClose()
    {
        0||console.log( 'manual close' );
        ABpp.Websocket.testClose();
    }


	render()
	{
		const { actions, serverData } = this.props;
        let $filter = appData.urlQuery ? appData.urlQuery.filter : '';

		if(serverData.GainLost !== undefined){
			serverData.Profitlost = serverData.GainLost;
			serverData.Exposure = serverData.Invested;
			serverData.Available= serverData.CurrentBalance;
		}
        const profitlost = serverData.Profitlost;

        return <div className="header_info">
			{/*<div className="video btn">*/}
				{/*<span className="title">Watch video</span>*/}
				{/*<button className="eng btn">Eng</button>*/}
				{/*<button className="ru btn">Ru</button>*/}
			{/*</div>*/}
			<div className="header_left">
				<div className="logo-container">
					<a className="logo" href={globalData.Urls.Home}> </a>
				</div>
				<div className="fast_menu">
					<a href={globalData.Urls.Home} className={`f_button f_but_bor${globalData.action === 'index' && globalData.controller === 'home' && $filter !== 'live' ? " active" : ''}`}><span>Exchange</span> </a>
					<a href={globalData.Urls.Home + "?filter=live"}  className={"f_button f_but_before f_but_bor" + ($filter === 'live' ? ' active' : '')}><span>My Games</span></a>
					<a href="#" className="f_button f_but_before f_but_bor"><span className="history_event">My History</span></a>
					<a href={globalData.Urls.TradingRules} className="f_button f_but_before"><span>Rules</span> </a>
				</div>
			</div>
			<div className="header_right">
				<div className="reconnect help balloon_only">
                	<button className="btn connect wave waves-effect waves-button" onClick={() => this.testSockOpen()} data-js-connect-label="">{}</button>
					<div className="help_message w200 ce-bo">There is no connection to server now. <br />Click here for reconnect</div>
				</div>

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
								<span className="win-lost animated" data-verify={"Profitlost"}>{_t("WinLoss")}: <strong className={'animated ' + (serverData.Profitlost < 0 ? 'lost' : 'win')}>
									{serverData.Profitlost >= 0 ?
										`$${profitlost.toFixed(2)}`
										:
										`($${(Math.abs(profitlost)).toFixed(2)})`}
									</strong>
								</span>
							<span className="invested animated" data-verify={'Exposure'}>{_t("AtStake")}: <strong className="animated">${(Math.round10(serverData.Exposure, -2)).toFixed(2)}</strong></span>
							<span className="available animated" data-verify={'Available'}>{_t("Balance")}: <strong className="animated">${(Math.round10(serverData.Available, -2)).toFixed(2)}</strong></span>
						</AnimateOnUpdate>
						:
						''
				}
                { ABpp.User.isAuthorized() && ABpp.User.login === 'bot' ? <button className="btn wave waves-effect waves-button" onClick={() => this.testSockClose()} title="Dissconnect from socket">D</button> : ''}


				{ ABpp.User.isAuthorized() ? <a className="my_order btn wave waves-effect waves-button" href={globalData.Urls.MyActivity}>My Activity</a> : ''}
				{ ABpp.User.isAuthorized() ? <a href={ABpp.baseUrl + '/eng/Account#/funds/deposit'} className="btn deposit wave waves-effect waves-button">Deposit</a> : ''}
				{/*<button className="price_plan btn">Pricing Plans</button>*/}
				{/*<DropBox className="odds_converter" name={name} items={this._setCurrOddItem([{key: 'Implied', val: 'Implied'}, {key: 'Decimal', val: 'Decimal'}, {key: 'American', val: 'American'}, {key: 'Fractional', val: 'Fractional'}])} hint="This feature shows values in different odds, while pointing at the values in Trade Slip or Active Bettor" afterChoose={(props) => actions.changeOddSystem(props.val)} />*/}
				<DropBox className="odds_converter" name={name} items={this._setCurrOddItem([{val: 'Implied'}, {val: 'Decimal'}, {val: 'American'}, {val: 'Fractional'}])} hint="This feature shows values in different odds, while pointing at the values in Trade Slip or Active Bettor" afterChoose={(props) => actions.changeOddSystem(props.val)} />

				{/*<div className="odds_converter select" title="This feature shows values in different odds, while pointing at the values in Trade Slip or Active Bettor ">
					<span className="active_selection active_odd btn wave" onClick={this.listSlide.bind(this, true)}>{this.OddsConverterObj.getSystemName()}<i>{}</i></span>
					<ul className="select_list odds_list" ref="oddsList" onClick={this.listSlide.bind(this, false)}>
						<li onClick={actions.changeOddSystem.bind(null, 'Implied')}>Implied</li>
						<li onClick={actions.changeOddSystem.bind(null, 'Decimal')}>Decimal</li>
						<li onClick={actions.changeOddSystem.bind(null, 'American')}>American</li>
						<li onClick={actions.changeOddSystem.bind(null, 'Fractional')}>Fractional</li>
					</ul>
				</div>*/}
				<div className="user">
					{
						ABpp.User.userIdentity ?
							<div className="log_in active">
								<ul className="user-menu">
									<li>
										<strong className="change-color">
											Theme color
											<button className={'dark color_pick' + (globalData.theme === 'dark' ? ' active' : '')} title="dark theme">{}</button>
											<button className={'light color_pick' + (globalData.theme === 'light' ? ' active' : '')} title="light theme">{}</button>
										</strong>
									</li>
									<li><a href={ABpp.baseUrl + '/Account'}>Account</a></li>
									<li><a href={ABpp.baseUrl + '/Account/Logout'}>Log out</a></li>
								</ul>
								{/*
								 <span className="count_message">
								 /!*<span className="count">99</span>*!/
								 </span>
								 */}
								<span className="user-name">{ABpp.User.login}</span>
							</div>
							:
							<div className="log_out active">
								<a href="#login" className="sign_in">Join/Login</a>
								<div className="change-color">
									<strong>Theme color</strong>
									<button className={'dark color_pick' + (globalData.theme === 'dark' ? ' active' : '')} title="dark theme">{}</button>
									{' '}
									<button className={'light color_pick' + (globalData.theme === 'light' ? ' active' : '')} title="light theme">{}</button>
								</div>
							</div>
					}
				</div>

			</div>
			{/*<button className="chat">{}</button>*/}
		</div>
	}


	_setCurrOddItem(inItems)
	{
		inItems.every((vv,kk) =>
		{
			if( vv.val == this.OddsConverterObj.getSystemName() )
			{
				inItems[kk].selected = true;
				return false;
			} // endif
			return true;
		});

		return inItems;
	}
}

export default connect(state => ({
		...state.header,
	}),
	dispatch => ({
		actions: bindActionCreators(headerActions, dispatch),
	})
)(Header)
