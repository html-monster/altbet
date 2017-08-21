/**
 * Created by Htmlbook on 28.02.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import headerActions from '../actions/headerActions.ts';
import sidebarActions from '../actions/sidebarActions.ts';
import AnimateOnUpdate from '../components/Animation';
import {CheckBox} from '../components/common/CheckBox';
import OddsConverterComp from '../components/OddsConverter';
import classnames from 'classnames';
// import {DropBox2} from '../components/common/DropBox2';


class Header extends React.Component
{
    /**@private*/ _userMenu;
    // /**@private*/ _OddsConverterObj;


	constructor(props)
	{
		super(props);
		// this._OddsConverterObj = new OddsConverterComp();
	}

	componentDidMount()
	{
		this.props.actions.actionSocketSubscribe();

		// 0||console.log( 'this.props', this.props );

		/** @var ABpp ABpp */ ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_BASIC_MODE, () => this.props.actions.actionSwitchBasicMode(ABpp.config.basicMode));
	}



    /**
     * Open login form
     * @public
     */
	loginClick(ee)
	{
        if( !ABpp.User.isAuthorized() )
        {
            ee.preventDefault();

            $(this.refs.loginBtn).click();
        } // endif
	}


	render()
	{
		let { actions, serverData, isBasicMode } = this.props;
        let $filter = appData.urlQuery ? appData.urlQuery.filter : '';

        __DEV__&&console.log( 'ABpp.condatefig.currentPage, ABpp.PAGE_MYPOS, ABpp', ABpp.config.currentPage, ABpp.PAGE_MYPOS, ABpp );

		if(serverData && serverData.GainLost !== undefined){
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
					<a href={globalData.Urls.Home + "?filter=live"}  className={"f_button f_but_before f_but_bor" + ($filter === 'live' ? ' active' : '')} onClick={::this.loginClick}><span>My Games</span></a>
					<a href={globalData.Urls.MyActivity + "#/history"} className={classnames("f_button f_but_before f_but_bor", {"active": ABpp.config.currentPage === ABpp.CONSTS.PAGE_MYPOS})} onClick={::this.loginClick}><span className="history_event">My History</span></a>
					<a href={globalData.Urls.TradingRules} className="f_button f_but_before"><span>Rules</span> </a>
				</div>
			</div>
			<div className="header_right">
				<div className="reconnect help balloon_only">
                	<button className="btn connect wave waves-effect waves-button" onClick={this._openSocket} data-js-connect-label="">{}</button>
					<div className="help_message w200 ce-bo">There is no connection to server now. <br />Click here for reconnect</div>
				</div>

				{
					ABpp.User.isAuthorized() ?
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
				{ ABpp.User.isAuthorized() ? <a href={ABpp.baseUrl + "/eng/Account/GidxWebCashierRegister?direction=Pay"} className="btn deposit wave waves-effect waves-button">Deposit</a> : ''}

				<OddsConverterComp/>

				<div className="user">
					{
						ABpp.User.userIdentity ?
							<div className="log_in active">
								<ul ref={(val) => this._userMenu = val} className="user-menu">
{/*
									<li>
										<strong className="change-color">
											Theme color
											<button className={'dark color_pick' + (globalData.theme === 'dark' ? ' active' : '')} title="dark theme">{}</button>
											<button className={'light color_pick' + (globalData.theme === 'light' ? ' active' : '')} title="light theme">{}</button>
										</strong>
									</li>
*/}
									<li><CheckBox data={{className: "item checkbox-v2-right", label: "Detailed View", checked: !isBasicMode}} onChange={::this._modeSwitch} /></li>
									<li><a href={ABpp.baseUrl + '/Account'}>Account</a></li>
									<li><a href={ABpp.baseUrl + '/Account/Logout'}>Log out</a></li>
								</ul>
								{/*
								 <span className="count_message">
								 /!*<span className="count">99</span>*!/
								 </span>
								 */}
								<span className="user-name" onClick={::this._onLoginClick}>{ABpp.User.login}</span>
							</div>
							:
							<div className="log_out active">
								<a ref="loginBtn" href="#login" className="sign_in">Join/Login</a>
{/*
								<div className="change-color">
									<strong>Theme color</strong>
									<button className={'dark color_pick' + (globalData.theme === 'dark' ? ' active' : '')} title="dark theme">{}</button>
									{' '}
									<button className={'light color_pick' + (globalData.theme === 'light' ? ' active' : '')} title="light theme">{}</button>
								</div>
*/}
							</div>
					}
				</div>

			</div>
			{/*<button className="chat">{}</button>*/}
		</div>
	}


	// _setCurrOddItem(inItems)
	// {
		// inItems.every((vv,kk) =>
		// {
		// 	if( vv.val == this._OddsConverterObj.getSystemName() )
		// 	{
		// 		inItems[kk].selected = true;
		// 		return false;
		// 	} // endif
		// 	return true;
		// });
		//
		// return inItems;
	// }


    /**
     * on login name click
     * @private
     */
    _onLoginClick()
    {
        $(this._userMenu).slideToggle().toggleClass('active');
    }


    /**
     * Switch mode to simple/detailed view
     * @private
     */
    _modeSwitch(ee, p1, isChecked, p3)
    {
        // 0||console.log( '{ee, p1, p2, p3}', {ee, p1, p2, p3} );
        // return;

        const checked = isChecked;
        const { sidebarActions } = this.props;

        if(checked)
        {
            globalData.basicMode = false;

			ABpp.config.basicMode = false;
			// ABpp.config.tradeOn = false;
			ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_BASIC_MODE);

			if(globalData.tradeOn) sidebarActions.actionOnTraderOnChange(checked);
		}
		else
		{
			globalData.basicMode = true;

			ABpp.config.basicMode = true;
			// ABpp.config.tradeOn = true;
			ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_BASIC_MODE);

			sidebarActions.actionOnTraderOnChange(checked);
		}
    }


    /**
     * Try to reconnect to socket
     * @private
     */
	_openSocket()
    {
        0||console.log( 'manual open' );
        ABpp.Websocket.connectSocketServer();
    }
}

export default connect(state => ({
		...state.header,
	}),
	dispatch => ({
		actions: bindActionCreators(headerActions, dispatch),
		sidebarActions: bindActionCreators(sidebarActions, dispatch),
	})
)(Header)
