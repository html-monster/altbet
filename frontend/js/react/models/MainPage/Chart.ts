/**
 * Created by Vlasakh on 01.12.16.
 * @link http://api.highcharts.com/highstock/Axis.setExtremes
 */
import { DateLocalization } from "../DateLocalization";
import { Generator } from './Generator' ;

/// <reference path="./../../../.d/common.d.ts" />

interface JQuery {
// interface JQueryStatic {
//     highcharts(t1);
}

declare let Highcharts : any;
declare let $ : any;
declare var window;




var __LDEV__ = true;


/**
 * Main page chart
 */
export default class Chart
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
    // private charts = [];
    //var boxplotMultiplier = 500;
    //var volumeMultiplier = 150;
    //var maxVolumeValue = 0;
    // private volumeScale = 1;
    // private label = null;
    // private chartContainer = null;
    private Generator : Generator = null;
    private chart = null;
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

    constructor(container, chartData)
    {
        let self = this;

        this.chartType = ABpp.config.chartView === 'area' ? Chart.TYPE_AREASPLINE : Chart.TYPE_SPLINE;
        this.chartTheme = Chart.THEME_LIGHT == ABpp.config.currentTheme ? Chart.THEME_LIGHT : Chart.THEME_DARK;

        this.Generator = new Generator();

        this._initChartOpts(container);

        this._createChart(chartData);

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

    public stopGenerator()
    {
        this.Generator.stopTimer()
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

        this.chart.series[0].update({
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
    // public drawEventChart(data)
    // {
    //     if (this.charts.length == 0)
    //         this._createChart(data);
    //     else
    //        this.updateChart(this.charts, data);
    // }



    /**
     * Set new data to chart
     * @param inData
     */
    public setChartData(inData, isCurrent?)
    {
        if (isCurrent) inData = this.dataGrouped;
        this.chart.series[0].setData(inData, true);
    }



    private _initChartOpts(container)
    {
        var self = this;
        // let xx = $(".chart_container .chart").width() - 217 - 30;


        // часть настроек в _createChart и PlotOptions
        this.chartData = {
            chart: {
                height: 450,
                renderTo: container,
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
                enabled: true,
                valueDecimals: 2,
                formatter: function ()
                {
                    if (this.x == self.Generator.lastVirtualX)
                    {
                        return "<span>Mediana</span>";
                        // to disable the tooltip at a point return false
                    } else {
                        let date = (new DateLocalization()).unixToLocalDate({timestamp: this.x, format: 'MM/DD/YYYY hh:mm A', TZOffset: 1});
                        return '<b>' + date + '</b><br/>' +
                            'Price: $' + this.y;
                    }
                }
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
                selected: 7,
                /*                buttonPosition: {
                 x: xx, //310,
                 y: 10
                 },*/
                labelStyle: {
                    display: 'none'
                },
                align: 'center',
                inputEnabled: false,
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
    // private setGrouping() {
    //     if (Highcharts.charts[0].series[0].options.dataGrouping.units != null)
    //         Highcharts.charts[0].series[1].options.dataGrouping.units[0] = Highcharts.charts[0].series[0].options.dataGrouping.units[0];
    // };



    private _groupData(inGr)
    {
        // correct group for All
        if (inGr == Chart.GROUP_ALL) inGr = this._getGroupCorrect();


        let rdata = this.dataRaw;
        let grData = this.dataGrouped = [];
        if( rdata.length )
        {
            var jj = -1;
            let firstGrDate = rdata[0].x;
            let sum = 0;
            let cou = 0;


            for( let ii in rdata )
            {
                let val = rdata[ii];

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
    private _getGroupCorrect() : number
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



    private _addPoint(inData)
    {
        // return;
        for( let ii in inData )
        {
            let val = inData[ii];
            // let dt = val.Time;
            // let end = moment.unix(val.Time/1000);
            // add to raw data
            val.x = val.Time;
            val.y = val.Open;
            val.Vol = val.Volume;
            this.dataRaw.push(val);

            // if( this.dataGrouped.length )
            // {
            //     var lastPoint = this.dataGrouped[this.dataGrouped.length-1];
            //
            //     var duration = moment.duration(end.diff(moment.unix(lastPoint.x/1000)));
            //     var minDiff = duration.asMinutes();
            // } // endif


            this.dataGrouped.push({x: val.Time,
                y: val.Open,
                open: val.Open,
                min: val.Open,
                max: val.Open,
                close: val.Open,
                vol: val.Volume,
                virtual: false,
                dt: moment.unix(val.Time/1000).format('Do h:mm:ss a'),
                items: [val],
            });
            // console.log('val.Time:', val.Time);
            // console.log('momentUnix:', moment.unix(val.Time/1000).format('Do h:mm:ss a'));
            // console.log('this.dataGrouped:', this.dataGrouped);

        } // endfor

        // __LDEV__&&console.debug( 'this.dataGrouped  this.groups[this.currGroup]', this.dataGrouped, this.dataRaw, this.groups[this.currGroup] );
    }



    private _createChart (chartData)
    {
        var self = this;
        // 0||console.debug( 'inData', inData );

        self.currData = chartData;


        $(chartData.Ticks).each(function () {
            let timeValue = this.Time;// * 1 - new Date().getTimezoneOffset() * 60 * 1000;

            self.chartData.series[0].data.push({
                x: timeValue,
                y: this.Open,
                Close: this.Close,
                High: this.High,
                Low: this.Low,
                Vol: this.Volume,
                dt: moment.unix(timeValue / 1000).format('Do h:mm:ss a')
            });
        });


        // make group inData from raw
        self.dataRaw = self.chartData.series[0].data;
        self._groupData(Chart.GROUP_DEF);
        self.chartData.series[0].data = self.dataGrouped;
        // 0||console.debug( 'self.chartData[0].inData', self.chartData[0].data );


        // render chart
        if (__DEV__) {
            console.groupCollapsed("Charts");
            console.info('chartsOptions', self.chartData);
            // console.info( 'chartsOptions', JSON.stringify(self.chartData) );
            console.info('self.dataRaw  self.dataGrouped', self.dataRaw, self.dataGrouped);
            console.groupEnd();
        } // endif

        this.chart = new Highcharts.Chart(self.chartData);

        self.Generator.start(self);
    }



    /**
     * Bind click to group chart btns
     */
    // private activateGroupBtns()
    // {
    //     var self = this;
    //     for (var ii = 0, countii = $(".highcharts-button").length; ii < countii; ii++)
    //     {
    //         let val = $(".highcharts-button")[ii];
    //         // $(val).addClass('gb' + ii).click(function () { self._onBtnGroupClick.bind(self) });
    //         $(val).addClass('gb' + ii).click(function () { self._onBtnGroupClick(this) });
    //     } // endfor
    // }



    // private _onBtnGroupClick(that)
    // {
    //     // 0||console.debug( 'clicked', that.classList[1][2] );
    //     this._groupData(this.groups[that.classList[1][2]]);
    //
    //     // this.setChartData(this.dataGrouped); // in restart !
    //     this.Generator.restart();
    //     // setTimeout(() =>
    //     //     Highcharts.charts[0].series[0].xAxis.setExtremes(Highcharts.charts[0].series[0].xAxis.max - 60 * 60 * 6, Highcharts.charts[0].series[0].xAxis)
    //     // , 1000);
    // }



    /**
     * @param newData - new chart data
     */
    public updateChart(newData)
    {
        var self = this;
        // __LDEV__&&console.debug( 'Update chart' );

        // $(charts).each(function ()
        // {
        //     var identificators = $($(Highcharts.charts[0].container).parent().parent()).attr('id').replace('eventContainer_', '').split('_');
        //
        //     $(Highcharts.charts).each(function ()
        //     {
        //         $(inData).each(function (key)
        //         {
        //             if (this.Symbol.Exchange == identificators[0]
        //                 && this.Symbol.Name == identificators[1]
        //                 && this.Symbol.Currency == identificators[2]) {
        //
        //                 // TODO: check for data difference
        //                 let additionalValues = self._checkForNewData(this.Ticks, key);

                        let newTicks;

                        if(this.chart.series[0].points.length && this.chart.series[0].points[this.chart.series[0].points.length - 1].virtual)
                            newTicks = newData.Ticks.slice(newData.Ticks.length - (newData.Ticks.length - (this.chart.series[0].points.length - 1)));
                        else
                            newTicks = newData.Ticks.slice(newData.Ticks.length - (newData.Ticks.length - this.chart.series[0].points.length));

                        // var additionalValues = this.Ticks.slice(self.chartData[0].data.length);

                        // stop generator
                        if (newTicks.length) { self.Generator.cancel(); }


                        $(newTicks).each(function ()
                        {
                            __LDEV__&&console.warn( 'Update chart (add points)', newTicks );
                            self._addPoint(newTicks);
                            self.setChartData(self.dataGrouped);


                            // var volumeValue = this.Volume;
                            // var timeValue = this.Time.replace('/Date(', '').replace(')/', '') * 1 - new Date().getTimezoneOffset() * 60 * 1000;
                            //
                            // var yy = isMirror ? 1 - this.Open : this.Open;
                            // Highcharts.charts[0].series[0]._addPoint({
                            //     x: timeValue,
                            //     y: yy
                            // });
                            //
                            // // Highcharts.charts[0].series[1]._addPoint({
                            // //     x: timeValue,
                            // //     y: volumeValue,
                            // //     color: this.Open > this.Close ? '#9DB201' : '#FF3728'
                            // // });
                        });


                        // resume generation
                        self.Generator.start();
                    // }
                // });

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
                self.currData = newData;
            // });
        // });
    }


    /**
     * Old and new data difference
     * @returns {Array}
     */
    private _checkForNewData(newData)
    {
        // 0||console.debug( 'inData', inData );
        let diff = [];

        // newData.Ticks.length - this.chart.series[0].points.length - 1

        // let ticks = this.currData[key].Ticks.reverse();
        // // for( var ii = this.currData[key].Ticks.length-1, jj = inData.length-1; ii >= 0; ii--, jj-- )
        // for( var ii = 0, countii = ticks.length; ii < countii; ii++ )
        // {
        //     let val = ticks[ii];
        //     if( inData[ii].Open != val.Open ) diff.push(val);
        // } // endfor
        //
        // // diff.push('-----------')
        // for( countii = inData.length; ii < countii; ii++ )
        // {
        //     diff.push(inData[ii]);
        // } // endfor
        // diff = inData.slice(ticks.length);


        // 0||console.debug( 'diff', diff,  ticks , inData, ticks.length, inData.length);
        return diff;
    }



    // private createLabel(sender, message)
    // {
    //     //label.remove();
    //     if (this.label != null) this.label.destroy();
    //
    //     this.label = sender.renderer.label(message)
    //         .css({
    //             // width: '450px',
    //             color: '#93928B',
    //             fontSize: '14px',
    //         })
    //         .attr({
    //             // 'stroke': 'silver',
    //             // 'stroke-width': 1,
    //             'r': 1,
    //             // 'fill': 'rgb(80,78,91)',
    //             // 'fill': 'rgb(83,81,94)',
    //             // 'y': 2,
    //             // 'padding': [30, 70],
    //             'padding': 5,
    //             'borderRadius': 6,
    //             // 'paddingLeft': 50,
    //             // 'paddingRight': 70,
    //             // 'paddingBottom': 20,
    //         })
    //         .add();
    //
    //     this.label.align(Highcharts.extend(this.label.getBBox(), {
    //         align: 'left',
    //         x: 5,
    //         verticalAlign: 'top',
    //         y: -20
    //     }), null, 'spacingBox');
    // }



    // private showHighlights(ee, isClose = 0)
    // {
    //     // TODO: через индекс
    //     $(Highcharts.charts).each(function ()
    //     {
    //         try {
    //             var event = this.pointer.normalize(ee.originalEvent); // Find coordinates within the chart
    //             var point = this.series[0].searchPoint(event, true); // Get the hovered point
    //
    //             // if (point && point.dataGroup)
    //             if (point)
    //             {
    //                 var x1 = point.x;
    //
    //                 let optionalParams = point.series.options.data;
    //                 let min = Infinity, xx;
    //
    //                 // search nearest
    //                 for( var ii in optionalParams )
    //                 {
    //                     var val = optionalParams[ii];
    //                     if( Math.abs(val.x - x1) < min ) { min = Math.abs(val.x - x1); xx = ii; }
    //
    //                 } // endfor
    //
    //                 // if virtual
    //                 if( point.series.options.data[xx].virtual ) xx--;
    //
    //                 var data = {
    //                     date: point.series.options.data[xx].x,
    //                     open: point.series.options.data[xx].open,// Highcharts.charts[0].series[0].data[currentIndex - 1],
    //                     high: point.series.options.data[xx].max,
    //                     low: point.series.options.data[xx].min,
    //                     close: point.series.options.data[xx].close, //Highcharts.charts[0].series[0].data[currentIndex + 1],
    //                     volume: point.series.options.data[xx].vol
    //                 };
    //
    //                 point.highlight(ee, data, isClose);
    //             }
    //         } catch (e) {
    //             __LDEV__&&console.warn( 'e', e );
    //         }
    //     });
    // }



    // private redraw()
    // {
    //     return ;
//
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
//
    // }
}