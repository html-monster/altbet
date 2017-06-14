/**
 * Created by Htmlbook on 19.12.2016.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import NewOrder from '../order/NewOrder.jsx'

import * as defaultOrderSidebarActions from '../../../actions/Sidebar/tradeSlip/defaultOrderSidebarActions';
import AnimateOnUpdate from '../../Animation.jsx';

class DefaultOrdersSidebar extends React.Component
{
	// shouldComponentUpdate(nextProps)
	// {
	// 	// return !(JSON.stringify(nextProps) === JSON.stringify(this.props));
	// 	if(this.props.data.orderNewData.length)
	// 	{
	// 		console.log('nextProps:', nextProps.data.orderNewData["0"].Orders["0"].Side);
	// 		console.log('this.props:', this.props.data.orderNewData["0"].Orders["0"].Side);
	// 	}
	// 	return true;
	// }

	render()
	{
		const { actions, cmpData: { traderOn }, data: { orderNewData } } = this.props;

		let message;
		switch (ABpp.config.currentPage)
		{
			case ABpp.CONSTS.PAGE_MYPOS:
				message = "MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE BUY/SEll BUTTON.";
				break;
			case ABpp.CONSTS.PAGE_EVENT:
				message = "MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE BUY/SEll BUTTON OR PRICES.";
				break;
			default:
				message = "MAKE YOUR SELECTION(S) ON THE LEFT BY CLICKING ON THE PRICES. OR TURN ON ACTIVE BETTOR ABOVE..";
		}

		return <AnimateOnUpdate
				component="div"
				className="default_orders"
				style={ABpp.config.currentPage !== 'PAGE_MYPOS' && traderOn ? {display: 'none'} : {}}
				transitionName={{
					appear: 'fadeIn',
					enter: 'fadeIn'
				}}
				transitionAppear={true}
				transitionLeave={false}
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				data={orderNewData}
			>
				{
					(orderNewData && !orderNewData.length) ?
						<p id="default_order_info" className="default_order_info animated">{ABpp.User.login ? message : "You must login to make orders"}</p>
						:
						/* // BM: --------------------------------------------------- NEW ORDER ---*/
						orderNewData.map((item) =>
							<NewOrder
								// allData={orderNewData}
								data={item}
								key={`${item.ID}-${item.isMirror}-${item.Price}-${item.Volume}`}
								//onDeleteOrderHandler={actions.actionOnDeleteOrder.bind(this, item)}
								actions={actions}
							/>
						)
				}
			</AnimateOnUpdate>
	}
}

export default connect(state => ({
		data: state.defaultOrdersSidebar,
	}),
	dispatch => ({
		actions: bindActionCreators(defaultOrderSidebarActions, dispatch),
	})
)(DefaultOrdersSidebar)