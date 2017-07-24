import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import EventOrders from './sidebar/YourOrders.jsx';
// import NewOrder from './sidebar/order/NewOrder.jsx';
// import ActiveTrader from './sidebar/ActiveTrader.jsx';
import TradeSlip from './sidebar/TradeSlip';
import ActiveTrader from './Sidebar/tradeSlip/ActiveTrader';
import YourOrders from './sidebar/YourOrders';
import Disqus from './Disqus';
import sidebarActions from '../actions/sidebarActions.ts';
import classnames from 'classnames';
// import {OddsConverter} from '../models/oddsConverter/oddsConverter.ts';

// new OddsConverter('implied_probability');
// export default
class Sidebar extends React.Component
{
	constructor(props)
	{
		super();

		this.state = {
			globalData: globalData,
			isAllowAT: true
		};
        this.FLAG_LOAD = true;
        // 0||console.log( 'this.props.sidebar', props.sidebar );


        // allow AT
        if( ABpp.config.currentPage === ABpp.CONSTS.PAGE_MYPOS || ABpp.config.basicMode )
        {
            this.state.isAllowAT = false;
            ABpp.config.tradeOn = false;
			// globalData.tradeOn = false;
			// this.isAllowAT = false;
        }
        else
        {
        	// this.isAllowAT = true;
            this.state.isAllowAT = true;
        } // endif
        props.actions.actionChangeAllowAt(this.isAllowAT);
	}


	componentWillMount()
    {
        let data = ABpp.SysEvents.getLastNotifyData(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL);
        data && this.props.actions.actionOnActiveSymbolChanged(data);
		ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_CHANGE_ODD_SYSTEM, (props) => this.props.actions.actionOnOddSystemChange(props));
		ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, (props) => this.props.actions.actionOnActiveSymbolChanged(props));
		ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_BASIC_MODE, () => {
			// ABpp.config.tradeOn = false;
			// globalData.tradeOn = false;
			this.setState({...this.state, isAllowAT: !ABpp.config.basicMode})
		});
    }


	componentDidMount()
    {
		// let windowHeight = window.innerHeight,
		// 	windowWidth = window.innerWidth,
		// 	substructionHeight = $('.left_order .tabs').height() + 45 + $('header').height(),
		// 	orderSidebarHeight = windowHeight - substructionHeight,
		// 	orderContent = $('#order'),
		// 	currentOrders = $('#current-orders');

    	// const isChecked = this.props.sidebar.traderOn;
        // 0||console.log( 'ABpp.User.settings.tradeOn', ABpp.User.settings.tradeOn );
		// console.log(ABpp.Websocket);
		// isChecked && ABpp.Websocket.sendSubscribe({tradeOn: isChecked}, SocketSubscribe.TRADER_ON);
		// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, isChecked);
        this.props.actions.actionOnTraderOnChange(ABpp.config.tradeOn);
		if(ABpp.User.userIdentity)
		{
			ABpp.Websocket.sendSubscribe(1, window.SocketSubscribe.CURRENT_ORDERS);
			globalData.myOrdersOn = true;
		}

		// $(window).resize(function () {
		// 	windowWidth = window.innerWidth;
		// 	windowHeight = window.innerHeight;
		// 	if(windowWidth > 1200){
		// 		windowHeight = window.innerHeight;
		// 		orderSidebarHeight = windowHeight - substructionHeight;
		// 		orderContent.css('height', orderSidebarHeight);
		// 		currentOrders.css('height', orderSidebarHeight);
		// 	}
		// });
    }


	render()
	{
		const { isAllowAT } = this.state;
		const { actions, sidebar: { activeTab, autoTradeOn, currentOddSystem, traderOn } } = this.props;
		// console.log('this.props:', this.props);
        // var {traderOn} = this.props.sidebar;
        // if( this.FLAG_LOAD  )
        // {
        //     traderOn = this.isAllowAT ? ABpp.User.settings.tradeOn : false;
        //     this.FLAG_LOAD = false;
        // } // endif
// console.log('show:', (ABpp.User.userIdentity && !ABpp.config.basicMode) || ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS );

		return <div className="left_order">
			{/*{*/}
				{/*isAllowAT &&*/}
				{/*<label htmlFor="ChkLimit" className={'trader ' + (ABpp.User.userIdentity ? '' : 'disabled')}>*/}
					{/*<input type="checkbox" id="ChkLimit" name="limit" className="limit" ref="chkTraderOn" checked={traderOn}*/}
						   {/*onChange={(ee) => actions.actionOnTraderOnChange(ee.target.checked)}*/}
						   {/*disabled={!ABpp.User.userIdentity}/>*/}
					{/*<span>*/}
						{/*Active Player*/}
						{/*<span className="help">*/}
							{/*<span className="help_message">*/}
								{/*<strong>The Active Player interface offers some slick, highly sophisticated, super user friendly, never offered before in the betting world, functionalities, so fasten your seatbelts and off you go to the market - fast!</strong>*/}
							{/*</span>*/}
						{/*</span>*/}
					{/*</span>*/}
				{/*</label>*/}
			{/*}*/}
			{
				ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS && // костыль из-за разного отображения табов сайдбара
				activeTab === 'ActiveTrader' && traderOn && <label className="auto_trade">
					<input type="checkbox" className="auto" onChange={actions.actionOnAutoTradeChange} checked={autoTradeOn}/>
					<span>
						Auto trade
						{/*<span className="help">*/}
							{/*<span className="help_message">*/}
								{/*<strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, vel?</strong>*/}
							{/*</span>*/}
						{/*</span>*/}
					</span>
				</label>
			}
			<div className="wrapper">
				<div className={'tabs'}>
					{
						(ABpp.User.userIdentity && !ABpp.config.basicMode) && ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS &&
						<button className={classnames('custom tab', {active: activeTab === 'ActiveTrader'})} onClick={actions.tabSwitch.bind(null, actions, 'ActiveTrader')}>
							{ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS ? 'Active player' : 'Trade Slip'}
						</button>
					}
					<button className={classnames('custom tab js-tab2 ', {active: activeTab === 'YourOrders'},
						{divide: isAllowAT})} onClick={actions.tabSwitch.bind(null, actions, 'YourOrders')}>{_t('YourOrders')}</button>
					<button className={classnames('custom tab', {active: activeTab === 'Disqus'})} onClick={actions.tabSwitch.bind(null, actions, 'Disqus')}
							disabled={ABpp.config.currentPage === ABpp.CONSTS.PAGE_MYPOS}>{'Disqus'}</button>
				</div>
				<div className="tab_content order-content">
					{
						ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS ?
							// traderOn && !ABpp.config.basicMode &&
							<div className={classnames('tab_item animated dur3', {active: activeTab === 'ActiveTrader'}, {fadeIn: activeTab === 'ActiveTrader'})} id="order">

								{/*/!* // BM: --------------------------------------------------- ACTIVE TRADER ---*!/*/}
								<ActiveTrader cmpData={{...this.props.sidebar}}/>
							</div>
							:
							''//<TradeSlip data={{...this.props.sidebar}} />
					}

					{/* // BM: --------------------------------------------------- YOUR ORDERS ---*/}
					<YourOrders activeTab={activeTab} currentOddSystem={currentOddSystem}/>

					{/* // BM: --------------------------------------------------- DISQUS ---*/}
					{
						ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS &&
						<div className={classnames('tab_item animated dur3', {active: activeTab === 'Disqus'}, {fadeIn: activeTab === 'Disqus'})}>
							<Disqus appearance={!ABpp.config.tradeOn}/>
						</div>
					}
				</div>

			</div>
		</div>
	}

}

export default connect(state => ({
		sidebar: state.sidebar,
	}),
	dispatch => ({
		actions: bindActionCreators(sidebarActions, dispatch),
	})
)(Sidebar)
