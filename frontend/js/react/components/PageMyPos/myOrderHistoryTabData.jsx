'use strict';
// const React = require('react');

/*const historyItem = React.createClass({
	render: function() {
		// let mainData = this.props.mainData.Symbol;
		let data = this.props.data;
		let date = new Date(+data.Time.slice(6).slice(0, -2));
		let style = {marginLeft : 10};

		return(
				<tr className={'event-content content_bet ' +
				(data.isMirror ? (data.Side ? 'buy' : 'sell') : (data.Side ? 'sell' : 'buy'))}
						id={data.ID}>
					<td className="title">
						{(data.isMirror ? data.Symbol.AwayName : data.Symbol.HomeName)}
					</td>
					<td>
						<span className="date">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</span> |
						<span className="time">{`${date.getHours() - 2}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</span>
					</td>
					<td>{(data.isMirror ? (data.Side ? 'Buy' : 'Sell') : (data.Side ? 'Sell' : 'Buy'))}</td>
					<td className="quantity">{data.Volume}</td>
					<td>{(data.isMirror ? Math.round10(1 - data.Price, -2) : data.Price)}</td>
					<td>
						<span className={`${(data.isMirror ? (data.Side ? 'buy' : 'sell') : (data.Side ? 'sell' : 'buy'))} last_price`}>
							{data.isMirror ? Math.round10(1 - data.Symbol.LastPrice, -2) : data.Symbol.LastPrice}
						</span>
					</td>
					<td className={data.isPosition ? 'pos' : ''}>{}</td>
					<td>
						<button className="edit btn wave">Edit</button>
						<button className="delete btn wave" style={style}>Cancel</button>
					</td>
				</tr>
		);
	}
});*/

const MyOrderHistoryTabData = React.createClass({
	getInitialState: function() {
		return {
			data: this.props.data
		};
	},
	componentDidMount: function() {
		let self = this;
		window.ee.addListener('myOrderHistory.update', function(newData) {
			self.setState({data: newData});
		});
	},
	render: function() {
		let data = this.state.data;
		if (data.length) {
			return (
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
						data.map(function (item) {
							let date = new Date(+item.Time.slice(6).slice(0, -2));
							return (
									<tr className={(item.IsMirror ? (item.Side ? 'buy' : 'sell') : (item.Side ? 'sell' : 'buy'))}
											key={item.Time.slice(6).slice(0, -2)}>
										<td>{(item.isMirror ? item.Symbol.AwayName : item.Symbol.HomeName)}</td>
										<td>
											<span className="timestamp help">
												<span className="date">{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`} | </span>
												<span className="time">{`${date.getHours() - 2}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`}</span>
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
			)
		}
		return (
				<tr><td><p>order history is empty</p></td></tr>
		);
	}
});

module.exports = MyOrderHistoryTabData;