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
			this.isAllowAT = false;
        }
        else
        {
        	this.isAllowAT = true;
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
    	// const isChecked = this.props.sidebar.traderOn;
        // 0||console.log( 'ABpp.User.settings.tradeOn', ABpp.User.settings.tradeOn );
		// console.log(ABpp.Websocket);
		// isChecked && ABpp.Websocket.sendSubscribe({tradeOn: isChecked}, SocketSubscribe.TRADER_ON);
		// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, isChecked);
        this.props.actions.actionOnTraderOnChange(ABpp.config.tradeOn);
    }


	render()
	{
		let userIdentity = this.state.globalData.userIdentity;
		const { isAllowAT } = this.state;
		const { actions, sidebar: { autoTradeOn, currentOddSystem, traderOn } } = this.props;
		// console.log('this.props:', this.props);
        // var {traderOn} = this.props.sidebar;
        // if( this.FLAG_LOAD  )
        // {
        //     traderOn = this.isAllowAT ? ABpp.User.settings.tradeOn : false;
        //     this.FLAG_LOAD = false;
        // } // endif

		return <div className="left_order">
			{
				isAllowAT &&
				<label htmlFor="ChkLimit" className={'trader ' + (userIdentity === 'True' ? '' : 'disabled')}>
					<input type="checkbox" id="ChkLimit" name="limit" className="limit" ref="chkTraderOn" checked={traderOn}
						   onChange={(ee) => actions.actionOnTraderOnChange(ee.target.checked)}
						   disabled={userIdentity !== 'True'}/>
					<span>
						Active Player
						<span className="help">
							<span className="help_message">
								<strong>The Active Player interface offers some slick, highly sophisticated, super user friendly, never offered before in the betting world, functionalities, so fasten your seatbelts and off you go to the market - fast!</strong>
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
						{/*<span className="help">*/}
							{/*<span className="help_message">*/}
								{/*<strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, vel?</strong>*/}
							{/*</span>*/}
						{/*</span>*/}
					</span>
				</label>
			}
			<div className="wrapper">
				<div className="tabs">
					<span className="tab active">{_t('TradeSlip')}</span>
					{
						ABpp.User.userIdentity ?
							<span className={'tab js-tab2' + (isAllowAT ? ' divide' : '')}>{_t('YourOrders')}</span>
							:
							<span className={'tab js-tab2' + (isAllowAT ? ' divide' : '')} data-disabled={true}>{_t('YourOrders')}</span>
					}
				</div>
				<div className="tab_content order-content">

					{/* // BM: --------------------------------------------------- TRADE SLIP ---*/}
					<TradeSlip data={{...this.props.sidebar, isAllowAT: this.isAllowAT}} />

					{/* // BM: --------------------------------------------------- YOUR ORDERS ---*/}
					<YourOrders currentOddSystem={currentOddSystem}/>
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
