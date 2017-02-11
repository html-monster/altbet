/**
 * Created by Vlasakh on 22.12.2016.
 */


export class DateLocalization
{
    private currentTimestamp = 0;

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
}