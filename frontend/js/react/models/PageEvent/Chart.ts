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

var __LDEV__ = false;


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

    private chartData = [];
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
            fill: '#53515E',
            stroke: '#53515E',
            select: {
                fill: '#8F8D9A',
                stroke: '#8F8D9A'
            }
        },
        light: {
            fill: '#F7F7F7',
            stroke: '#F7F7F7',
            select: {
                fill: '#E7E7E7',
                stroke: '#E7E7E7'
            }
        }
    };

    constructor()
    {
        var self = this;

        this.chartType = Chart.TYPE_AREASPLINE;
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
        this.chartData = [{
            height: 450,
            type: self.chartType,
            animation: {
                    duration: 700,
                    // easing: 'easeOutBounce'
                },
            // type: 'spline',
            name: 'Price',
            rangeSelector: {
                buttonTheme: {
                     fill: self.themeOpts[self.chartTheme].fill,
                     stroke: self.themeOpts[self.chartTheme].stroke,
                     'stroke-linejoin': 'round',
                     'stroke-radius': 2,
                     'stroke-width': 3,
                     states: {
                        select: {
                           fill: self.themeOpts[self.chartTheme].select.fill,
                           stroke: self.themeOpts[self.chartTheme].select.stroke
                        },
                        hover: {
                           fill: self.themeOpts[self.chartTheme].select.fill,
                           stroke: self.themeOpts[self.chartTheme].select.stroke
                        }
                     },
                    'borderRadius': 6,
                },
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'minute',
                        count: 3*60, // диапазон отображения
                        text: '1m',
                        // dataGrouping: {
                        //     units: [
                        //         ['minute', [1]]
                        //     ]
                        // }
                    }, {
                        type: 'minute',
                        count: 6*60,
                        text: '5m',
                        // dataGrouping: {
                        //     units: [
                        //         ['minute', [5]]
                        //     ]
                        // }
                    }, {
                        type: 'minute',
                        count: 24*60,
                        text: '15m',
                        // dataGrouping: {
                        //     units: [
                        //         ['minute', [15]]
                        //     ]
                        // }
                    }, {
                        type: 'hour',
                        count: 96,
                        text: '1h',
                        // dataGrouping: {
                        //     units: [
                        //         ['hour', [1]]
                        //     ]
                        // }
                    }, {
                        type: 'day',
                        count: 30,
                        text: '1d',
                        // dataGrouping: {
                        //     units: [
                        //         ['day', [1]]
                        //     ]
                        // }
                    }, {
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
                // selected: 1,
                buttonPosition: {
                    x: xx, //310,
                    y: 10
                },
                labelStyle: {
                    display: 'none'
                },
                //align: 'center'
            },
            navigator: {
                enabled: true,
                series: {
                    type: 'spline',
                    lineWidth: 2,
                }
            },
            xAxis: {
                crosshair: true,
                type: 'datetime',
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                labels: {
                    enabled: true
                },
                minorTickLength: 0,
                tickLength: 0,
                events: {
                    // afterSetExtremes: function (e) {
                    //     var min = this.min;
                    //     var max = this.max;
                    //
                    //     if (this.series[0].groupedData != null) {
                    //
                    //     }
                    //     //console.log(this.series[0].groupedData.length);
                    //
                    //     $(Highcharts.charts).each(function () {
                    //         this.xAxis[0].setExtremes(min, max);
                    //     });
                    //
                    //     self.redraw();
                    //     //this.chart.xAxis[1].setExtremes(this.min, this.max);
                    // }
                }
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return '$' + (eval(this.value) / self.volumeScale).toFixed(2).toString();
                    }
                },
                // height: '50%',
                opposite: false,
                endOnTick: false,
                maxPadding: 0.2,
                minPadding: 0.1,
                title: {
                    text: ''
                }
            },
            events: {
                load: function () {
                    self.redraw();
                    //createLabel(this, "How do I move this center and under the legend.");
                },
                // redraw: function () {
                //     redraw();
                // }
            },
            data: [],
        },
/*        {
            height: 170,
            type: 'column',
            name: 'Volume',
            rangeSelector: {
                enabled: false
            },
            navigator: {
                enabled: true
            },
            xAxis: {
                crosshair: true,
                type: 'datetime',
                events: {
                    // setExtremes: function (e) {
                    //     setGrouping();
                    // },
                    // afterSetExtremes: function (e) {
                    //     var min = this.min;
                    //     var max = this.max;
                    //
                    //     $(Highcharts.charts).each(function () {
                    //         this.xAxis[0].setExtremes(min, max);
                    //     });
                    //
                    //     redraw();
                    //     //this.chart.xAxis[1].setExtremes(this.min, this.max);
                    // }
                }
            },
            yAxis: {
                opposite: true,
                enabled: true,
                endOnTick: false,
                maxPadding: 0.2,
                minPadding: 0.1,
                title: {
                    text: ''
                }
            },
            // events: {
            //     redraw: function () {
            //         //redraw();
            //     }
            // },
            data: []
        }*/]
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
                if( jj == -1 || minDiff > inGr )
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

                        self.chartData[0].data.push({
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
            self.dataRaw = self.chartData[0].data;
            self.groupData(Chart.GROUP_DEF);
            self.chartData[0].data = self.dataGrouped;
            // 0||console.debug( 'self.chartData[0].inData', self.chartData[0].data );


            var container = $(this).attr('id');

            // Show highlights
            $('#' + container).bind('mousemove touchmove touchstart', function (e) { self.showHighlights(e) });
            $('#' + container).bind('mouseleave', function (e) { self.showHighlights(e, 1) });


            Highcharts.Point.prototype.highlight = function (event, data, isClose = 0) {
                //this.onMouseOver(); // Show the hover marker
                //this.series.chart.tooltip.refresh(this); // Show the tooltip
                if (!data) return;

                // var localDate = new Date(data.date + new Date().getTimezoneOffset() * 60 * 1000);

                var $label = '<b>Time:</b> ' + //('0' + localDate.getMonth() + 1).slice(-2) +
// //                        '-' + ('0' + localDate.getDate()).slice(-2) +
// //                        '-' + localDate.getFullYear() +
//                     ' ' + ('0' + localDate.getMonth()).slice(-2) +
//                     '/' + ('0' + localDate.getDay()).slice(-2) +
//                     '/' + ('0' + localDate.getFullYear()).slice(-2) +
//                     ' ' + ('0' + localDate.getHours()).slice(-2) +
//                     ':' + ('0' + localDate.getMinutes()).slice(-2) +
//                     ':' + ('0' + localDate.getSeconds()).slice(-2) + ' ' +
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

            var chartsOptions : any = {
                chart: {
                    height: self.chartData[0].height,
                    spacingTop: 20,

                    events: this.events,
                    //spacingBottom: 20,
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
                rangeSelector: self.chartData[0].rangeSelector,
                navigator: self.chartData[0].navigator,
                plotOptions: {
                    areaspline: {
                        lineWidth: 3,
                        dataGrouping: {
                            enabled: false,
                            // approximation: 'average',
                            // forced: true,
                            // units: [
                            //     ['minute', [1, 5, 15]],
                            //     ['hour', [1]],
                            //     ['day', [1]],
                            // ],
                        }
                    },
                    spline: {
                        lineWidth: 3,
                        dataGrouping: {
                            enabled: false,
                            // approximation: 'average',
                            // forced: true,
                            // units: [
                            //     ['minute', [1, 5, 15]],
                            //     ['hour', [1]],
                            //     ['day', [1]],
                            // ],
                        }
                    },
                    column: {
                        // dataGrouping: {
                        //     approximation: 'sum',
                        //     enabled: true,
                        //     forced: true,
                        //     units: [
                        //         ['minute', [1, 3, 10, 30]],
                        //         ['hour', [2]]
                        //     ],
                        // },
                        grouping: true,
                        borderWidth: 0,
                        events: {
                            // mouseOut: function() {
                            //     0||console.debug( 'mousout' );
                            //     redraw();
                            // }
                        }
                    },
                },
                xAxis: self.chartData[0].xAxis,
                yAxis: [],
                series: []
            };
            __LDEV__ && (chartsOptions.tooltip.enabled = true);


            // Add inData to charts options
            var flag = false;
            $(self.chartData).each(function (key) {
                chartsOptions.series[key] = {
                    data: self.chartData[key].data,
                    name: self.chartData[key].name,
                    type: self.chartData[key].type,
                    turboThreshold: 0, // This saves expensive inData checking and indexing in long series
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: false
                            },
                            select: {
                                enabled: false
                            }
                        }
                    },
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                };
                flag && (chartsOptions.series[key].yAxis = 1);
                flag || (flag = true);
                chartsOptions.yAxis[key] = self.chartData[key].yAxis;
            });


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


            // render chart
            if( __DEV__ )
            {
                console.groupCollapsed("Charts");
                console.info( 'chartsOptions', chartsOptions );
                console.info( 'chartsOptions', JSON.stringify(chartsOptions) );
                console.info( 'self.dataRaw  self.dataGrouped', self.dataRaw, self.dataGrouped );
                console.groupEnd();
            } // endif

            this.chartContainer = $('<div class="chart"></div>');
                this.chartContainer.appendTo('#' + container);
                this.chartContainer = this.chartContainer.highcharts(chartsOptions);

            // start gen virtual point
            self.Generator.start(self);
        });


        // set default range to 15 min
        try {
            // Highcharts.charts[0].series[0].xAxis.setExtremes(Highcharts.charts[0].series[0].xAxis.max - 60 * 60 * 1000 * 24, Highcharts.charts[0].series[0].xAxis.max, true);
            // Highcharts.charts[0].rangeSelector.buttons[2].setState(2);
            // Highcharts.charts[0].rangeSelector.setSelected(2);
        } catch (e) {
        }

        // if (Highcharts.charts[0].rangeSelector && Highcharts.charts[0].rangeSelector.buttons.length != 0) {
        //     // $(Highcharts.charts[0].rangeSelector.buttons).each(function () {
        //     //     this.hide();
        //     //     this.setState(0)
        //     // });
        //     // Highcharts.charts[0].rangeSelector.buttons[0].show();
        //     //
        //     //
        //     // // show buttons always
        //     // Highcharts.charts[0].rangeSelector.buttons[1].show();
        //     // Highcharts.charts[0].rangeSelector.buttons[2].show();
        //     // Highcharts.charts[0].rangeSelector.buttons[3].show();
        //     // Highcharts.charts[0].rangeSelector.buttons[4].show();
        //     // Highcharts.charts[0].rangeSelector.buttons[5].show();
        //     // var rangeMin = (Highcharts.charts[0].series[0].xAxis.max - Highcharts.charts[0].series[0].xAxis.min) / 1000 / 60;
        //     // if (rangeMin > 100) {
        //     //     // Highcharts.charts[0].series[1].xAxis.setExtremes(Highcharts.charts[0].series[1].xAxis.max - 100 * 1000 * 60, Highcharts.charts[0].series[1].xAxis.max, Highcharts.charts[0].series[1].xAxis.max);
        //     // }
        //     // if (rangeMin >= 300) {
        //     //     // Highcharts.charts[0].series[1].xAxis.setExtremes(Highcharts.charts[0].series[1].xAxis.max - 300 * 1000 * 60, Highcharts.charts[0].series[1].xAxis.max, Highcharts.charts[0].series[1].xAxis.max);
        //     //     // Highcharts.charts[0].rangeSelector.buttons[1].setState(0);
        //     //     // Highcharts.charts[0].rangeSelector.buttons[2].setState(2);
        //     // }
        // }


        // setGrouping();

        // redraw();

        // $('.highcharts-input-group').remove();
        self.activateGroupBtns();

        $(".highcharts-button.gb2").click();
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

                        // __LDEV__&&console.debug( 'this.currData, inData', self.currData, inData, additionalValues, key);
        // return 1;

                        $(additionalValues).each(function ()
                        {
                            0||console.warn( 'Update chart (add points)', additionalValues );
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



    private showHighlights(e, isClose = 0)
    {
        // TODO: через индекс
        $(Highcharts.charts).each(function ()
        {
            try {
                var event = this.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                var point = this.series[0].searchPoint(event, true); // Get the hovered point

                // if (point && point.dataGroup)
                if (point)
                {
                    var x1 = point.x;
                    // var { dataGroup , pointAttr , clientX ,dist ,distX ,getLabelConfig ,highlight ,importEvents ,index ,options ,series ,plotX ,plotY ,state ,x ,y} = point;
                    // let debug = { dataGroup , pointAttr , clientX ,dist ,distX ,getLabelConfig ,highlight ,importEvents ,index ,options ,series ,plotX ,plotY ,state ,x ,y};
// __LDEV__&&console.debug( 'point', debug );


                    let optionalParams = point.series.options.data;
                    // 0 ||console.debug( 'point.series', point.series );
                    // let extremes = Highcharts.charts[0].series[0].xAxis.getExtremes();
                    let min = Infinity, xx;
                    // __LDEV__&&console.debug( 'min > 2', min > 2 );
                    // search nearest
                    for( var ii in optionalParams )
                    {
                        var val = optionalParams[ii];
                        // if( ii == index) 0||console.debug( 'index', val );
                        // if( val.x == x ) 0||console.debug( 'series', val );
                        if( Math.abs(val.x - x1) < min ) { min = Math.abs(val.x - x1); xx = ii; }

                    } // endfor
                    // __LDEV__&&console.debug( 'min,', min,  xx);

                    // if virtual
                    if( point.series.options.data[xx].virtual ) xx--;
                    // __LDEV__&&console.debug( 'Highcharts.charts[0].series[0].xAxis.getExtremes()', extremes );

                    // var open = point.series.options.data[point.dataGroup.start].y;
                    // var close = point.series.options.data[point.dataGroup.start + point.dataGroup.length - 1].y;
                    // var high = 0;
                    // var low = 65535;
                            var data = {
                                date: point.series.options.data[xx].x,
                                open: point.series.options.data[xx].open,// Highcharts.charts[0].series[0].data[currentIndex - 1],
                                high: point.series.options.data[xx].max,
                                low: point.series.options.data[xx].min,
                                close: point.series.options.data[xx].close, //Highcharts.charts[0].series[0].data[currentIndex + 1],
                                volume: point.series.options.data[xx].vol
                            };
// __LDEV__&&console.debug( 'point.series.options.data[index].x', point.series.options.data[xx].x );
                    // for (var i = point.group.start; i < point.dataGroup.start + point.dataGroup.length; i++) {
                    //     if (point.series.options.data[i].y > high)
                    //         high = point.series.options.data[i].y;
                    //
                    //     if (point.series.options.data[i].y < low)
                    //         low = point.series.options.data[i].y;
                    // }
                    //
                    // if (Highcharts.charts[0].series[0].searchPoint(event, true))
                    // {
                    //     if (open < 1) {
                    //         // var yy = 0; //Highcharts.charts[0].series[1].searchPoint(event, true);
                    //         // var yy = Highcharts.charts[0].series[0].searchPoint(event, true);
                    //         // var data = {
                    //         //     date: Highcharts.charts[0].series[0].searchPoint(event, true).x,
                    //         //     open: open.toString().slice(1),// Highcharts.charts[0].series[0].data[currentIndex - 1],
                    //         //     high: high.toString().slice(1),
                    //         //     low: low.toString().slice(1),
                    //         //     close: close.toString().slice(1), //Highcharts.charts[0].series[0].data[currentIndex + 1],
                    //         //     volume: yy ? yy['y'] : 0
                    //
                    //     }
                    // }
                    point.highlight(e, data, isClose);
                }
            } catch (e) {
                __DEV__&&console.warn( 'e', e );
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