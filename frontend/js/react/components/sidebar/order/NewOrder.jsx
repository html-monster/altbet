import React from 'react';
import OrderForm from './OrderForm.jsx';

import AnimateOnUpdate from '../../Animation.jsx';

export default class NewOrder extends React.Component{
	constructor()
	{
		super();
	}

	render()
	{
		// console.log(ABpp);
		const { data } = this.props;
		let formData = {
			url: ABpp.baseUrl + '/Order/Create',
			action: 'create'
		};

		return <div className="order_content new animated">
			<div className="order-title">
				<h3>{data.EventTitle}</h3>
				<span className="close" onClick={this.props.onDeleteOrderHandler}><span>{}</span></span>
				<strong className="current-order up">Number of Entries: <span>{data.Positions}</span></strong>
			</div>
			{
				data.Orders.map((item) =>
					<AnimateOnUpdate
						component="div"
						className={item.Side ? 'sell-container' : 'buy-container' + ' form_container'}
						key={`${item.Symbol.Exchange}_${item.Symbol.Name}_${item.Symbol.Currency}_${item.Side}`}
						transitionName={{
							appear: 'fadeInAnimation',
							enter: 'fadeInAnimation'
						}}
						transitionAppear={true}
						transitionLeave={false}
						transitionAppearTimeout={500}
						transitionEnterTimeout={500}
						data={item}
					>
						<OrderForm
							data={item}
							containerData={data}
							formData={formData}
							onOrderDelete={this.props.onDeleteOrderHandler.bind(null, item)}
							actions={this.props.actions}
							data-verify={['Price', 'Volume']}
						/>
					</AnimateOnUpdate>
				)
			}
		</div>
	}
}


