/**
 * Created by Vlasakh on 28.12.2016.
 */

import { Common } from "../common/Common";

abstract class BaseActions
{
    protected connectedActions : any = {};


    public setConnectedActions(inObj)
    {
        return (dispatch, getState) => {
            this.connectedActions = inObj;
        }
    }



    public export()
    {
        let methods : any = {};
        for( let ii in this )
        {
            if (Common.inArray(ii, ['export', 'constructor'])) continue;
            let val : any = this[ii];

// 0||console.debug( 'val', val );
            if (typeof val == 'function') methods[ii] = val.bind(this);
            // methods[ii] = val;
        } // endfor

        return methods;
    }
}

export default BaseActions;