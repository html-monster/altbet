/**
 * Created by Vlasakh on 22.12.2016.
 */


export class DateLocalization
{
    private currentTimestamp;

    /**
     * Convert C# excellent format to unixtimestamp
     * @param inDate String
     * @return unixtimestamp
     */
    public fromSharp(inDate, inReturn = 1)
    {

        let time = this.currentTimestamp = inDate.replace('/Date(', '').replace(')/', '') * 1 - (new Date()).getTimezoneOffset() * 60 * 1000;
        return inReturn ? time : this;
    }


    /**
     * Convert unix timestamp to string date with format and localization
     * @param inTimeStamp
     * @return {string}
     */
    public unixToLocalDate(inTimeStamp : any = '')
    {
        if (!inTimeStamp) inTimeStamp = this.currentTimestamp;
        return moment.unix(inTimeStamp/1000).format('MM/DD/Y');
    }
}