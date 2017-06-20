import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import OrderForm from './order/OrderForm.jsx';
import yourOrdersActions from '../../actions/Sidebar/yourOrderActions.ts';

class YourOrders extends React.Component
{
	constructor(props)
	{
		super();

		this.state = {data: props.data};
	}

	componentDidMount()
	{
		// window.ee.addListener('yourOrders.update', (newData) =>
		// {
			// newData = Object.assign(this.state.data, newData);
			// if(JSON.stringify(this.state.data) != JSON.stringify(newData)){
			// 	this.setState({data: newData});
			// 	console.log('re-render');
			// }
		// });
		this.props.actions.actionOnSocketMessage();
	}

	// handleOrderDelete(order, indexGr)
	// {
		// let orderId = order.ID;
		// let newData = this.state.data;
		//
		// newData[indexGr].Orders = newData[indexGr].Orders.filter((order) => order.ID !== orderId );
		// if(!newData[indexGr].Orders.length) newData.splice(indexGr, 1);
		// this.setState({ data: newData });
	// }

	render()
	{
		// let yourOrdersData = this.state.data;
		let yourOrdersData = this.props.yourOrders;
		return <div className="tab_item" id="current-orders">
			{
				ABpp.User.login ?
					yourOrdersData.yourOrders.length ?
						yourOrdersData.yourOrders.map((item, index) =>
						<GroupingOrder
								key={item.ID}
								indexGr={index}
								allData={yourOrdersData}
								data={item}
								//onOrderDelete={::this.props.actions.actionOrderDelete}
								actions={this.props.actions}
						/>)
					:
						<p className="default_order_info">You have no orders</p>
				:
					<p className="default_order_info">You must login to see your orders</p>
			}
		</div>
	}
}


// BM: GroupingOrder
class GroupingOrder extends React.Component
{
	render()
	{
		const { actions, data } = this.props;
		// let data = this.props.data;
		// let onOrderDelete = this.props.onOrderDelete;

		return <div className="order_content" id={data.ID}>
			<div className="my_order">
				<div className="order-title">
					<div className="container">
						<h3>{data.Symbol}</h3>
						{
							(data.LastSide) ?
								<strong className={`last-price ${data.LastSide ? 'down' : 'up'}`}>{(data.LastPrice).toFixed(2)}</strong>
							:
								''
						}
						<strong className="current-order up"> Total: <span>{data.Positions}</span></strong>
					</div>
				</div>
				<div className="order_info">
					<div className="container">
						<strong className="amount">Price</strong>
						<strong className="qty">Units</strong>
						<strong className="dt">Datetime</strong>
						<div className="button_container">{}</div>
					</div>
				</div>
				{
						data.Orders.map((item) =>
							<OrderItem
									key={item.ID}
									//allData={data}
									data={item}
									onDelete={actions.actionOrderDelete.bind(null, item, this.props.indexGr)}
									actions={actions}
							/>
						)
				}
			</div>
			<div className="pop_up">
				<div className="confirmation not-sort">
					<button className="yes btn">Delete</button>
					<button className="no btn">No</button>
				</div>
			</div>
		</div>
	}
}


// BM: OrderItem
class OrderItem extends React.Component
{
	constructor()
	{
		super();
		this.state = {currentOddSystem: ABpp.config.currentOddSystem}
	}

	showPopUp(){
		$(this.refs.deletePopUp).fadeIn();
	}

	showForm(){
		$(this.refs.formContainer).slideToggle(200);
	}

	hidePopUp(){
		$(this.refs.deletePopUp).fadeOut();
	}

	shouldComponentUpdate(nextProps){
		if(this.props.data.ID === nextProps.data.ID && this.props.data.Volume === nextProps.data.Volume &&
			this.state.currentOddSystem === ABpp.config.currentOddSystem)
			return false;

		this.state.currentOddSystem = ABpp.config.currentOddSystem;

		return true;
	}

	// successHandler(serverData)
	// {
	// 	console.log(serverData);
	// }

	render()
	{
		const { actions } = this.props;
		let data = this.props.data;
		//const allData = this.props.allData;
		const date = new Date(+data.Time.slice(6).slice(0, -2));
		const formData = {
			url: ABpp.baseUrl + '/Order/Edit',
			action: 'edit'
		};
		data.Price = data.isMirror ? Math.round10(1 - data.Price, -2) : Math.round10(data.Price, -2);
		const className = (data.isMirror) ?
											data.Side ? 'buy' : 'sell'
										:
											data.Side ? 'sell' : 'buy';

		return <div className="order_container not-sort" id={data.ID + '__order'}>
			<div className={'order_info ' + className}>
				<div className="container">
					<strong className="amount"> <span className="price">{(data.Price).toFixed(2)}</span></strong>
					<strong className="qty"> <span className="volume">{data.Volume}</span></strong>
					<strong className="dt timestamp help balloon_only">
		 				<span className="date">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</span>&nbsp;
                        <span className="time">{`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</span>
						<span className="help_message"><strong>MM/DD/YYYY HH:MM</strong></span>
					</strong>
					<div className="button_container">
						<button className="edit" title="edit or change the order" onClick={::this.showForm}>{}</button>
						<button className="delete" onClick={::this.showPopUp}>{}</button>
					</div>
				</div>

				<div className="pop_up" ref="deletePopUp">
					<div className="confirmation">
						<form action="/AltBet/eng/Order/Cancel" method="post"
									noValidate="novalidate" onSubmit={actions.actionOrderDeleteAjax.bind(null, this)} ref="deleteForm">
							<input name="id" type="hidden" value={data.ID}/>
							<button className="yes btn">Delete</button>
						</form>
						<button className="no btn" onClick={::this.hidePopUp}>No</button>
					</div>
				</div>
			</div>
			<div className={`form-container ${className}-container`} ref="formContainer">
				<OrderForm
					formUrl={formData.url}
					id={data.ID}
					limit={true}
					side={(data.isMirror) ?
						data.Side ? 'buy' : 'sell'
						:
						data.Side ? 'sell' : 'buy'}
					ask={data.Symbol.LastAsk === 1 ? null : data.Symbol.LastAsk}
					bid={data.Symbol.LastBid === 0 ? null : data.Symbol.LastBid}
					price={data.Price}
					quantity={data.Volume}
					isMirror={data.isMirror}
					symbol={`${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`}
					newOrder={false}
					showDeleteButton={false}
					onSubmit={actions.actionOnAjaxSend.bind(null, formData.url)}
						//data={data}
						//formData={formData}
						//actions={actions}
				/>
			</div>
		</div>
	}
}


export default connect(state => ({
		yourOrders: state.yourOrders,
	}),
	dispatch => ({
		actions: bindActionCreators(yourOrdersActions, dispatch),
	})
)(YourOrders)
