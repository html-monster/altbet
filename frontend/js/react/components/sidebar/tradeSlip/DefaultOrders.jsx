/**
 * Created by Htmlbook on 19.12.2016.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import NewOrder from '../order/NewOrder.jsx'

import * as defaultOrderActions from '../../../actions/Sidebar/tradeSlip/defaultOrderActions';
import AnimateOnUpdate from '../../Animation.jsx';

class DefaultOrders extends React.Component
{
	constructor()
	{
		super();
	}

	render()
	{
		const { actions, cmpData: { traderOn }, data: { orderNewData } } = this.props;

		return <AnimateOnUpdate
				component="div"
				className="default_orders"
				style={traderOn ? {display: 'none'} : {}}
				transitionName={{
					appear: 'fadeInAnimation',
					enter: 'fadeInAnimation'
				}}
				transitionAppear={true}
				transitionLeave={false}
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				data={orderNewData}
			>
				{
					(orderNewData && !orderNewData.length) ?
						<p id="default_order_info" className="default_order_info animated">{ABpp.User.login ? "MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON ACTIVE BETTOR ABOVE." : "You must login to make orders"}</p>
						:
						/* // BM: --------------------------------------------------- NEW ORDER ---*/
						orderNewData.map((item) =>
							<NewOrder
								allData={orderNewData}
								data={item}
								key={`${item.ID}-${item.isMirror}-${item.Price}-${item.Volume}`}
								onDeleteOrderHandler={actions.actionOnDeleteOrder.bind(this, item)}
								actions={actions}
							/>
						)
				}
			</AnimateOnUpdate>
	}
}

export default connect(state => ({
		data: state.defaultOrders,
	}),
	dispatch => ({
		actions: bindActionCreators(defaultOrderActions, dispatch),
	})
)(DefaultOrders)