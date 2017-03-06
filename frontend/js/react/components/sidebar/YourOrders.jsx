import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import OrderForm from './order/OrderForm.jsx';
import * as yourOrdersActions from '../../actions/Sidebar/yourOrderActions';

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
				ABpp.User.login != "" ?
					yourOrdersData.yourOrders.length ?
						yourOrdersData.yourOrders.map((item, index) =>
						<GroupingOrder
								key={item.ID}
								indexGr={index}
								allData={yourOrdersData}
								data={item}
								onOrderDelete={::this.props.actions.actionOnYourOrderDelete}
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

class GroupingOrder extends React.Component
{
	render()
	{
		let data = this.props.data;
		let onOrderDelete = this.props.onOrderDelete;

		return <div className="order_content" id={data.ID}>
			<div className="my_order">
				<div className="order-title">
					<div className="container">
						<h3>{data.Symbol}</h3>
						{
							(data.LastSide != null) ?
								<strong className={`last-price ${data.LastSide ? 'down' : 'up'}`}>{data.LastPrice}</strong>
							:
								''
						}
						<strong className="current-order up">pos: <span>{data.Positions}</span></strong>
					</div>
				</div>
				{
						data.Orders.map((item) =>
							<OrderItem
									key={item.ID}
									allData={data}
									data={item}
									onDelete={onOrderDelete.bind(null, item, this.props.indexGr)}
									actions={this.props.actions}
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

class OrderItem extends React.Component
{
	constructor()
	{
		super();
		this.state = {currentOddSystem: ABpp.config.currentOddSystem}
	}

	BeforeAjax()
	{
		$(this.refs.deleteForm).find('.btn').attr('disabled', true);
	}
	onSuccessAjax(data)
	{
		data = data.split('_');
		let id = '#' + data[0] + '__order';

		if(data[1] == 'True'){
			console.log($(id).parents('.order_content').find('h3').text() + ' order is deleted');

			this.props.onDelete();
		}
		else{
			console.log($(id).parents('.order_content').find('h3').text() + ' order isn\'t deleted');
			$(this.refs.deleteForm).find('.btn').removeAttr('disabled');
			defaultMethods.showError('Internal server error, try again later');
		}
	}

	onErrorAjax(x, y)
	{
		console.log('XMLHTTPRequest object: ', x);
		console.log('textStatus: ',  y);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}

	deleteOrderHandle(event)
	{
		event.preventDefault();
		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			callback: ::this.onSuccessAjax,
			onError: ::this.onErrorAjax,
			beforeSend: ::this.BeforeAjax,
			url: ABpp.baseUrl + '/Order/Cancel',
			context: $(this.refs.deleteForm)});
	}

	successHandler(serverData)
	{
		console.log(serverData);
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
		if(this.props.data.ID == nextProps.data.ID &&
			this.state.currentOddSystem == ABpp.config.currentOddSystem)
			return false;

		this.state.currentOddSystem = ABpp.config.currentOddSystem;

		return true;
	}

	render()
	{
		let data = this.props.data;
		let allData = this.props.allData;
		let date = new Date(+data.Time.slice(6).slice(0, -2));
		let formData = {
			url: ABpp.baseUrl + '/Order/Edit',
			action: 'edit'
		};
		let className = (data.isMirror) ?
											data.Side ? 'buy' : 'sell'
										:
											data.Side ? 'sell' : 'buy';

		return <div className="order_container not-sort" id={data.ID + '__order'}>
			<div className={'order_info ' + className}>
				<div className="container">
					<strong className="title">Price <span className="price">{data.isMirror ? (Math.round10(1 - data.Price, -2)).toFixed(2) :
							(Math.round10(data.Price, -2)).toFixed(2)}</span></strong>
					<strong className="title">Quantity <span className="volume">{data.Volume}</span></strong>
					<strong className="timestamp help balloon_only">
		 				<span className="date">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</span> | <span className="time">{
						`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</span>
						<span className="help_message"><strong>MM/DD/YYYY | HH:MM</strong></span>
					</strong>
					<div className="button_container">
						<button className="edit" title="edit or change the order" onClick={::this.showForm}>{}</button>
						<button className="delete" onClick={::this.showPopUp}>{}</button>
					</div>
				</div>

				<div className="pop_up" ref="deletePopUp">
					<div className="confirmation">
						<form action="/AltBet/eng/Order/Cancel" method="post"
									noValidate="novalidate" onSubmit={::this.deleteOrderHandle} ref="deleteForm">
							<input name="id" type="hidden" value={data.ID}/>
							<button className="yes btn">Delete</button>
						</form>
						<button className="no btn" onClick={::this.hidePopUp}>No</button>
					</div>
				</div>
			</div>
			<div className={`form-container ${className}-container`} ref="formContainer">
				<OrderForm
						allData={allData}
						data={data}
						formData={formData}
						onAjaxSuccess={::this.successHandler}
						actions={this.props.actions}
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

{/*<form action="/AltBet/Home/Edit" autoComplete="off" className={className} data-ajax="true" data-ajax-begin="ajaxControllerClass.OnBeginJs"*/}
			{/*data-ajax-failure="ajaxControllerClass.OnFailureJs" data-ajax-success="ajaxControllerClass.OnSuccessJs" data-ajax-url="/AltBet/Order/Edit"*/}
			{/*method="post" noValidate="novalidate">*/}
	{/*<div className="container">*/}
		{/*<div className="price ">*/}
			{/*<label>Your price</label>*/}
			{/*<div className="input">*/}
				{/*<input className="number" data-validation="0.33" maxLength="4" name="LimitPrice" type="text" autoComplete="off" defaultValue={data.Price}/>*/}
				{/*<div className="warning" style={{display: 'none'}}><p>Available value from 0.01 to 0.99</p></div>*/}
				{/*<div className="regulator">*/}
					{/*<span className="plus" title="Press Arrow Up">{}</span>*/}
					{/*<span className="minus" title="Press Arrow Down">{}</span>*/}
				{/*</div>*/}
			{/*</div>*/}
		{/*</div>*/}
		{/*<div className="volume ">*/}
			{/*<label>Quantity</label>*/}
			{/*<div className="input">*/}
				{/*<input className="number" data-validation="123" maxLength="7" name="Quantity" type="text" autoComplete="off" defaultValue={data.Volume}/>*/}
				{/*<div className="warning" style={{display: 'none'}}><p>Available integer value more than 0</p></div>*/}
				{/*<div className="regulator">*/}
					{/*<span className="plus" title="Press Arrow Up">{}</span>*/}
					{/*<span className="minus" title="Press Arrow Down">{}</span>*/}
				{/*</div>*/}
			{/*</div>*/}
		{/*</div>*/}
		{/*<div className="order_type ">*/}
			{/*<div className="obligations">*/}
				{/*<label>Sum</label>*/}
				{/*<div className="input">*/}
					{/*<input type="text" className="number" data-validation="40.59" maxLength="7" autoComplete="off"/>*/}
					{/*<div className="warning" style={{display: 'none'}}><p>Minimal available value 0.01</p></div>*/}
					{/*<div className="regulator">*/}
						{/*<span className="plus" title="Press Arrow Up">{}</span>*/}
						{/*<span className="minus" title="Press Arrow Down">{}</span>*/}
					{/*</div>*/}
				{/*</div>*/}
			{/*</div>*/}
		{/*</div>*/}
	{/*</div>*/}
	{/*<input name="ID" type="hidden" value={data.ID}/>*/}
	{/*<input name="Symbol" type="hidden" value={`${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`}/>*/}
	{/*<input name="isMirror" type="hidden" value={data.isMirror}/>*/}
	{/*<input name="Side" type="hidden" value={(className)[0].toUpperCase() + (className).slice(1)}/>*/}
	{/*<div className="container">*/}
		{/*<label className="checkbox">*/}
			{/*<input name="OrderType" type="checkbox" value="true" defaultChecked={true}/>*/}
			{/*<input name="OrderType" type="hidden" value="false"/><span>Limit</span>*/}
		{/*</label>*/}
		{/*<input type="submit" className={`btn ${className}`} value={className} style={{textTransform: 'uppercase'}}/>*/}
	{/*</div>*/}
{/*</form>*/}