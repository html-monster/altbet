/**
 * Created by Htmlbook on 23.05.2017.
 */

export default class mainChartController
{
	constructor(context, data)
	{
		let graphData = [];
		let graphDataMirror = [];

		data.Ticks.forEach((item) =>
		{
			graphData.push({
				x: item.Time,
				y: Math.round10(+item.Close, -2)
			});
			graphDataMirror.push({
				x: item.Time,
				y: Math.round10(1 - item.Close, -2)
			})
		});

		this.chart = new Highcharts.Chart({
			chart      : {
				type    : 'line',
				renderTo: context
			},
			title      : {
				text: ''
			},
			navigator  : {
				enabled: true
			},
			legend     : {
				enabled: true
			},
			// plotOptions: {
			//     series: {
			//         fillOpacity: 0.1
			//     }
			// },
			xAxis      : {
				type: 'datetime',
			},
			yAxis      : {
				title : '',
				labels: {
					formatter: function () {
						return '$' + (this.value).toFixed(2);
					}
				},
				//max: 1
			},
			plotOptions: {
				area: {
					enableMouseTracking: false,
					//stacking: 'normal'
				},
				line: {
					lineWidth: 3,
				},
			},
			series     : [{
				turboThreshold: 0,
				color         : 'rgba(59,89,152,0.5)',
				name          : data.Symbol.HomeName,
				data          : graphData
			}, {
				turboThreshold: 0,
				color         : 'rgba(211,0,21,0.5)',
				name          : data.Symbol.AwayName,
				data          : graphDataMirror
			}]
		})
	}

	updateChart(newData)
	{
		let newTicks = newData.Ticks.slice(newData.Ticks.length - (newData.Ticks.length - this.chart.series[0].points.length));

		// add new Ticks in Chart
		newTicks.forEach((item) =>
		{
			this.chart.series[0].addPoint({
				x: item.Time,
				y: Math.round10(+item.Close, -2)
			});
			this.chart.series[1].addPoint({
				x: item.Time,
				y: Math.round10(1 - item.Close, -2)
			});
		});
		// console.log('this.chart:', this.chart);
		// console.log('data:', newData);
	}
}
