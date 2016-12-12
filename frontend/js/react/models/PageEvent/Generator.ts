declare let Highcharts;
declare let moment;

let __HiDEV__ = !true;

/**
 * Generator for chart's virtual point
 *
 * Created by Vlasakh on 01.12.16.
 */
export class Generator
{
    private genTickTime = 30; // generate new point, seconds
    private FLAG_GEN_STARTED = 0;
    private genLastPoint = 0;
    // private flagForceStop = true; // !!!!!!!!!!!!!!!
    private flagForceStop = false;

    private flagActive = false;
    private TiGenerator = [];
    private chartObj = null; // chart object


    /**
     * Start generator
     */
    public start(inChartObj = null)
    {
        if (this.flagForceStop) return;
// __HiDEV__||console.debug( 'start' );
// return;
        inChartObj && (this.chartObj = inChartObj);

        if( !this.TiGenerator.length )
        {
            this._startGenerator();
            this.addPoint();
        }
    };



    /**
     * Restart generator
     */
    public restart()
    {
        if( this.TiGenerator.length )
        {
            this.cancel();
            this.start();
        } // endif
    }



    /**
     * Generates new virtual point
     */
    public addPoint()
    {
// __HiDEV__||console.debug( 'addPoint' );
        // for turn off generator
        if (this.flagForceStop) return;


        var data = Highcharts.charts[0].series[0].options.data;

        if( data.length )
        {
            // delete virtual point
            this.genLastPoint > 0 && this._deleteVirtPoint();

            // Set virtual point
            let yy = data[data.length-1].y;

            // d1.toUTCString();
            let time = (new Date()).getTime() - (new Date()).getTimezoneOffset() * 60 * 1000; // correct with timezone
            // time -= 60 * 1000; // minus 1 min

            // __HiDEV__||console.debug( 'time', time, moment.unix(time/1000), moment.unix(data[data.length-1].x/1000), data[data.length-1] );

            try {
                Highcharts.charts[0].series[0].addPoint({
                    x: Math.floor(time),
                    // x: moment().unix() * 1000,
                    y: yy,
                    open: data[data.length-1].open,
                    close: data[data.length-1].close,
                    min: data[data.length-1].min,
                    max: data[data.length-1].max,
                    vol: data[data.length-1].vol,
                    virtual: true,
                    current: moment().format("Do, h:mm:ss a")
                }, true);

                // Highcharts.charts[0].redraw();


            } catch (e) {
                // __HiDEV__&&console.debug( 'set v point', e.getMessage() );
            }


            this.genLastPoint = data.length-1;
        } // endif
// __HiDEV__||console.debug( 'this.chartObj', this.chartObj );
        // this.chartObj && this.chartObj.redraw();
        // __DEV__||console.groupCollapsed("Chart 0 data");
        // __DEV__||console.debug( 'Highcharts.charts[0].series[0].options.data', JSON.stringify(Highcharts.charts[0].series[0].options.data) );
        // __DEV__||console.groupEnd();


        // prevTi && this._startGenerator();
    };



    /**
     * Cancel virtual point and stop generator
     */
    public cancel()
    {
        // __HiDEV__||console.warn( 'Try cancel' );
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
        // __HiDEV__||console.debug( 'this.TiGenerator', this.TiGenerator );
    };



    /**
     * delete virtual point from real data
     */
    private _deleteVirtPoint()
    {
        // var data = Highcharts.charts[0].series[0].options.data;
        // this.genLastPoint && data.splice(this.genLastPoint, 1);
        this.genLastPoint = 0;
        this.chartObj.setChartData(null, true);
    };



    /**
     * stop generator Timer
     * @private
     */
    private _stopTimer()
    {
        // __HiDEV__||console.debug( 'this.TiGenerator.length', this.TiGenerator.length );
        while( this.TiGenerator.length )
        {
            clearInterval(this.TiGenerator[0]);
            this.TiGenerator.pop();
        } // endwhile
        // __HiDEV__||console.debug( 'this.TiGenerator.length', this.TiGenerator.length );

        this.flagActive = false;
    }
}