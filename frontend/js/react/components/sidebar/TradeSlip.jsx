/**
 * Created by Htmlbook on 13.12.2016.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import DefaultOrders from './tradeSlip/DefaultOrders.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';
import * as defaultOrderActions from '../../actions/Sidebar/defaultOrderActions.js';


class TradeSlip extends React.Component{
	constructor()
	{
		super();
	}

	render()
	{
		return <div className="tab_item" id="order">

			<DefaultOrders data={this.props.tradeSlip.orderNewData} actions={this.props.defaultOrderActions}/>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			<ActiveTrader data={{}}/>

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