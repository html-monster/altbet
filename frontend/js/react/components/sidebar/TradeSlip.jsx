/**
 * Created by Htmlbook on 13.12.2016.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import DefaultOrders from './tradeSlip/DefaultOrders.jsx';
import ActiveTrader from './tradeSlip/ActiveTrader.jsx';
import * as defaultOrderActions from '../../actions/Sidebar/defaultOrderActions';

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
        // 0||console.log( 'this.props.data.isAllowAT', this.props.data.isAllowAT );
		const { data, defaultOrderActions, tradeSlip } = this.props;
        return <div className="tab_item" id="order">

			<DefaultOrders data={tradeSlip.orderNewData} actions={defaultOrderActions}/>

			{/* // BM: --------------------------------------------------- ACTIVE TRADER ---*/}
			{
				data.isAllowAT && <ActiveTrader cmpData={{...tradeSlip, ...data}}/>
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