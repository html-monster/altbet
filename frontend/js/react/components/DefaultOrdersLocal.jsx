/**
 * Created by Htmlbook on 09.06.2017.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import NewOrder from './sidebar/order/NewOrder.jsx'
import defaultOrderLocalActions from '../actions/OrderActions/defaultOrdersLocalActions';
import mainPageActions from '../actions/MainPageActions.ts';
import GlobalCloseClass from '../common/GlobalClose';

class DefaultOrdersLocal extends React.PureComponent
{
	componentDidMount()
	{
		(new GlobalCloseClass({element: this.refs.orderContainer,
			customCloseFunction: this.props.actions.actionOnDeleteOrder.bind(null, {mainPageActions: this.props.mainPageActions}),
			excludeElements: ['#DiMPMainpage button.event'],
			actionDelay: 0})).bindGlobalClick();
	}

	componentDidUpdate(prevProps)
	{
		if(this.props.showOrder && this.props.showOrder !== prevProps.showOrder)
		{
			(new GlobalCloseClass({element: this.refs.orderContainer,
				customCloseFunction: this.props.actions.actionOnDeleteOrder.bind(null, {mainPageActions: this.props.mainPageActions}),
				excludeElements: ['#DiMPMainpage button.event'],
				actionDelay: 0})).bindGlobalClick();
		}
	}

	render()
	{
		const { actions, mainPageActions, eventData, orderData, showOrder } = this.props;
		// console.log('actions:', actions);

		return <div className="order_container_local" style={showOrder && eventData.ID === orderData.ID ? {} : {display: 'none'}}
					id="mp-orderContainer"
					ref={'orderContainer'}
		>
			{
				showOrder && eventData.ID === orderData.ID &&
				<NewOrder actions={actions} mainPageActions={mainPageActions} localView={true}
						  data={{
							  ID        : eventData.ID,
							  EventTitle: eventData.EventTitle,
							  Positions : eventData.Positions,
							  isMirror  : orderData.isMirror,
							  Ask       : orderData.Ask,
							  Bid       : orderData.Bid,
							  StartDate : eventData.StartDate,
							  EndDate   : eventData.EndDate,
							  ResultExchange   : eventData.ResultExchange,
							  Orders    : [{
								  Price   : orderData.Orders[0].Price,
								  Side    : orderData.Orders[0].Side,
								  Symbol  : {
									  Exchange: eventData.Symbol.Exchange,
									  Name    : eventData.Symbol.Name,
									  Currency: eventData.Symbol.Currency
								  },
								  Volume  : orderData.Orders[0].Volume,
								  Limit   : true,
								  NewOrder: true,
								  isMirror: orderData.isMirror
							  }]
						  }}/>
			}
		</div>
	}
}

export default connect(state => ({
		...state.defaultOrdersLocal,
	}),
	dispatch => ({
		actions: bindActionCreators(defaultOrderLocalActions, dispatch),
		mainPageActions: bindActionCreators(mainPageActions, dispatch),
	})
)(DefaultOrdersLocal)