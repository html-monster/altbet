import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import EventOrders from './sidebar/YourOrders.jsx';
// import NewOrder from './sidebar/order/NewOrder.jsx';
// import ActiveTrader from './sidebar/ActiveTrader.jsx';
import TradeSlip from './sidebar/TradeSlip';
import YourOrders from './sidebar/YourOrders';
// import {OddsConverter} from '../models/oddsConverter/oddsConverter.ts';
import sidebarActions from '../actions/sidebarActions.ts';

// new OddsConverter('implied_probability');
// export default
class Sidebar extends React.Component
{
	constructor(props)
	{
		super();

		this.state = {globalData: globalData};
        this.FLAG_LOAD = true;
        // 0||console.log( 'this.props.sidebar', props.sidebar );


        // allow AT
        if( ABpp.config.currentPage != ABpp.CONSTS.PAGE_MYPOS )
        {
            this.isAllowAT = true;
        }
        else
        {
            this.isAllowAT = false;
            ABpp.config.tradeOn = false;
        } // endif
        props.actions.actionChangeAllowAt(this.isAllowAT);
	}


	componentWillMount()
    {
        let data = ABpp.SysEvents.getLastNotifyData(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL);
        data && this.props.actions.actionOnActiveSymbolChanged(data);
		ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_CHANGE_ODD_SYSTEM, (props) => this.props.actions.actionOnOddSystemChange(props));
		ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, (props) => this.props.actions.actionOnActiveSymbolChanged(props));
    }


	componentDidMount()
    {
    	// const isChecked = this.props.sidebar.traderOn;
        // 0||console.log( 'ABpp.User.settings.tradeOn', ABpp.User.settings.tradeOn );
		// console.log(ABpp.Websocket);
		// isChecked && ABpp.Websocket.sendSubscribe({tradeOn: isChecked}, SocketSubscribe.TRADER_ON);
		// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, isChecked);
        this.props.actions.actionOnTraderOnChange(this.props.sidebar.traderOn);
    }


	render()
	{
		let userIdentity = this.state.globalData.userIdentity;
		const { actions, sidebar: { autoTradeOn, isAllowAT, traderOn } } = this.props;
        // var {traderOn} = this.props.sidebar;
        // if( this.FLAG_LOAD  )
        // {
        //     traderOn = this.isAllowAT ? ABpp.User.settings.tradeOn : false;
        //     this.FLAG_LOAD = false;
        // } // endif

		return <div className="left_order">
			{
				isAllowAT &&
				<label htmlFor="ChkLimit" className={'trader ' + (userIdentity == 'True' ? '' : 'disabled')}>
					<input type="checkbox" id="ChkLimit" name="limit" className="limit" ref="chkTraderOn" checked={traderOn}
						   onChange={(ee) => actions.actionOnTraderOnChange(ee.target.checked)}
						   disabled={userIdentity != 'True'}/>
					<span>
						Active bettor
						<span className="help">
							<span className="help_message">
								<strong>The Active Bettor interface offers some slick, highly sophisticated, super user friendly, never offered before in the betting world, functionalities, so fasten your seatbelts and off you go to the market - fast!</strong>
							</span>
						</span>
					</span>
				</label>
			}
			{
				isAllowAT && traderOn && <label className="auto_trade">
					<input type="checkbox" className="auto" onChange={actions.actionOnAutoTradeChange} checked={autoTradeOn}/>
					<span>
						Auto trade
						<span className="help">
							<span className="help_message">
								<strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, vel?</strong>
							</span>
						</span>
					</span>
				</label>
			}
			<div className="wrapper">
				<div className="tabs">
					<span className="tab active">Trade Slip</span>
					{
						ABpp.User.userIdentity ?
							<span className="tab js-tab2">Your Orders</span>
							:
							<span className="tab js-tab2" data-disabled={true}>Your Orders</span>
					}
				</div>
				<div className="tab_content order-content">

					{/* // BM: --------------------------------------------------- TRADE SLIP ---*/}
					<TradeSlip data={{...this.props.sidebar, isAllowAT}} />

					{/* // BM: --------------------------------------------------- YOUR ORDERS ---*/}
					<YourOrders/>
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