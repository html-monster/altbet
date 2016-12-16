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
		return <div className="order_content new" > {/*style={{display: 'none'}}*/}
			<div className="order-title">
				<h3>{data.EventTitle}</h3>
				<a href="#" className="close"><span>{}</span></a>
				<strong className="current-order up">pos: <span>{data.Positions}</span></strong>
			</div>
			{
				data.Orders.map((item, index) =>
					<div className={item.Side ? 'sell-container' : 'buy-container' + ' form_container'} key={index}>
						<OrderForm
							data={item}
							formData={formData}
						/>
					</div>
				)
			}
			{/*<div className="buy-container form_container">*/}
				{/*<OrderForm*/}
					{/*data={data}*/}
					{/*formData={formData}*/}
				{/*/>*/}
			{/*</div>*/}
			{/*<div className="sell-container form_container">*/}
				{/*<OrderForm*/}
						{/*data={data}*/}
						{/*formData={formData}*/}
				{/*/>*/}
			{/*</div>*/}
		</div>
	}
}


