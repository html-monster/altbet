/**
 * Created by Htmlbook on 13.12.2016.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import DefaultOrders from './tradeSlip/DefaultOrders.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';
import * as defaultOrderActions from '../../actions/Sidebar/defaultOrderActions.js';

class TradeSlip extends React.Component
{
	constructor(props)
	{
		super(props);
		// 0||console.log( 'TradeSlip props', props );

		this.actions = props.defaultOrderActions;
	}


	componentDidMount()
	{
		// __DEV__&&console.debug( 'TradeSlip.props', this.props, this );
		this.props.defaultOrderActions.actionOnLoad(this);
	}


	/**
	 * @public
	 */
	createNewOrder(inData)
	{
		this.props.defaultOrderActions.actionOnOrderCreate(inData);
	}


	render()
	{
        return <div className="tab_item" id="order">

			<DefaultOrders data={this.props.tradeSlip.orderNewData} actions={this.props.defaultOrderActions}/>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			{ this.props.data.isAllowAT && <ActiveTrader data={{}} cmpData={{...this.props.tradeSlip, activeExchange: this.props.data.activeExchange}} actions={this.actions}/>
			}

		</div>
	}
}

export default connect(state => ({
		tradeSlip: state.tradeSlip,
	}),
	dispatch => ({
		defaultOrderActions: bindActionCreators(defaultOrderActions, dispatch),
	})
)(TradeSlip)