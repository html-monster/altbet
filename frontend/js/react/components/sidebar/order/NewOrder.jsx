import React from 'react';
import OrderForm from './OrderForm.jsx';

import AnimateOnUpdate from '../../Animation.jsx';

export default class NewOrder extends React.PureComponent
{
	shouldComponentUpdate(nextProps)
	{
		return !(JSON.stringify(nextProps) === JSON.stringify(this.props));
	}

	render()
	{
		// console.log(ABpp);
		const { actions, data } = this.props;
		let formData = {
			url: ABpp.baseUrl + '/Order/Create',
			action: 'create'
		};

		return <div className="order_content new animated">
			<div className="order-title">
				<h3>{data.EventTitle}</h3>
				<span className="close" onClick={actions.actionOnDeleteOrder.bind(null, data)}><span>{}</span></span>
				<strong className="current-order up">Units: <span>{data.Positions}</span></strong>
			</div>
			{
				data.Orders.map((item) =>
				{
					const symbol = `${item.Symbol.Exchange}_${item.Symbol.Name}_${item.Symbol.Currency}`;

					return <AnimateOnUpdate
						component="div"
						className={item.Side ? 'sell-container' : 'buy-container' + ' form_container'}
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
							quantity={item.Volume}
							isMirror={item.isMirror}
							symbol={symbol}
							newOrder={true}
							showDeleteButton={true}
							onSubmit={actions.actionOnAjaxSend.bind(null, actions, {...item, formUrl: formData.url})}
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


