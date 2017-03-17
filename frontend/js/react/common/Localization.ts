/**
 * Created by Vlasakh on 22.07.2016.
 */


/**
 * Localization function
 */
// function _t(inStr : string) : string
// {
//     return Localization.translate(inStr);
// }

declare var Strings;


export class Localization
{
    private static Instance : Localization;
    private StringsObj; // phrase object


    private constructor()
    {
        this.StringsObj = new Strings();
    }


    public static translate(inText) : string
    {
        if( !this.Instance ) this.Instance = new Localization();
        return this.Instance.translate(inText);
    }

    public translate(inText) : string
    {
        var self = this;

        var chain = inText.split('.');
        var val : any = self.StringsObj;
        for( var ii in chain )
        {
            var val = val[chain[ii]];
        } // endfor

        return val;
    }
}