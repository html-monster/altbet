'use strict';

import React from 'react';



export class TabMyOrderHistory extends React.Component
{
	constructor(props)
	{
        super();

        this.state = {data: props.data};
	}


	componentDidMount()
	{
		let self = this;
		window.ee.addListener('myOrderHistory.update', function(newData) {
			self.setState({data: newData});
		});
	}


	render()
	{
		let data = this.state.data;

		if (data.length) {
			return (
				<div className="tab_item">
					<div className="my_position_tab">
						<div className="wrapper">
							<div className="my_order_history table_content" id="my_order_history">
								<table>
									<thead>
										<tr>
											<th>Symbol</th>
											<th>Time</th>
											<th>Type</th>
											<th>Quantity</th>
											<th>Price</th>
											<th>Fees</th>
										</tr>
									</thead>
									<tbody>
									{
										data.map(function (item, key) {
											let date = new Date(+item.Time.slice(6).slice(0, -2));
											return (
													<tr className={(item.IsMirror ? (item.Side ? 'buy' : 'sell') : (item.Side ? 'sell' : 'buy'))}
															key={key}>
														<td>{(item.IsMirror ? item.Symbol.AwayName : item.Symbol.HomeName)}</td>
														<td>
															<span className="timestamp help">
																<span className="date">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`} | </span>
																<span className="time">{`${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</span>
																<span className="help_message"><strong>MM/DD/YYYY | HH:MM</strong></span>
															</span>
														</td>
														<td className="side">{(item.IsMirror ? (item.Side ? 'Long' : 'Short') : (item.Side ? 'Short' : 'Long'))}</td>
														<td className="quantity">{item.Quantity}</td>
														<td>{(item.IsMirror ? Math.round10(1 - item.Price, -2) : item.Price)}</td>
														<td><span
																className={(item.IsMaker ? 'up' : 'down')}>{(item.IsMaker ? (item.Fees).toFixed(4) : `($${(item.Fees).toFixed(4)})`)}</span>
														</td>
													</tr>
											)
										})
									}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (
				<p>order history is empty</p>
		);
	}
}
