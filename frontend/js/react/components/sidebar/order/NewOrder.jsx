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
		return <div className="order_content new" style={{display: 'none'}} >
			<div className="order-title">
				<h3>New England Patriots</h3>
				<a href="#" className="close"><span>{}</span></a>
				<strong className="current-order up">pos: <span>TODO</span></strong>
			</div>
			<div className="buy-container form_container"></div>
			<div className="sell-container form_container">
				<OrderForm
						data={data}
						formData={formData}
				/>
			</div>
		</div>
	}
}


