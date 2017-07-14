/**
 * Created by Vlasakh on 05.07.17.
 */

import { Common } from "./Common";


export class Framework
{
    /**
     * Init reducer and export action processor
     * @param Reducer
     * @return actionsHandler
     */
    public static getHandler(Reducer)
    {
        const $Reducer = new Reducer();
        return $Reducer.actionsHandler.bind($Reducer);
    }


    /**
     * Init actions
     * @param Actions
     * @return object
     */
    public static initAction(Actions)
    {
        let $obj = new Actions();
        return ($obj).export();

        // let methods : any = {};
        // for( let ii in $obj )
        // {
        //     if (Common.inArray(ii, ['export', 'constructor'])) continue;
        //     let val : any = $obj[ii];
        //
        //     if (typeof val == 'function') methods[ii] = val.bind(this);
        // } // endfor
        //
        // return methods;
    }


}