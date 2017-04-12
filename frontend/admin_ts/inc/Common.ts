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


    public static getUrlParams(inStr)
    {
        var queryString = window.location.search || '';
        var keyValPairs = [];
        var params      = {};
        queryString     = queryString.substr(1);

        if (queryString.length)
        {
           keyValPairs = queryString.split('&');
           for (let pairNum in keyValPairs)
           {
              var key = keyValPairs[pairNum].split('=')[0];
              if (!key.length) continue;
              if (typeof params[key] === 'undefined')
                 params[key] = "";
              params[key] = keyValPairs[pairNum].split('=')[1];
           }
        }

        return params;
    }
}