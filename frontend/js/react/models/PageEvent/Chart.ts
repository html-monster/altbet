import {DateLocalization} from "../DateLocalization";
/**
 * Created by Vlasakh on 01.12.16.
 * @link http://api.highcharts.com/highstock/Axis.setExtremes
 */

/// <reference path="./../../../.d/common.d.ts" />

interface JQuery {
// interface JQueryStatic {
//     highcharts(t1);
}

declare let Highcharts : any;
declare let $ : any;
declare var window;



import { Generator } from './Generator' ;

var __LDEV__ = true;


/**
 * Event page chart
 */
export class Chart
{
    public static TYPE_AREASPLINE = 'areaspline';
    // public static TYPE_AREASPLINE = 'candlestick';
    public static TYPE_SPLINE = 'spline';

    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    public static GROUP_DEF = 15;
    public static GROUP_MIN = 1;
    public static GROUP_5MIN = 5;
    public static GROUP_15MIN = 15;
    public static GROUP_60MIN = 60;
    public static GROUP_1DAY = 60*24;
    public static GROUP_ALL = -1;
    public static GROUP_INTERVALS = [3, 6, 24, 96, 720];


    private groups = []; // for btn groups
    private currGroup = 0;

    private chartData : any = [];
    private charts = [];
    //var boxplotMultiplier = 500;
    //var volumeMultiplier = 150;
    //var maxVolumeValue = 0;
    private volumeScale = 1;
    private label = null;
    private chartContainer = null;
    private Generator : Generator = null;
    private chartType = null;
    private chartTheme = null;

    private currData = null; // current chart data from socket
    private dataRaw = []; // raw data, from server
    private dataGrouped = []; // grouped data

    private themeOpts: any = {
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

    constructor()
    {
        var self = this;

        this.chartType = Chart.TYPE_SPLINE;
        this.chartTheme = Chart.THEME_LIGHT == ABpp.config.currentTheme ? Chart.THEME_LIGHT : Chart.THEME_DARK;

        this.Generator = new Generator();

        this.initChartOpts();

        this.groups = [Chart.GROUP_MIN,
            Chart.GROUP_5MIN,
            Chart.GROUP_15MIN,
            Chart.GROUP_60MIN,
            Chart.GROUP_1DAY,
            Chart.GROUP_ALL,
        ];

		window.ee.addListener('setSiteTheme', function(newData)
		{
			self.setTheme(newData);
		})
    }



    public getType()
    {
        return this.chartType;
    }


    /**
     * Change chart type (area/spline)
     * @param type String
     */
    public setType(type)
    {
        this.chartType = type;

        Highcharts.charts[0].series[0].update({
                type: this.chartType
            });
    }



    /**
     * Change chart theme
     * @param type String
     */
    public setTheme(type?)
    {
        // this.chartTheme = type == Chart.THEME_LIGHT ? Chart.THEME_LIGHT : Chart.THEME_DARK;

        location.reload();
    }



    /**
     * Used in Chart.jsx
     * @param data
     */
    public drawEventChart(data)
    {
        if (this.charts.length == 0)
            this.createChart(data);
        else
           this.updateChart(this.charts, data);
    }



    /**
     * Set new data to chart
     * @param inData
     */
    public setChartData(inData, isCurrent?)
    {
        if (isCurrent) inData = this.dataGrouped;
        Highcharts.charts[0].series[0].setData(inData, true);
    }



    private initChartOpts()
    {
        var self = this;
        let xx = $(".chart_container .chart").width() - 217 - 30;


        // часть настроек в createChart и PlotOptions
        this.chartData = {
            chart: {
                height: 450,
                type: self.chartType,
                animation: {
                        duration: 700,
                        // easing: 'easeOutBounce'
                    },
                backgroundColor: self.themeOpts[self.chartTheme].backgroundColor,
                plotBackgroundColor: self.themeOpts[self.chartTheme].backgroundColor,
                // type: 'spline',
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                valueDecimals: 2,
                // pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
            },
            rangeSelector: {
                buttonTheme: {
                    fill: self.themeOpts[self.chartTheme].fill,
                    stroke: self.themeOpts[self.chartTheme].stroke,
                    'stroke-linejoin': 'round',
                    'stroke-radius': 2,
                    'stroke-width': 3,
                    style: {
                        color: self.themeOpts[self.chartTheme].color,
                    },
                    states: {
                        select: {
                            fill: self.themeOpts[self.chartTheme].select.fill,
                            stroke: self.themeOpts[self.chartTheme].select.stroke,
                            style: {
                                color: self.themeOpts[self.chartTheme].select.color,
                                fontWeight: 'bold',
                            },
                        },
                        hover: {
                            fill: self.themeOpts[self.chartTheme].select.fill,
                            stroke: self.themeOpts[self.chartTheme].select.stroke,
                            style: {
                                color: self.themeOpts[self.chartTheme].select.color,
                                fontWeight: 'bold',
                            },
                        }
                    },
                    'borderRadius': 6,
                },
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'minute',
                        count: 1, // диапазон отображения
                        text: '1m',
                    }, {
                        type: 'minute',
                        count: 5,
                        text: '5m',
                    }, {
                        type: 'minute',
                        count: 15,
                        text: '15m',
                    }, {
                        type: 'minute',
                        count: 30,
                        text: '30m',
                    }, {
                        type: 'hour',
                        count: 1,
                        text: '1h',
                    }, {
                        type: 'day',
                        count: 1,
                        text: '1d',
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w',
                    }, {
                        type: 'all',
                        text: 'All',
                    },
                ],
                enabled: true,
                selected: 1,
                /*                buttonPosition: {
                 x: xx, //310,
                 y: 10
                 },*/
                labelStyle: {
                    display: 'none'
                },
                align: 'center',
            },
            navigator: {
                enabled: true,
                outlineColor: self.themeOpts[self.chartTheme].color,
                series: {
                    type: 'spline',
                    lineWidth: 2,
                },
                xAxis: {
                    gridLineColor: self.themeOpts[self.chartTheme].gridColor2,
                },
            },
/*                plotOptions: {
                areaspline: {
                    lineWidth: 3,
                },
                spline: {
                    lineWidth: 3,
                    dataGrouping: {
                        enabled: false,
                    }
                },
                column: {
                    dataGrouping: {
                    //     approximation: 'sum',
                        enabled: false,
                    //     forced: true,
                    //     units: [
                    //         ['minute', [1, 3, 10, 30]],
                    //         ['hour', [2]]
                    //     ],
                    },
                    grouping: false,
                    borderWidth: 0,
                },
            },*/
            xAxis: {
                crosshair: false,
                type: 'datetime',
                // lineWidth: 5,
                // gridLineDashStyle: 'longdash',
                gridLineWidth: 0,
                labels: {
                    enabled: true,
                    style: {
                        color: self.themeOpts[self.chartTheme].color,
                    },                },
                title: {
                    text: 'Time'
                },
                // minorTickLength: 0,
                // tickLength: 100,
                // tickColor: '#dc0000',
                tickWidth: 0,
            },
            yAxis: {
                gridLineColor: self.themeOpts[self.chartTheme].gridColor2,
                labels: {
                    style: {
                        color: self.themeOpts[self.chartTheme].color,
                    },
                    formatter: function () {
                        // return '$' + (eval(this.value) / self.volumeScale).toFixed(2).toString();
                        return '$' + this.value.toFixed(2).toString();
                    }
                },
                // height: '50%',
                // opposite: false,
                // endOnTick: false,
                // maxPadding: 0.2,
                // minPadding: 0.1,
                title: {
                    text: 'Price'
                },
            },
            series: [{
                data: [],
                name: 'Price',
                // turboThreshold: 0,
            }],
        };
    }



    /** @deprecated */
    private setGrouping() {
        if (Highcharts.charts[0].series[0].options.dataGrouping.units != null)
            Highcharts.charts[0].series[1].options.dataGrouping.units[0] = Highcharts.charts[0].series[0].options.dataGrouping.units[0];
    };



    private groupData(inGr)
    {
        // correct group for All
        if (inGr == Chart.GROUP_ALL) inGr = this.getGroupCorrect();

        let rdata = this.dataRaw;
        let grData = this.dataGrouped = [];
        if( rdata.length )
        {
            var jj = -1;
            let firstGrDate = rdata[0].x;
            let sum = 0;
            let cou = 0;


            for( var ii in rdata )
            {
                var val = rdata[ii];

                // checks for group bound
                let end = moment.unix(val.x/1000);
                let duration = moment.duration(end.diff(moment.unix(firstGrDate/1000)));
                let minDiff = duration.asMinutes();
                // BM: true to remove grouping
                if( true || jj == -1 || minDiff > inGr )
                {
                    jj++;

                    // avg for prev
                    jj > 0 && (grData[jj-1].y = sum/cou);
                    // jj > 0 && (grData[jj-1].avg = {sum, cou}); // debug

                    sum = val.y;
                    cou = 1;
                    firstGrDate = val.x;
                    grData[jj] = {x: val.x,
                        open: val.y,
                        min: val.y,
                        max: val.y,
                        close: val.y,
                        vol: val.Vol,
                        virtual: false,
                        dt: moment.unix(val.x/1000).format('Do h:mm:ss a'),
                        items: [val],
                        // name: 'hello ',
                        color: '',
                    };

                // same group
                } else {
                    sum += val.y;
                    cou++;
                    grData[jj].close = val.y;
                    grData[jj].vol += val.Vol;
                    if (grData[jj].min > val.y) grData[jj].min = val.y;
                    if (grData[jj].max < val.y) grData[jj].max = val.y;
                    grData[jj].items.push(val);
                } // endif

            } // endfor

            // avg for prev
            (grData[jj].y = sum/cou);


            // debug
            // for( var ii in grData )
            // {
            //     grData[ii].itemsr = JSON.stringify(grData[ii].items);
            // } // endfor
            // this.currGroup =
            this.groups.some((item, key) => { if (inGr == item) { this.currGroup = key; return true; } });
        } // endif

        // __LDEV__&&console.debug( 'dataRaw  this.currGroup', this.dataRaw, this.currGroup );
    }



    /**
     * Get appropriate group for All
     * @return number
     */
    private getGroupCorrect() : number
    {
        let end = moment.unix(this.dataRaw[this.dataRaw.length - 1].x/1000);
        let duration = moment.duration(end.diff(moment.unix(this.dataRaw[0].x/1000)));
        let minDiff = duration.asHours();

        let group : number = 1;
        let interv = Chart.GROUP_INTERVALS;
        for(let ii = interv.length-1; ii > 0; ii-- )
        {
            group = interv[ii];
            if( minDiff > group ) continue;
            else break;
        } // endfor

        return group;
    }



    private addPoint(inData)
    {
        // return;
        for( let ii in inData )
        {
            let val = inData[ii];
            let dt = (new DateLocalization()).fromSharp(val.Time);
            // let dt = val.Time.replace('/Date(', '').replace(')/', '') * 1 - new Date().getTimezoneOffset() * 60 * 1000;
            let end = moment.unix(dt/1000);

            // add to raw data
            val.x = dt;
            val.y = val.Open;
            val.Vol = val.Volume;
            this.dataRaw.push(val);

            if( this.dataGrouped.length )
            {
                var lastPoint = this.dataGrouped[this.dataGrouped.length-1];

                var duration = moment.duration(end.diff(moment.unix(lastPoint.x/1000)));
                var minDiff = duration.asMinutes();
            } // endif

            if( !this.dataGrouped.length || minDiff > this.groups[this.currGroup] )
            {
                this.dataGrouped.push({x: dt,
                    y: val.Open,
                    open: val.Open,
                    min: val.Open,
                    max: val.Open,
                    close: val.Open,
                    vol: val.Volume,
                    virtual: false,
                    dt: moment.unix(dt/1000).format('Do h:mm:ss a'),
                    items: [val],
                });
            }
            else
            {
                lastPoint.y = (lastPoint.y + val.Open) / 2;
                lastPoint.close = val.Open;
                lastPoint.vol += val.Volume;
                if (lastPoint.min > val.Open) lastPoint.min = val.Open;
                if (lastPoint.max < val.Open) lastPoint.max = val.Open;
                lastPoint.items && lastPoint.items.push(val);
            } // endif
        } // endfor

        // __LDEV__&&console.debug( 'this.dataGrouped  this.groups[this.currGroup]', this.dataGrouped, this.dataRaw, this.groups[this.currGroup] );
    }



    private createChart (inData)
    {
        var self = this;
        // 0||console.debug( 'inData', inData );

        self.currData = inData;


        var isMirror = $('input[type=hidden]#IsMirror').val().toUpperCase() == "TRUE";
        $('div[id^="eventContainer_"]').each(function () {

            var identificators = $(this).attr('id').replace('eventContainer_', '').split('_');

            $(inData).each(function () {
                if (this.Symbol.Exchange == identificators[0]
                    && this.Symbol.Name == identificators[1]
                    && this.Symbol.Currency == identificators[2]) {
                    $(this.Ticks).each(function () {
                        var volumeValue = this.Volume;
                        var timeValue = this.Time.replace('/Date(', '').replace(')/', '') * 1 - new Date().getTimezoneOffset() * 60 * 1000;
                        // var timeValue = this.Time.replace('/Date(', '').replace(')/', '') * 1;

                        self.chartData.series[0].data.push({
                            x: timeValue,
                            y: isMirror ? 1 - this.Open : this.Open,
                            Close: isMirror ? 1 - this.Close : this.Close,
                            High: isMirror ? 1 - this.High : this.High,
                            Low: isMirror ? 1 - this.Low : this.Low,
                            Vol: this.Volume,
                            dt: moment.unix(timeValue/1000).format('Do h:mm:ss a')
                        });
                        // self.chartData[1].inData.push({
                        //     x: timeValue,
                        //     y: volumeValue,
                        //     color: this.Open > this.Close ? '#9DB201' : '#FF3728'
                        //     // color: this.Open > this.Close ? 'green' : 'red'
                        // });
                    });
                }
            });

            self.charts.push(1);


            // make group inData from raw
            self.dataRaw = self.chartData.series[0].data;
            self.groupData(Chart.GROUP_DEF);
            self.chartData.series[0].data = self.dataGrouped;
            // 0||console.debug( 'self.chartData[0].inData', self.chartData[0].data );


            var container = $(this).attr('id');

            // Show highlights
            // $('#' + container).bind('mousemove touchmove touchstart', function (e) { self.showHighlights(e) });
            // $('#' + container).bind('mouseleave', function (e) { self.showHighlights(e, 1) });


/*
            Highcharts.Point.prototype.highlight = function (event, data, isClose = 0)
            {
                //this.onMouseOver(); // Show the hover marker
                //this.series.chart.tooltip.refresh(this); // Show the tooltip
                if (!data) return;

                // var localDate = new Date(data.date + new Date().getTimezoneOffset() * 60 * 1000);

                var $label = '<b>Time:</b> ' + //('0' + localDate.getMonth() + 1).slice(-2) +
                    (new DateLocalization()).unixToLocalDate({timestamp: data.date, format: "d MMM YY h:mm:ss "}) +
                    '<b>Vol:</b> ' + data.volume.toString().substr(0, 3) + '  <br/> ' +
                    '<b>Close:</b> ' + parseFloat("0" + data.close).toFixed(2).substr(1, 3) + ' ' +
                    '<b>Open:</b> ' + parseFloat("0" + data.open).toFixed(2).substr(1, 3) + ' ' +
                    '<b>Low:</b> ' + parseFloat("0" + data.low).toFixed(2).substr(1, 3) + ' ' +
                    '<b>High:</b> ' + parseFloat("0" + data.high).toFixed(2).substr(1, 3) + ' ';
                self.createLabel(Highcharts.charts[0],
                    !isClose ? $label : ""
                );


                this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
            };
*/


            // $('#' + container).bind('mouseleave', function (e) {
            //     //label.destroy();
            //     $(Highcharts.charts).each(function () {
            //         var event = this.pointer.normalize(e.originalEvent); // Find coordinates within the chart
            //         var point = this.series[0].searchPoint(event, true); // Get the hovered point
            //
            //         if (point) {
            //             this.xAxis[0].hideCrosshair();
            //         }
            //     });
            // });

            __LDEV__ && (self.chartData.tooltip.enabled = true);


            // Add inData to charts options
            // var flag = false;
/*
            $(self.chartData).each(function (key) {
                self.chartData.series[key] = {
                    data: self.chartData[key].data,
                    name: self.chartData[key].name,
                    type: self.chartData[key].type,
                     // This saves expensive inData checking and indexing in long series
/!*                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        enabled: false,
/!*                        states: {
                            hover: {
                                enabled: false
                            },
                            select: {
                                enabled: false
                            }
                        }*!/
                    },
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }*!/
                };
                flag && (chartsOptions.series[key].yAxis = 1);
                flag || (flag = true);
                chartsOptions.yAxis[key] = self.chartData[key].yAxis;
            });
*/


            // Highcharts.themeOpts = {
            //     // colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
            //     //     '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            //     // chart: {
            //     //     backgroundColor: {
            //     //         linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
            //     //         stops: [
            //     //             [0, '#2a2a2b'],
            //     //             [1, '#3e3e40']
            //     //         ]
            //     //     },
            //     //     style: {
            //     //         fontFamily: '\'Unica One\', sans-serif'
            //     //     },
            //     //     // plotBorderColor: '#606063'
            //     // },
            //     // legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            //     // background2: '#505053',
            //     // dataLabelsColor: '#B0B0B3',
            //     // textColor: '#C0C0C0',
            //     // contrastTextColor: '#F0F0F3',
            //     // maskColor: 'rgba(255,255,255,0.3)'
            // };
            //
            // Highcharts.setOptions(Highcharts.themeOpts);

            var  tempOoptions = {
                chart: {
                    type: 'spline',
                    height: 450,
                },
                title: {
                    text: 'Monthly Average Temperature'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: {
                        type: 'datetime',
                    title: {
                        text: 'Time'
                    },
                },
                yAxis: {
                    title: {
                        text: 'Temperature'
                    },
                    labels: {
                        formatter: function () {
                            return this.value + '°';
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                        rangeSelector: {
                            allButtonsEnabled: true,
                            buttons: [
                                {
                                    type: 'minute',
                                    count: 1, // диапазон отображения
                                    text: '1m',
                                },
                                                    {
                                    type: 'minute',
                                    count: 5,
                                    text: '5m',
                                },
                                {
                                    type: 'all',
                                    text: 'All',
                                    // dataGrouping: {
                                    //     units: [
                                    //         // ['minute', [1, 3, 10, 30]],
                                    //         ['hour', [2]]
                                    //     ]
                                    // }
                                },
                              ],
                                            enabled: true,
                            selected: 1,
                          },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    },
                },
                        navigator: {
                            enabled: true,
                            series: {
                                type: 'spline',
                                lineWidth: 2,
                            }
                        },
                series: [{
                    name: 'Tokyo',
                    marker: {
                        symbol: 'square'
                    },
                    data: [ { "x": 1495456349000, "y": 0.57, "Close": 0.57, "High": 0.57, "Low": 0.57, "Vol": 5, "dt": "22nd 3:32:29 pm"}, { "x": 1495456350000, "y": 0.57, "Close": 0.57, "High": 0.57, "Low": 0.57, "Vol": 5, "dt": "22nd 3:32:30 pm"}, { "x": 1495456354000, "y": 0.52, "Close": 0.52, "High": 0.52, "Low": 0.52, "Vol": 5, "dt": "22nd 3:32:34 pm"}, { "x": 1495456355000, "y": 0.52, "Close": 0.52, "High": 0.52, "Low": 0.52, "Vol": 5, "dt": "22nd 3:32:35 pm"}, { "x": 1495457103000, "y": 0.52, "Close": 0.52, "High": 0.52, "Low": 0.52, "Vol": 5, "dt": "22nd 3:45:03 pm"}, { "x": 1495457104000, "y": 0.52, "Close": 0.52, "High": 0.52, "Low": 0.52, "Vol": 5, "dt": "22nd 3:45:04 pm"}, { "x": 1495457105000, "y": 0.52, "Close": 0.52, "High": 0.52, "Low": 0.52, "Vol": 5, "dt": "22nd 3:45:05 pm"}, { "x": 1495457106000, "y": 0.46, "Close": 0.46, "High": 0.46, "Low": 0.46, "Vol": 5, "dt": "22nd 3:45:06 pm"}, { "x": 1495457909000, "y": 0.57, "Close": 0.57, "High": 0.57, "Low": 0.57, "Vol": 5, "dt": "22nd 3:58:29 pm"}, { "x": 1495457910000, "y": 0.57, "Close": 0.57, "High": 0.57, "Low": 0.57, "Vol": 5, "dt": "22nd 3:58:30 pm"}, { "x": 1495457911000, "y": 0.63, "Close": 0.63, "High": 0.63, "Low": 0.63, "Vol": 5, "dt": "22nd 3:58:31 pm"}, { "x": 1495457913000, "y": 0.65, "Close": 0.65, "High": 0.65, "Low": 0.65, "Vol": 5, "dt": "22nd 3:58:33 pm"}, { "x": 1495458329000, "y": 0.71, "Close": 0.71, "High": 0.71, "Low": 0.71, "Vol": 5, "dt": "22nd 4:05:29 pm"}, { "x": 1495459025000, "y": 0.42, "Close": 0.42, "High": 0.42, "Low": 0.42, "Vol": 5, "dt": "22nd 4:17:05 pm"}, { "x": 1495459052000, "y": 0.42, "Close": 0.42, "High": 0.42, "Low": 0.42, "Vol": 5, "dt": "22nd 4:17:32 pm"} ]

                }]
            };

            // render chart
            if( __DEV__ )
            {
                console.groupCollapsed("Charts");
                console.info( 'chartsOptions', self.chartData );
                console.info( 'chartsOptions', JSON.stringify(self.chartData) );
                console.info( 'self.dataRaw  self.dataGrouped', self.dataRaw, self.dataGrouped );
                console.groupEnd();
            } // endif

            this.chartContainer = $('<div class="chart" id="DiChartObj"></div>');
            this.chartContainer.appendTo('#' + container);
            // this.chartContainer = this.chartContainer.highcharts(tempOoptions);
            this.chartContainer = this.chartContainer.highcharts(self.chartData);
            // Highcharts.chart('DiChartObj', chartsOptions);
            // Highcharts.chart('DiChartObj', tempOoptions);

            // start gen virtual point
            self.Generator.start(self);
        });



        // setGrouping();
        // redraw();


        // $('.highcharts-input-group').remove();
        // self.activateGroupBtns();

        // $(".highcharts-button.gb2").click();
    }



    /**
     * Bind click to group chart btns
     */
    private activateGroupBtns()
    {
        var self = this;
        for (var ii = 0, countii = $(".highcharts-button").length; ii < countii; ii++)
        {
            let val = $(".highcharts-button")[ii];
            // $(val).addClass('gb' + ii).click(function () { self.onBtnGroupClick.bind(self) });
            $(val).addClass('gb' + ii).click(function () { self.onBtnGroupClick(this) });
        } // endfor
    }



    private onBtnGroupClick(that)
    {
        // 0||console.debug( 'clicked', that.classList[1][2] );
        this.groupData(this.groups[that.classList[1][2]]);

        // this.setChartData(this.dataGrouped); // in restart !
        this.Generator.restart();
        // setTimeout(() =>
        //     Highcharts.charts[0].series[0].xAxis.setExtremes(Highcharts.charts[0].series[0].xAxis.max - 60 * 60 * 6, Highcharts.charts[0].series[0].xAxis)
        // , 1000);
    }



    /**
     * @param charts
     * @param inData
     */
    private updateChart(charts, inData)
    {
        var self = this;
        // __LDEV__&&console.debug( 'Update chart' );
        // return;

        var isMirror = $('input[type=hidden]#IsMirror').val().toUpperCase() == "TRUE";

        $(charts).each(function ()
        {
            var identificators = $($(Highcharts.charts[0].container).parent().parent()).attr('id').replace('eventContainer_', '').split('_');

            $(Highcharts.charts).each(function ()
            {
                $(inData).each(function (key) {
                    if (this.Symbol.Exchange == identificators[0]
                        && this.Symbol.Name == identificators[1]
                        && this.Symbol.Currency == identificators[2]) {

                        // TODO: check for data difference
                        let additionalValues = self.checkForNewData(this.Ticks, key);

                        // var additionalValues = this.Ticks.slice(self.chartData[0].data.length);

                        // stop generator
                        if (additionalValues.length) { self.Generator.cancel(); }


                        $(additionalValues).each(function ()
                        {
                            __LDEV__&&console.warn( 'Update chart (add points)', additionalValues );
                            self.addPoint(additionalValues);
                            self.setChartData(self.dataGrouped);


                            // var volumeValue = this.Volume;
                            // var timeValue = this.Time.replace('/Date(', '').replace(')/', '') * 1 - new Date().getTimezoneOffset() * 60 * 1000;
                            //
                            // var yy = isMirror ? 1 - this.Open : this.Open;
                            // Highcharts.charts[0].series[0].addPoint({
                            //     x: timeValue,
                            //     y: yy
                            // });
                            //
                            // // Highcharts.charts[0].series[1].addPoint({
                            // //     x: timeValue,
                            // //     y: volumeValue,
                            // //     color: this.Open > this.Close ? '#9DB201' : '#FF3728'
                            // // });
                        });


                        // resume generation
                        if (additionalValues.length) self.Generator.start();
                    }
                });

                // if( Highcharts.charts[0].rangeSelector )
                // {
                //     Highcharts.charts[0].rangeSelector.buttons[1].show();
                //     Highcharts.charts[0].rangeSelector.buttons[2].show();
                //     Highcharts.charts[0].rangeSelector.buttons[3].show();
                //     Highcharts.charts[0].rangeSelector.buttons[4].show();
                //     Highcharts.charts[0].rangeSelector.buttons[5].show();
                //     // var rangeMin = (Highcharts.charts[0].series[0].xAxis.max - Highcharts.charts[0].series[0].xAxis.min) / 1000 / 60;
                // } // endif

                // setGrouping();

                // redraw();

                self.currData = inData;
            });
        });
    }


    /**
     * Old and new data difference
     * @returns {Array}
     */
    private checkForNewData(inData, key)
    {
        // 0||console.debug( 'inData', inData );
        let diff = [];

        let ticks = this.currData[key].Ticks.reverse();
        // for( var ii = this.currData[key].Ticks.length-1, jj = inData.length-1; ii >= 0; ii--, jj-- )
        for( var ii = 0, countii = ticks.length; ii < countii; ii++ )
        {
            let val = ticks[ii];
            if( inData[ii].Open != val.Open ) diff.push(val);
        } // endfor

        // diff.push('-----------')
        for( countii = inData.length; ii < countii; ii++ )
        {
            diff.push(inData[ii]);
        } // endfor
        diff = inData.slice(ticks.length);


        // 0||console.debug( 'diff', diff,  ticks , inData, ticks.length, inData.length);
        return diff;
    }



    private createLabel(sender, message)
    {
        //label.remove();
        if (this.label != null) this.label.destroy();

        this.label = sender.renderer.label(message)
            .css({
                // width: '450px',
                color: '#93928B',
                fontSize: '14px',
            })
            .attr({
                // 'stroke': 'silver',
                // 'stroke-width': 1,
                'r': 1,
                // 'fill': 'rgb(80,78,91)',
                // 'fill': 'rgb(83,81,94)',
                // 'y': 2,
                // 'padding': [30, 70],
                'padding': 5,
                'borderRadius': 6,
                // 'paddingLeft': 50,
                // 'paddingRight': 70,
                // 'paddingBottom': 20,
            })
            .add();

        this.label.align(Highcharts.extend(this.label.getBBox(), {
            align: 'left',
            x: 5,
            verticalAlign: 'top',
            y: -20
        }), null, 'spacingBox');
    }



    private showHighlights(ee, isClose = 0)
    {
        // TODO: через индекс
        $(Highcharts.charts).each(function ()
        {
            try {
                var event = this.pointer.normalize(ee.originalEvent); // Find coordinates within the chart
                var point = this.series[0].searchPoint(event, true); // Get the hovered point

                // if (point && point.dataGroup)
                if (point)
                {
                    var x1 = point.x;

                    let optionalParams = point.series.options.data;
                    let min = Infinity, xx;

                    // search nearest
                    for( var ii in optionalParams )
                    {
                        var val = optionalParams[ii];
                        if( Math.abs(val.x - x1) < min ) { min = Math.abs(val.x - x1); xx = ii; }

                    } // endfor

                    // if virtual
                    if( point.series.options.data[xx].virtual ) xx--;

                    var data = {
                        date: point.series.options.data[xx].x,
                        open: point.series.options.data[xx].open,// Highcharts.charts[0].series[0].data[currentIndex - 1],
                        high: point.series.options.data[xx].max,
                        low: point.series.options.data[xx].min,
                        close: point.series.options.data[xx].close, //Highcharts.charts[0].series[0].data[currentIndex + 1],
                        volume: point.series.options.data[xx].vol
                    };

                    point.highlight(ee, data, isClose);
                }
            } catch (e) {
                __LDEV__&&console.warn( 'e', e );
            }
        });
    }



    private redraw()
    {
        return ;

//         // if (Highcharts.charts[1] == null) return;
//         if (Highcharts.charts[0].series[1] == null) return;
// // 0||console.debug( 'redraw' );
//
//         $.each(Highcharts.charts[0].series, function () {
//             var series = this;
//
//             if (series.name != 'Navigator') {
//                 $(series.points).each(function (index) {
//                     if (index == 0) {
//                         this.graphic && this.graphic.attr('fill', '#9DB201');
//                     }
//                     else {
//                         if (index == series.points.length - 1) {
//                             this.graphic && this.graphic.attr('fill', '#FF3728');
//                         } else {
//                             if( Highcharts.charts[0].series[1].groupedData && Highcharts.charts[0].series[1].groupedData.length )
//                             {
// // 0||console.debug( 'Highcharts.charts[0].series[1].groupedData', Highcharts.charts[0].series[1].groupedData );
//                                 var openValue = Highcharts.charts[0].series[0].options.data[Highcharts.charts[0].series[1].groupedData[index].dataGroup.start].y;
//                                 var closeValue = Highcharts.charts[0].series[0].options.data[Highcharts.charts[0].series[1].groupedData[index].dataGroup.start + Highcharts.charts[0].series[1].groupedData[index].dataGroup.length - 1].y;
//                                 if (openValue > closeValue)
//                                     this.graphic && this.graphic.attr('fill', '#FF3728');
//                                 else
//                                     this.graphic && this.graphic.attr('fill', '#9DB201');
//                             } // endif
//                         }
//                     }
//                 });
//             }
//         });

    }
}