import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

// import OrderForm from './order/OrderForm.jsx';
import classnames from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {Collapse} from 'react-collapse';

import yourOrdersActions from '../../actions/Sidebar/yourOrderActions.ts';
import { DateLocalization } from '../../models/DateLocalization';

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
		this.props.actions.actionOnSocketMessage(this.props.actions);
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
		const { yourOrdersData, openGroupSymbol, activeExchange } = this.props;

		return <CSSTransitionGroup
			component="div"
			className={classnames('tab_item animated dur8', {active: this.props.activeTab === 'YourOrders'}, {fadeIn: this.props.activeTab === 'YourOrders'})}
			id="current-orders"
			transitionName={{
				enter : 'fadeInDown',
				leave : 'fadeInDown',
				appear: 'fadeInDown'
			}}
			transitionAppear={true}
			transitionLeave={false}
			transitionAppearTimeout={600}
			transitionEnterTimeout={600}
			transitionLeaveTimeout={500}
		>
			{
				ABpp.User.login ?
					yourOrdersData.length ?
						yourOrdersData.map((item) =>
							<GroupingOrder
								key={item.ID}
								openGroupSymbol={openGroupSymbol}
								activeExchange={activeExchange}
								data={item}
								//onOrderDelete={::this.props.actions.actionOrderDelete}
								actions={this.props.actions}
							/>)
						:
						<p className="default_order_info animated dur4">You have no orders</p>
					:
					<p className="default_order_info animated dur4">You must login to see your orders</p>
			}
		</CSSTransitionGroup>
	}
}


// BM: GroupingOrder
class GroupingOrder extends React.Component
{
	render()
	{
		const { actions, data, openGroupSymbol, activeExchange } = this.props;
		// let data = this.props.data;
		// let onOrderDelete = this.props.onOrderDelete;

		return <div className={classnames('order_content animated', {active: activeExchange === data.Orders[0].Symbol.Exchange})} id={data.ID}>
			<div className="my_order">
				<div className="order-title" onClick={actions.collapseOrderGroup.bind(null, data.Orders[0].Symbol.Exchange)}>
					<div className="container">
						<h3>{data.Orders[0].Symbol.FullName}</h3>
						{
							(data.LastSide) ?
								<strong className={`last-price ${data.LastSide ? 'down' : 'up'}`}>{(data.LastPrice).toFixed(2)}</strong>
							:
								''
						}
						<strong className="current-order pos"> Total: <span>{data.Positions}</span></strong>
					</div>
				</div>
				<Collapse isOpened={data.Orders[0].Symbol.Exchange === openGroupSymbol}>
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
									LimitUserData={data.LimitUserData}
									data={item}
									onDelete={actions.actionOrderDelete.bind(null, item, this.props.indexGr)}
									actions={actions}
								/>
							)
						}
				</Collapse>
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

	// showForm()
	// {
	// 	const isEventStarted = moment().format('x') > (new DateLocalization).fromSharp(this.props.data.Symbol.StartDate, 1, {TZOffset: false});
	//
	// 	if(isEventStarted)
	// 		$(this.refs.formContainer).slideToggle(200);
	// 	else
	// 		defaultMethods.showWarning('You can`t edit order before the game starts');
	// }

	shouldComponentUpdate(nextProps)
	{
		const { data, LimitUserData } = this.props;

		if(data.ID === nextProps.data.ID && data.Volume === nextProps.data.Volume &&
			this.state.currentOddSystem === ABpp.config.currentOddSystem && (LimitUserData &&
			LimitUserData.CurrentEntryBalance === nextProps.LimitUserData.CurrentEntryBalance &&
			LimitUserData.EntryLimit === nextProps.LimitUserData.EntryLimit))
			return false;

		this.state.currentOddSystem = ABpp.config.currentOddSystem;

		return true;
	}

	render()
	{
		const { actions, data } = this.props;
		const startDate = (new DateLocalization).fromSharp(data.Symbol.StartDate, 1, {TZOffset: false});
		const endDate = (new DateLocalization).fromSharp(data.Symbol.EndDate, 1, {TZOffset: false});

		// const formData = {
		// 	url: ABpp.baseUrl + '/Order/Edit',
		// 	action: 'edit'
		// };
		data.Price = data.isMirror ? Math.round10(1 - data.Price, -2) : Math.round10(data.Price, -2);
		const className = (data.isMirror) ?
											data.Side ? 'buy' : 'sell'
										:
											data.Side ? 'sell' : 'buy';


		return <div className={'order_container animated updateAnimation-active'} id={data.ID + '__order'}>
			<div className={'order_info ' + className}>
				<div className="container">
					<strong className="amount"> <span className="price">{(data.Price).toFixed(2)}</span></strong>
					<strong className="qty"> <span className="volume">{data.Volume}</span></strong>
					<strong className="dt timestamp help balloon_only">
		 				<span className="date">{(new DateLocalization).fromSharp(data.Time, 0).unixToLocalDate({format: 'MM/DD/YYYY'})}</span>&nbsp;
                        <span className="time">{(new DateLocalization).fromSharp(data.Time, 0).unixToLocalDate({format: 'hh:mm:ss a'})}</span>
						<span className="help_message"><strong>MM/DD/YYYY HH:MM:SS</strong></span>
					</strong>
					<div className="button_container">
						{/*<button className="edit" title="edit or change the order" onClick={::this.showForm}/>*/}
						<button className="delete" title="delete the order"
								onClick={() => actions.actionDeleteFormToggle(true, startDate, endDate, this.deletePopUp)}/>
					</div>
				</div>

				<div className="pop_up" ref={(popup) => this.deletePopUp = popup}>
					<div className="confirmation">
						<form method="post" onSubmit={actions.actionOrderDeleteAjax.bind(null, this)} ref={(form) => this.deleteForm = form}>
							<input name="id" type="hidden" value={data.ID}/>
							<button className="yes btn">Delete</button>
						</form>
						<button className="no btn"
								onClick={() => actions.actionDeleteFormToggle(false, null, null, this.deletePopUp)}>No</button>
					</div>
				</div>
			</div>
			{/*<div className={`form-container ${className}-container`} ref="formContainer">
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
					price={(data.Price).toFixed(2)}
					priceDisabled={+moment().format('x') < (new DateLocalization).fromSharp(data.Symbol.StartDate, 1, {TZOffset: false})}
					maxEntries={LimitUserData ? LimitUserData.EntryLimit : null}
					minPrice={data.Price}
					remainingBal={LimitUserData ? LimitUserData.EntryLimit - LimitUserData.CurrentEntryBalance : null}
					quantity={data.Volume}
					isMirror={data.isMirror}
					symbol={`${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`}
					startDate={(new DateLocalization).fromSharp(data.Symbol.StartDate, 1, {TZOffset: false})}
					endDate={data.Symbol.EndDate ? (new DateLocalization).fromSharp(data.Symbol.EndDate, 1, {TZOffset: false}) : data.Symbol.EndDate}
					OptionExchange={data.Symbol.OptionExchange}
					newOrder={false}
					showDeleteButton={false}
					onSubmit={actions.actionOnAjaxSend.bind(null, formData.url)}
						//data={data}
						//formData={formData}
						//actions={actions}
				/>
			</div>*/}
		</div>
	}
}


export default connect(state => ({
		...state.yourOrders,
	}),
	dispatch => ({
		actions: bindActionCreators(yourOrdersActions, dispatch),
	})
)(YourOrders)
