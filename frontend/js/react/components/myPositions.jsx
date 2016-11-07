'use strict';
// const React = require('react');

const PosItem = React.createClass({
	render: function() {
		let mainData = this.props.mainData.Symbol;
		let itemData = this.props.itemData;
		let plClass;
		let style = {marginLeft : 10};
		if(itemData.CommonProfitLoss < 0)
			plClass = 'loss';
		else if(itemData.CommonProfitLoss > 0)
			plClass = 'profit';

		return(
				<tr className={'event-content content_bet ' +
						(itemData.IsMirror ? (itemData.Side ? 'sell revers' : 'buy revers') : (itemData.Side ? 'sell' : 'buy'))}
						data-symbol={itemData.ID + (itemData.IsMirror ? '_mirror' : '')}>
					<td>
						<strong className="title">{itemData.EventName}</strong>
						<span className="hidden symbol_name">{itemData.ID}</span>
					</td>
					<td className="side">{(itemData.Side ? 'Short' : 'Long')}</td>
					<td className="quantity">{itemData.CommonVolume}</td>
					<td className="avg_price">{(itemData.IsMirror ? Math.round10(1 - itemData.AvgPrice, -2) : Math.round10(itemData.AvgPrice, -2))}</td>
					<td className="spread">
						<span className="sell">{(itemData.IsMirror ? Math.round10(1 - mainData.LastAsk, -2) : mainData.LastBid)}</span> |
						<span className="buy"> {(itemData.IsMirror ? Math.round10(1 - mainData.LastBid, -2) : mainData.LastAsk)}</span>
					</td>
					<td className={'pl ' + plClass}>{(itemData.CommonProfitLoss < 0) ? '$(' + (itemData.CommonProfitLoss).toString().slice(1) + ')' : '$' + itemData.CommonProfitLoss}</td>
					<td>
						<span className="buy"><button className="buy btn event wave empty btnJs">Buy</button></span>
						<span className="sell" style={style}><button className="sell btn event wave empty btnJs">Sell</button></span>
					</td>
				</tr>
		);
	}
});

const MyPositionOrders = React.createClass({
	render: function() {
		let data = this.props.data;
		let plClass;
		if(data.CommonSymbolProfitLoss < 0)
			plClass = 'loss';
		else if(data.CommonSymbolProfitLoss > 0)
			plClass = 'profit';

		return (
		<table className="pos tmp">
					<thead>
						<tr>
							<th className="title">{data.Symbol.HomeName + ' - ' + data.Symbol.AwayName}</th>
							<th>{}</th>
							<th><span className="quantity">{data.CommonSymbolVolume}</span></th>
							<th>{}</th>
							<th>{}</th>
							<th>
									<span className={'pl ' + plClass}>
										{(data.CommonSymbolProfitLoss < 0 ? '$(' + (data.CommonSymbolProfitLoss).toString().slice(1) + ')' : '$' + data.CommonSymbolProfitLoss)}
									</span>
							</th>
							<th><button className="btn close_out wave">Close Out</button></th>
						</tr>
					</thead>
					<tbody className="showhide active">
					{
						data.SubPositions.map(function (item) {
							return <PosItem key={(item.IsMirror ? item.ID + '_mirror' : item.ID)} itemData={item} mainData={data}/>;
						})
					}
					</tbody>
				</table>
		);
	}
});

const MyPosApp = React.createClass({
	getInitialState: function() {
		return {
			data: positionControllerClass.filterData(this.props.data, this.props.id),
			// id: this.props.id
		};
	},
	componentDidMount: function() {
		let self = this;
		window.ee.addListener('myPosOrder.update', function(newData) {
			newData = positionControllerClass.filterData(newData, self.props.id);
			self.setState({data: newData});
		});
	},
	render: function() {
		let data = this.state.data;
		if (data.length) {
			return (
					<div className="filter_item active" id={this.state.id}>
						{
							data.map(function (item) {
								return <MyPositionOrders data={item} key={item.Symbol.Exchange}/>
							})
						}
					</div>
			)
		}
		return (
				<div></div>
		);
	}
});

module.exports = MyPosApp;