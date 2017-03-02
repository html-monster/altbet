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

		this.actions = props.actions;
	}


	componentDidMount()
	{
		// __DEV__&&console.debug( 'TradeSlip.props', this.props, this );
		this.props.actions.actionOnLoad(this);
	}


	/**
	 * @public
	 */
	createNewOrder(inData)
	{
		this.props.actions.actionOnOrderCreate(inData);
	}


	render()
	{
        // 0||console.log( 'this.props.data.isAllowAT', this.props.data.isAllowAT );
		const { data, actions, tradeSlip } = this.props;
        return <div className="tab_item" id="order">

			<DefaultOrders cmpData={{...tradeSlip, ...data}} data={tradeSlip.orderNewData} actions={actions}/>

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
		actions: bindActionCreators(defaultOrderActions, dispatch),
	})
)(TradeSlip)