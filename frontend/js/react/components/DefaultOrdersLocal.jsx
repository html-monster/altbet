/**
 * Created by Htmlbook on 09.06.2017.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import NewOrder from './sidebar/order/NewOrder.jsx'
import defaultOrderLocalActions from '../actions/OrderActions/defaultOrdersLocalActions';

class DefaultOrdersLocal extends React.PureComponent
{

	render()
	{
		const { actions, eventData, orderData, showOrder } = this.props;
		// console.log('actions:', actions);

		return <div className="order_container" style={showOrder && eventData.ID === orderData.ID ? {} : {display: 'none'}}>
			{
				showOrder && eventData.ID === orderData.ID &&
				<div className="order_wrapper">
					<NewOrder actions={actions} data={{
						ID: eventData.ID,
						EventTitle: eventData.EventTitle,
						Position: eventData.Positions,
						isMirror: orderData.isMirror,
						Orders: [{
							Price: orderData.Orders[0].Price,
							Side: orderData.Orders[0].Side,
							Symbol:{
								Exchange : eventData.Symbol.Exchange,
								Name: eventData.Symbol.Name,
								Currency: eventData.Symbol.Currency
							},
							Volume: orderData.Orders[0].Volume,
							Limit: true,
							NewOrder: true,
							isMirror: orderData.isMirror
						}]
					}}/>
				</div>
			}
		</div>
	}
}

export default connect(state => ({
		...state.defaultOrdersLocal,
	}),
	dispatch => ({
		actions: bindActionCreators(defaultOrderLocalActions, dispatch),
	})
)(DefaultOrdersLocal)