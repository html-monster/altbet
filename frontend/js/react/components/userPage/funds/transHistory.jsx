/**
 * Created by Htmlbook on 20.01.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import * as actions from '../../../actions/userPage/transHistoryActions';
import {DateLocalization} from '../../../models/DateLocalization';


class TransHistory extends React.Component{
	constructor(props)
	{
		super();

		props.actions.actionOnLoad();
	}

	componentDidMount()
	{
		let {data, actions} = this.props;

		$(this.refs.datePicker).daterangepicker({
			locale: {
				format: 'MM/DD/YYYY',
			},
			autoApply: true,
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(7, 'days'), moment()],
				'Last 30 Days': [moment().subtract(30, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
				'This Year': [moment().startOf('year'), moment().endOf('year')],
				'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
			},
			startDate: moment(data.rangeFilter.from).format('MM/DD/YYYY'),//moment().subtract(1, 'month').format('MM/DD/YYYY'),
			endDate: moment(data.rangeFilter.to).format('MM/DD/YYYY')//moment().add(1, 'month').format('MM/DD/YYYY')
		}, actions.actionSetDateFilter);
	}

	listSlide(toggle, event)
	{
		event.stopPropagation();
		if(toggle)
			$(this.refs.paymentList).slideToggle(200);
		else
			$(this.refs.paymentList).slideUp(200);
	}

	render()
	{
		const { data, actions } = this.props;
		// const actions = this.props.actions;
		const Localization = new DateLocalization;

		return <div className="tab_item history" onClick={this.listSlide.bind(this, false)}>
			<div className="filter">
				<span className="input_animate input--yoshiko">
					<input className="input__field input__field--yoshiko datePickerJs hasDatepicker" id="payment_range" name="DateOfBirth" type="text" ref={'datePicker'} />
					<label className="input__label input__label--yoshiko" htmlFor="payment_range">
						<span className="input__label-content input__label-content--yoshiko" data-content="Choose date range">Choose date range</span>
					</label>
				</span>
				<div className="payment_filter select">
					<span className="active_selection active_filter btn wave" onClick={this.listSlide.bind(this, true)}>{data.paymentFilter}</span>
					<ul className="select_list" ref="paymentList" onClick={this.listSlide.bind(this, false)}>
						<li onClick={actions.actionSetPaymentFilter.bind(this, 'All')}>All</li>
						<li onClick={actions.actionSetPaymentFilter.bind(this, 'Visa MC')}>Visa MC</li>
						<li onClick={actions.actionSetPaymentFilter.bind(this, 'Skrill')}>Skrill</li>
						<li onClick={actions.actionSetPaymentFilter.bind(this, 'Neteller')}>Neteller</li>
						<li onClick={actions.actionSetPaymentFilter.bind(this, 'Ecopayz')}>Ecopayz</li>
					</ul>
				</div>
			</div>
			<div className="payment_history">
				<table>
					<thead>
						<tr>
							<th>Deposit/Withdraw</th>
							<th>Date</th>
							<th>Payment System</th>
							<th>Amount</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{
							(data.transHistory.filter((item)=>(data.rangeFilter.from <= item.date && data.rangeFilter.to >= item.date) &&
							(data.paymentFilter === item.system || data.paymentFilter === 'All')).length)
									?
										data.transHistory.map((item, index) =>
											(data.rangeFilter.from <= item.date && data.rangeFilter.to >= item.date) &&
											(data.paymentFilter === item.system || data.paymentFilter === 'All') &&
											<tr className={item.direction} key={`${item.system}_${item.date}_${item.amount}_${index}`}>
												<td>{item.direction}</td>
												<td>
													{moment(item.date).format('MM/DD/YYYY')} <span style={{opacity: 0.7}}>
													{Localization.unixToLocalDate({timestamp: item.date, format:'HH:mm'})}</span>
												</td>
												<td><span className={`payment ${item.system}`}>{}</span></td>
												<td className="amount">${item.amount}</td>
												<td className={item.status}>{item.status}</td>
											</tr>
										)
									:
								<tr className="empty"><td>There are no payment transactions</td></tr>
						}
					</tbody>
				</table>
			</div>
			<a href={`${ABpp.baseUrl}/payment/export2csv`} className="csv link load_btn left download" target="_blank">Download CSV</a>
		</div>
	}
}

export default connect(state => ({
		data: state.transHistory,
	}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	})
)(TransHistory)