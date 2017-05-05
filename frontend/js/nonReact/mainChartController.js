var mainChartController = new function () {
    var charts = [];

    this.drawMainCharts = function (data) {
        if (charts.length == 0)
            createCharts(data);
        else
            updateCharts(charts, data)
    }

    var createCharts = function (data)
    {
        $('div[id^="container_"]').each(function ()
        {
            var identificators = $(this).attr('id').replace('container_', '').split('_');
            var graphData = [];
            var graphDataMirror = [];
            var graphStraightName = $(this).parent().parent().parent().find('div.event-content h3 span.title').first().text();
            var graphMirrorName = $(this).parent().parent().parent().find('div.event-content h3 span.title').last().text();

            $(data).each(function () {
                if (this.Symbol.Exchange == identificators[0]
                    && this.Symbol.Name == identificators[1]
                    && this.Symbol.Currency == identificators[2]) {
                    $(this.Ticks).each(function () {
                        graphData.push({ x: this.Time.replace('/Date(', '').replace(')/', '') * 1, y: this.Close.toFixed(2) * 1 })
                        graphDataMirror.push({ x: this.Time.replace('/Date(', '').replace(')/', '') * 1, y: (1 - this.Close).toFixed(2) * 1 })
                    });
                }
            });

            charts.push(new Highcharts.Chart({
                chart: {
                    type: 'line',
                    renderTo: ($(this).attr('id'))
                },
                title: {
                    text: ''
                },
                navigator: {
                    enabled: true
                },
                legend: {
                    enabled: true
                },
                // plotOptions: {
                //     series: {
                //         fillOpacity: 0.1
                //     }
                // },
                xAxis: {
                    type: 'datetime',
                },
                yAxis: {
                    title: '',
                    labels: {
                        formatter: function () {
                            return '$' + eval(this.value).toFixed(2).toString();
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
                series: [{
                    turboThreshold: 0,
                    color: 'rgba(59,89,152,0.5)',
                    name: graphStraightName,
                    data: graphData
                }, {
                    turboThreshold: 0,
                    color: 'rgba(211,0,21,0.5)',
                    name: graphMirrorName,
                    data: graphDataMirror
                }]
            }));
        });
        $('.h-lup__tab_item.loading').removeClass('loading');
    }

    var updateCharts = function (charts, data) {
        $(charts).each(function () {

            var identificators = $(this.container).parent().attr('id').replace('container_', '').split('_');
            var currentChart = this;

            $(data).each(function () {
                if (this.Symbol.Exchange == identificators[0]
                    && this.Symbol.Name == identificators[1]
                    && this.Symbol.Currency == identificators[2]) {

                    var additionalValues = this.Ticks.slice(this.Ticks.length - (this.Ticks.length - currentChart.series[0].points.length))

                   // console.log('Ticks = ' + this.Ticks.length + " Series = " + currentChart.series[0].points.length + " Add = " + additionalValues.length);

                    $(additionalValues).each(function () {
                        currentChart.series[0].addPoint({ x: this.Time.replace('/Date(', '').replace(')/', '') * 1, y: this.Close.toFixed(2) * 1 });
                        currentChart.series[1].addPoint({ x: this.Time.replace('/Date(', '').replace(')/', '') * 1, y: (1 - this.Close).toFixed(2) * 1 });
                    });
                }
            });

        });
    }

}