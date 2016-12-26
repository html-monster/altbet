import React from 'react';
import OrderForm from './OrderForm.jsx';

export default class NewOrder extends React.Component{
	constructor()
	{
		super();
	}

	render()
	{
		let data = this.props.data;
		let formData = {
			url: '/AltBet/eng/Order/Create',
			action: 'create'
		};
		// console.log(data);
		return <div className="order_content new" > {/*style={{display: 'none'}}*/}
			<div className="order-title">
				<h3>{data.EventTitle}</h3>
				<span className="close" onClick={this.props.onDeleteOrderHandler}><span>{}</span></span>
				<strong className="current-order up">pos: <span>{data.Positions}</span></strong>
			</div>
			{
				data.Orders.map((item) =>
					<div className={item.Side ? 'sell-container' : 'buy-container' + ' form_container'}
						 key={`${item.Symbol.Exchange}_${item.Symbol.Name}_${item.Symbol.Currency}_${item.Side}`}>
						<OrderForm
							data={item}
							containerData={data}
							formData={formData}
							onOrderDelete={this.props.onDeleteOrderHandler.bind(null, item)}
							actions={this.props.actions}
						/>
					</div>
				)
			}
		</div>
	}
}


