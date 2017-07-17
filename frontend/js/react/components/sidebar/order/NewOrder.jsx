import React from 'react';
import OrderForm from './OrderForm.jsx';

import AnimateOnUpdate from '../../Animation.jsx';
import classnames from 'classnames';
import { DateLocalization	 } from '../../../models/DateLocalization';


export default class NewOrder extends React.PureComponent
{
	shouldComponentUpdate(nextProps)
	{
		return !(JSON.stringify(nextProps) === JSON.stringify(this.props));
	}

	render()
	{
		// console.log(ABpp);
		const { actions, mainPageActions, data, localView } = this.props;
		let formData = {
			url: ABpp.baseUrl + '/Order/Create',
			action: 'create'
		};
		
		return <div className={classnames(`order_content new animated`, { local_view: localView })}>
			<div className="order-title">
				{
					!localView &&
					<h3>{data.EventTitle}</h3>
				}
				<button className="close close_blue" onClick={actions.actionOnDeleteOrder.bind(null, {data, mainPageActions})} title="Close window" ref={'closeButton'}/>
				{/*<span className="close" onClick={actions.actionOnDeleteOrder.bind(null, {data, mainPageActions})}><span>{}</span></span>*/}
				<strong className="current-order pos">Units: <span>{data.Positions}</span></strong>
			</div>
			{
				data.Orders.map((item) =>
				{
					const symbol = `${item.Symbol.Exchange}_${item.Symbol.Name}_${item.Symbol.Currency}`;

					return <AnimateOnUpdate
						component="div"
						className={'form_container'}
						key={`${symbol}_${item.Side}`}
						transitionName={{
							appear: 'fadeIn',
							enter: 'fadeIn'
						}}
						transitionAppear={true}
						transitionLeave={false}
						transitionAppearTimeout={500}
						transitionEnterTimeout={500}
						data={item}
					>
						<OrderForm
							formUrl={formData.url}
							id={`${symbol}_${item.Side}_${item.isMirror}`}
							limit={item.Limit}
							side={item.Side ? 'sell' : 'buy'}
							ask={data.Ask === 1 ? null : data.Ask}
							bid={data.Bid === 0 ? null : data.Bid}
							price={item.Price}
							priceDisabled={+moment().format('x') < (new DateLocalization).fromSharp(data.StartDate, 1, {TZOffset: false})}
							maxEntries={100}
							minPrice={data.minPrice ? data.minPrice : 0.5}
							remainingBal={95}
							quantity={item.Volume}
							isMirror={item.isMirror}
							symbol={symbol}
							startDate={(new DateLocalization).fromSharp(data.StartDate, 1, {TZOffset: false})}
							endDate={data.EndDate ? (new DateLocalization).fromSharp(data.EndDate, 1, {TZOffset: false}) : data.EndDate}
							ResultExchange={data.ResultExchange}
							newOrder={true}
							showDeleteButton={true}
							onSubmit={actions.actionOnAjaxSend.bind(null, {...item, formUrl: formData.url}, {defaultOrdersActions: actions, mainPageActions})}
							//onDelete={actions.actionOnDeleteOrder.bind(null, item)}
							//onTypeChange={actions.actionOnOrderTypeChange.bind(null, item)}
							// data={{...data, ...item}}
							//containerData={data}
							// formData={formData}
							// formSubmit={actions.actionOnAjaxSend.bind(null, this, data)}
							// onOrderDelete={this.props.onDeleteOrderHandler.bind(null, item)}
							// actions={actions}
							// showDeleteButton={true}
							//data-verify={['Price', 'Volume']}
						/>
					</AnimateOnUpdate>
				})
			}
		</div>
	}
}


