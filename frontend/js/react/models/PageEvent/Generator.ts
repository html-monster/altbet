declare let Highcharts;
declare let moment;

/**
 * Generator for chart's virtual point
 *
 * Created by Vlasakh on 01.12.16.
 */
export class Generator
{
    private genTickTime = 3; // generate new point, seconds
    private FLAG_GEN_STARTED = 0;
    private genLastPoint = 0;
    private flagForceStop = true; // !!!!!!!!!!!!!!!
    // private flagForceStop = false;

    private flagActive = false;
    private TiGenerator = [];
    private chartContainer = null; // chart dom node


    /**
     * Start generator
     */
    public start(inChartContainer = null)
    {
        if (this.flagForceStop) return;
// 0||console.debug( 'start' );
// return;
        inChartContainer && (this.chartContainer = inChartContainer);

        if( !this.TiGenerator.length )
        {
            this._startGenerator();
            this.addPoint();
        }
    };



    /**
     * Generates new virtual point
     */
    public addPoint()
    {
0||console.debug( 'addPoint' );
        // for turn off generator
        if (this.flagForceStop) return;

        // let prevTi = this.TiGenerator.length;
// 0||console.debug( 'prevTi, this.TiGenerator', prevTi, this.TiGenerator );
//         this._stopTimer();
0||console.debug( 'this.TiGenerator', this.TiGenerator );
// 0||console.warn( 'prevTi', prevTi );

        var data = Highcharts.charts[0].series[0].options.data;

        if( data.length )
        {
            // delete virtual point
            this.genLastPoint > 0 && data.splice(this.genLastPoint, 1);

            // Set virtual point
            let yy = data[data.length-1].y;

            var d1 = new Date();
            // d1.toUTCString();
            let time = d1.getTime() - new Date().getTimezoneOffset() * 60 * 1000; // correct with timezone

            0||console.debug( 'time', time, moment.unix(time/1000), moment.unix(data[data.length-1].x/1000), data[data.length-1] );

// return ;
            true || Highcharts.charts[0].series[0].addPoint({
                x: Math.floor(time),
                // x: moment().unix() * 1000,
                y: yy,
                virtual: true,
                current: moment().format("Do, h:mm:ss a")
            }, true);


            this.genLastPoint = data.length-1;
        } // endif
        // this.chartContainer && this.chartContainer.redraw();
        console.groupCollapsed("Chart 0 data");
        0||console.debug( 'Highcharts.charts[0].series[0].options.data', JSON.stringify(Highcharts.charts[0].series[0].options.data) );
        console.groupEnd();


        // prevTi && this._startGenerator();
    };



    /**
     * Cancel virtual point and stop generator
     */
    public cancel()
    {
        // 0||console.warn( 'Try cancel' );
        this._stopTimer();

        this._deleteVirtPoint();
    };



    /**
     * @private
     * Start generator
     */
    private _startGenerator()
    {
        var self = this;
        this.flagActive = true;

        var timer = setInterval(function ()
        {
            self.addPoint();
        }, this.genTickTime * 1000);

        this.TiGenerator.push(timer);
        // 0||console.debug( 'this.TiGenerator', this.TiGenerator );
    };



    /**
     * delete virtual point from real data
     */
    private _deleteVirtPoint()
    {
        var data = Highcharts.charts[0].series[0].options.data;
        this.genLastPoint && data.splice(this.genLastPoint, 1);
        this.genLastPoint = 0;
    };



    /**
     * stop generator Timer
     * @private
     */
    private _stopTimer()
    {
        0||console.debug( 'this.TiGenerator.length', this.TiGenerator.length );
        while( this.TiGenerator.length )
        {
            clearInterval(this.TiGenerator[0]);
            this.TiGenerator.pop();
        } // endwhile
        0||console.debug( 'this.TiGenerator.length', this.TiGenerator.length );

        this.flagActive = false;
    }
}