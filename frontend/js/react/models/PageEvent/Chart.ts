/**
 * Created by Vlasakh on 01.12.16.
 */

/// <reference path="./../../../.d/common.d.ts" />

import { Generator } from './Generator' ;

interface JQuery {
// interface JQueryStatic {
//     highcharts(t1);
}

declare let Highcharts : any;
declare let $ : any;
declare let window : any;


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
    private currData = null; // current chart data

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



    private initChartOpts()
    {
        var self = this;

        // часть настроек в createChart и PlotOptions
        this.chartData = [{
            height: 450,
            type: self.chartType,
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
                        count: 180, // диапазон отображения
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
                    x: 20
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
                    afterSetExtremes: function (e) {
                        var min = this.min;
                        var max = this.max;

                        if (this.series[0].groupedData != null) {

                        }
                        //console.log(this.series[0].groupedData.length);

                        $(Highcharts.charts).each(function () {
                            this.xAxis[0].setExtremes(min, max);
                        });

                        self.redraw();
                        //this.chart.xAxis[1].setExtremes(this.min, this.max);
                    }
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



    private createChart (data)
    {
        var self = this;
        // 0||console.debug( 'data', data );

        var isMirror = $('input[type=hidden]#IsMirror').val().toUpperCase() == "TRUE";
        $('div[id^="eventContainer_"]').each(function () {

            var identificators = $(this).attr('id').replace('eventContainer_', '').split('_');

            $(data).each(function () {
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
                            Low: isMirror ? 1 - this.Low : this.Low
                        });
                        // self.chartData[1].data.push({
                        //     x: timeValue,
                        //     y: volumeValue,
                        //     color: this.Open > this.Close ? '#9DB201' : '#FF3728'
                        //     // color: this.Open > this.Close ? 'green' : 'red'
                        // });
                    });
                }
            });

            self.charts.push(1);

            var container = $(this).attr('id');

            // Show highlights
            $('#' + container).bind('mousemove touchmove touchstart', function (e) { self.showHighlights(e) });


            Highcharts.Point.prototype.highlight = function (event, data) {
                //this.onMouseOver(); // Show the hover marker
                //this.series.chart.tooltip.refresh(this); // Show the tooltip
                if (!data) return;

                var localDate = new Date(data.date + new Date().getTimezoneOffset() * 60 * 1000);

                self.createLabel(Highcharts.charts[0],
                    '<b>Date:</b> ' + //('0' + localDate.getMonth() + 1).slice(-2) +
//                        '-' + ('0' + localDate.getDate()).slice(-2) +
//                        '-' + localDate.getFullYear() +
                        ' ' + ('0' + localDate.getHours()).slice(-2) +
                        ':' + ('0' + localDate.getMinutes()).slice(-2) +
                        ':' + ('0' + localDate.getSeconds()).slice(-2) + ' ' +
                    '<b>Open:</b> ' + parseFloat("0" + data.open).toFixed(2).substr(1, 3) + ' ' +
                    '<b>High:</b> ' + parseFloat("0" + data.high).toFixed(2).substr(1, 3) + ' ' +
                    '<b>Low:</b> ' + parseFloat("0" + data.low).toFixed(2).substr(1, 3) + ' ' +
                    '<b>Close:</b> ' + parseFloat("0" + data.close).toFixed(2).substr(1, 3) + ' ' +
                    '<b>Vol:</b> ' + data.volume.toString().substr(0, 3));
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
                    valueDecimals: 2
                },
                rangeSelector: self.chartData[0].rangeSelector,
                navigator: self.chartData[0].navigator,
                plotOptions: {
                    areaspline: {
                        lineWidth: 3,
                        dataGrouping: {
                            approximation: 'average',
                            enabled: true,
                            forced: true,
                            units: [
                                ['minute', [1, 5, 15]],
                                ['hour', [1]],
                                ['day', [1]],
                            ],
                        }
                    },
                    spline: {
                        lineWidth: 3,
                        dataGrouping: {
                            approximation: 'average',
                            enabled: true,
                            forced: true,
                            units: [
                                ['minute', [1, 5, 15]],
                                ['hour', [1]],
                                ['day', [1]],
                            ],
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
            // 0||console.debug( '__LDEV__', __LDEV__ );
            __LDEV__ && (chartsOptions.tooltip.enabled = true);


            // chartsOptions.series[0] = {
            //         data: chartData[1].data,
            //         name: chartData[1].name,
            //         type: chartData[1].type,
            //     };
            // chartData[0].data.map((val) => {
            //     // val.Y_orig = val.y;
            //     val.y += 0.2;
            //     return val;
            // });


            // set min and max value for axis
            // let min = 1;
            // let max = 0;
            // chartData[0].data.forEach((val) => {
            //     min > val.y && (min = val.y);
            //     max < val.y && (max = val.y);
            // });
            // chartData[0].yAxis.max = max;
            // chartData[0].yAxis.min = min + 0.01;
            // 0||console.debug( 'min/max', min, max );


            // set point colors
            // chartData[1].data.map((val) => {
            //     // val.color = val.color == 'red' ? '#FF0000' : '#00FF00';
            //     return val;
            // });

            // 0||console.warn( 'chartData[0].data', (new Date(chartData[0].data[chartData[0].data.length].x)) );
            // 0||console.warn( 'chartData[0].data', (new Date(chartData[0].data[chartData[0].data.length].x)) );


            // Add data to charts options
            var flag = false;
            $(self.chartData).each(function (key) {
                chartsOptions.series[key] = {
                    data: self.chartData[key].data,
                    name: self.chartData[key].name,
                    type: self.chartData[key].type,
                    turboThreshold: 0,
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
            console.groupCollapsed("Charts");
            0||console.info( 'chartsOptions', chartsOptions );
            0||console.info( 'chartsOptions', JSON.stringify(chartsOptions) );
            console.groupEnd();
            this.chartContainer = $('<div class="chart"></div>')
                .appendTo('#' + container)
                .highcharts(chartsOptions);

            // start gen virtual point
            self.Generator.start(this.chartContainer);
        });


        // set default range to 15 min
        try {
            Highcharts.charts[0].rangeSelector.buttons[2].setState(2);
            Highcharts.charts[0].series[0].xAxis.setExtremes(Highcharts.charts[0].series[0].xAxis.max - 60 * 60 * 1000 * 24, Highcharts.charts[0].series[0].xAxis.max, true);
            Highcharts.charts[0].rangeSelector.setSelected(2);
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
    }


    /**
     * @param charts
     * @param inData
     */
    private updateChart(charts, inData)
    {
        var self = this;

        var isMirror = $('input[type=hidden]#IsMirror').val().toUpperCase() == "TRUE";

        // check for data difference
        this.checkForNewData(inData);

        $(charts).each(function ()
        {
            var identificators = $($(Highcharts.charts[0].container).parent().parent()).attr('id').replace('eventContainer_', '').split('_');

            $(Highcharts.charts).each(function ()
            {
                $(inData).each(function () {
                    if (this.Symbol.Exchange == identificators[0]
                        && this.Symbol.Name == identificators[1]
                        && this.Symbol.Currency == identificators[2]) {

                        var additionalValues = this.Ticks.slice(self.chartData[0].data.length);

                        // stop generator
                        if (additionalValues.length) {
                            self.Generator.cancel();
                        }


                        $(additionalValues).each(function ()
                        {
                            0||console.warn( 'Update chart', additionalValues );

                            var volumeValue = this.Volume;
                            var timeValue = this.Time.replace('/Date(', '').replace(')/', '') * 1 - new Date().getTimezoneOffset() * 60 * 1000;

                            var yy = isMirror ? 1 - this.Open : this.Open;
                            Highcharts.charts[0].series[0].addPoint({
                                x: timeValue,
                                y: yy
                            });

                            // Highcharts.charts[0].series[1].addPoint({
                            //     x: timeValue,
                            //     y: volumeValue,
                            //     color: this.Open > this.Close ? '#9DB201' : '#FF3728'
                            // });


                            // update min max remake by extreme
                            // 0||console.debug( 'Highcharts.charts[0].yAxis[0].dataMin, yy', Highcharts.charts[0].yAxis[0].dataMin, yy );
                            // if (Highcharts.charts[0].yAxis[0].dataMin > yy) Highcharts.charts[0].yAxis[0].dataMin = yy;
                            // if (Highcharts.charts[0].yAxis[0].dataMax < yy) Highcharts.charts[0].yAxis[0].dataMax = yy;
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



    private checkForNewData(inData)
    {
        // 0||console.debug( 'inData', inData );

        // Object.keys().map(function(key, index) {
        //    [key];
        // });
        // inData.forEach(() => {
        //
        // });
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
            x: 10,
            verticalAlign: 'top',
            y: 40
        }), null, 'spacingBox');
    }



    private showHighlights(e)
    {
        $(Highcharts.charts).each(function ()
        {
            try {
                var event = this.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                var point = this.series[0].searchPoint(event, true); // Get the hovered point

                if (point && point.dataGroup)
                {
                    // 0||console.debug( 'point.dataGroup', point.dataGroup );
__LDEV__&&console.debug( 'point.series.options', point );

                    if( point.series.options.data[point.dataGroup.start].virtual ) return;

0||console.debug( 'point.dataGroup.start', point.dataGroup, point.series.options.data[point.dataGroup.start] );
                    var open = point.series.options.data[point.dataGroup.start].y;
                    var close = point.series.options.data[point.dataGroup.start + point.dataGroup.length - 1].y;
                    var high = 0;
                    var low = 65535;

                    for (var i = point.dataGroup.start; i < point.dataGroup.start + point.dataGroup.length; i++) {
                        if (point.series.options.data[i].y > high)
                            high = point.series.options.data[i].y;

                        if (point.series.options.data[i].y < low)
                            low = point.series.options.data[i].y;
                    }

                    if (Highcharts.charts[0].series[0].searchPoint(event, true))
                    {
                        if (open < 1) {
                            // var yy = 0; //Highcharts.charts[0].series[1].searchPoint(event, true);
                            var yy = Highcharts.charts[0].series[0].searchPoint(event, true);
                            var data = {
                                date: Highcharts.charts[0].series[0].searchPoint(event, true).x,
                                open: open.toString().slice(1),// Highcharts.charts[0].series[0].data[currentIndex - 1],
                                high: high.toString().slice(1),
                                low: low.toString().slice(1),
                                close: close.toString().slice(1), //Highcharts.charts[0].series[0].data[currentIndex + 1],
                                volume: yy ? yy['y'] : 0
                            };
                        }
                    }
                    point.highlight(e, data);
                }
            } catch (e) {
                // __DEV__&&console.warn( 'e', e );
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