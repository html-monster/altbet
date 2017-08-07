/**
 * Created by Htmlbook on 13.12.2016.
 */
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import React from 'react';

import DefaultOrders from './tradeSlip/DefaultOrdersSidebar';
// import ActiveTrader from './tradeSlip/ActiveTrader';
import classnames from 'classnames';
// import tradeSlipActions from '../../actions/Sidebar/tradeSlipActions';
// import * as defaultOrderLocalActions from '../../actions/Sidebar/defaultOrderLocalActions';

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
        return <div className={classnames('tab_item', {active: data.activeTab !== 'YourOrders'})} id="order">
			<DefaultOrders cmpData={data} />

			{/*/!* // BM: --------------------------------------------------- ACTIVE TRADER ---*!/*/}
			{/*{*/}
				{/*ABpp.config.currentPage !== ABpp.CONSTS.PAGE_MYPOS && <ActiveTrader cmpData={data}/>*/}
			{/*}*/}

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