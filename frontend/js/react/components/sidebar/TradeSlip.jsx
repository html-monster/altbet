/**
 * Created by Htmlbook on 13.12.2016.
 */
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import React from 'react';

import DefaultOrders from './tradeSlip/DefaultOrders';
import ActiveTrader from './tradeSlip/ActiveTrader';
// import tradeSlipActions from '../../actions/Sidebar/tradeSlipActions';
// import * as defaultOrderActions from '../../actions/Sidebar/defaultOrderActions';

export default class TradeSlip extends React.Component
{
	constructor()
	{
		super();
		// 0||console.log( 'TradeSlip props', props );

		// this.actions = props.actions;
	}


	// componentDidMount()
	// {
	// 	// __DEV__&&console.debug( 'TradeSlip.props', this.props, this );
	// 	this.props.actions.actionOnLoad(this);
	// }



	render()
	{
        // 0||console.log( 'this.props.data.isAllowAT', this.props.data.isAllowAT );
		const { data, actions, tradeSlip } = this.props;
        return <div className="tab_item" id="order">

			<DefaultOrders cmpData={data} />

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			{
				data.isAllowAT && <ActiveTrader cmpData={data}/>
			}

		</div>
	}
}

// export default connect(state => ({
// 		tradeSlip: state.tradeSlip,
// 	}),
// 	dispatch => ({
// 		actions: bindActionCreators(tradeSlipActions, dispatch),
// 	})
// )(TradeSlip)