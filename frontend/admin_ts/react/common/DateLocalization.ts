/**
 * Created by Vlasakh on 22.12.2016.
 */

declare var moment;

export class DateLocalization
{
    private currentTimestamp = 0;
    private dateTime : Date = null;

    /**
     * Convert C# excellent format to unixtimestamp
     * @param inDate String
     * @return unixtimestamp
     */
    public fromSharp(inDate, inReturn = 1, props = {TZOffset: true})
    {
        let retval ;
        try {
            // "/Date(1489287600000+0000)/"
            retval = this.currentTimestamp = inDate.match(/(\d+)/i)[1] * 1;
            if (props.TZOffset) retval -= (new Date()).getTimezoneOffset() * 60 * 1000;
            // retval = this.currentTimestamp = inDate.replace('/Date(', '').replace(')/', '') * 1 - (new Date()).getTimezoneOffset() * 60 * 1000;
        } catch (e) {
            retval = undefined;
        }
            return inReturn ? retval : this;
    }


    /**
     * Real UTC format
     * @param inDate
     * @param {number} inReturn
     * @returns {DateLocalization}
     */
    public fromSharp2(inDate, inReturn = 1, props = {TZOffset: false})
    {
        let retval ;
        try {
            // "/Date(1489287600000+0000)/"
            retval = this.dateTime = new Date(Date.parse(inDate));
            // if (props.TZOffset) retval -= (new Date()).getTimezoneOffset() * 60 * 1000;
        } catch (e) {
            retval = undefined;
        }
            return inReturn ? retval : this;
    }


    /**
     * Convert unix timestamp to string date with format and localization
     * @param inTimeStamp
     * @return {string}
     */
    public unixToLocalDate(inProps = {timestamp: '', format: 'MM/DD/Y'})
    {
        let ts : any = inProps.timestamp;
        if (!ts) ts = this.currentTimestamp;
        return ts > 0 ? moment.unix(ts/1000).format(inProps.format) : undefined;
    }



    /**
     * Convert native Date to string date with format and localization
     * @param dateTime
     * @return {string}
     */
    public toLocalDate(inProps = {dateTime: '', format: 'MM/DD/Y', TZOffset: false})
    {
        let dt : any = inProps.dateTime;
        if (!dt) dt = this.dateTime;

        if( inProps.TZOffset ) dt = moment.utc(dt).zone((new Date()).getTimezoneOffset()).format(inProps.format);
        else dt = moment(dt).format(inProps.format);
        // __DEV__&&console.log( '{offset: (new Date()).getTimezoneOffset()}', {offset: (new Date()).getTimezoneOffset(), format: inProps.format, dt} );
        return dt != null ? dt : undefined;
    }



    /**
     * Convert ...
     * @param inTimeStamp
     * @return {string}
     */
    public fromUtcDate(props = {dateTime: '', format: "MM/DD/Y h:mm A", TZOffset: false})
    {
        if( props.TZOffset ) return moment.utc(props.dateTime).zone((new Date()).getTimezoneOffset()).format(props.format);
        else return moment(props.dateTime).format(props.format);
    }
}