/**
 * Created by Vlasakh on 22.12.2016.
 */

/// <reference path="../../.d/common.d.ts" />

export class DateLocalization
{
    private currentTimestamp = 0;
    private dateTime = null;


    /**
     * Convert C# excellent format to unixtimestamp
     * @param inDate String
     * @return unixtimestamp
     */
    public fromSharp(inDate, inReturn = 1, props = {TZOffset: true})
    {
        let retval, isNumber = defaultMethods.getType(inDate) === 'Number';
        try {
            // "/Date(1489287600000+0000)/"
            if(isNumber) console.warn('date type is Number');

            retval = this.currentTimestamp = isNumber ?  inDate : inDate.match(/(\d+)/i)[1] * 1;

            // time zone offset
            if (props.TZOffset) retval -= (new Date()).getTimezoneOffset() * 60 * 1000;

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
    public unixToLocalDate(inProps: any = {timestamp: '', format: 'MM/DD/Y', TZOffset: 0})
    {
        let ts : any = inProps.timestamp;
        if (!ts) ts = this.currentTimestamp;

        // time zone offset
        if (inProps.TZOffset)
        {
            if(inProps.TZOffset === 1) ts += (new Date()).getTimezoneOffset() * 60 * 1000;
            else ts -= (new Date()).getTimezoneOffset() * 60 * 1000;
        }

        return ts > 0 ? moment.unix(ts/1000).format(inProps.format) : undefined;
        // return ts > 0 ? moment.unix(ts/1000).utcOffset(moment().utcOffset()).format(inProps.format) : undefined;
        // return ts > 0 ? moment.unix(ts/1000).utc().format(inProps.format) : undefined;
    }


    /**
     * Real UTC format
     * @param inDate
     * @param {number} inReturn
     * @returns {DateLocalization}
     */
    public fromSharp2(inDate, inReturn = 1, props = {})
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
     * Convert native Date to string date with format and localization
     * @param dateTime
     * @return {string}
     */
    public toLocalDate(inProps = {dateTime: '', format: 'MM/DD/Y'})
    {
        let dt : any = inProps.dateTime;
        if (!dt) dt = this.dateTime;
        return dt != null ? moment(dt).format(inProps.format) : undefined;
    }
}