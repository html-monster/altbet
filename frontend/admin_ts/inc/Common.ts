/**
 * Created by Vlasakh on 05.01.2017.
 */

declare var Promise;

export default class Common
{
    public static sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    public static createUrlAlias(inStr)
    {
        return inStr.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/[ ]/g, "-").toLowerCase();
    }


    /**
     * @param Array inData
     * @return Array
     */
    public static feelDropDown(inData) : any
    {
        var data = [];

        if( Array.isArray(inData) )
        {
            for( let ii = 0, countii = inData.length; ii < countii; ii++ )
            {
                data.push({id: ii, text: inData[ii]});
            } // endfor
        }
        else
        {
            for( let ii in inData )
            {
                let val = inData[ii];
                data.push({id: ii, text: val});
            } // endfor
        } // endif

        return data;
    }
}