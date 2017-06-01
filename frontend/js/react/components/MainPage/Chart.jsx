/**
 * Created by Htmlbook on 23.05.2017.
 */

export default class mainChartController
{
    /**@public*/ static THEME_DARK = 'dark';
    /**@public*/ static THEME_LIGHT = 'light';

    /**@private*/ themeOpts = {
        dark: {
            color: "#919096", // также поставлен как цвет для линий сетки
            gridColor2: "#4d4c52", // также поставлен как цвет для линий сетки
            backgroundColor: "#211e25",
            fill: '#53515E',
            stroke: '#53515E',
            select: {
                fill: '#8F8D9A',
                stroke: '#8F8D9A',
                color: '#fff',
            }
        },
        light: {
            color: "#919096",
            backgroundColor: "#ffffff",
            fill: '#F7F7F7',
            stroke: '#F7F7F7',
            select: {
                fill: '#E7E7E7',
                stroke: '#E7E7E7',
                color: '#fff',
            }
        }
    };
    /**@private*/ chartTheme = null;


	constructor(context, data)
	{
		let graphData = [];
		let graphDataMirror = [];

        // set curr theme
        this.chartTheme = mainChartController.THEME_LIGHT === ABpp.config.currentTheme ? mainChartController.THEME_LIGHT : mainChartController.THEME_DARK;

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
				renderTo: context,
				height: 400,

                backgroundColor: this.themeOpts[this.chartTheme].backgroundColor,
                plotBackgroundColor: this.themeOpts[this.chartTheme].backgroundColor,
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
                tickColor: this.themeOpts[this.chartTheme].gridColor2,
			},
			yAxis      : {
                gridLineColor: this.themeOpts[this.chartTheme].gridColor2,
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
