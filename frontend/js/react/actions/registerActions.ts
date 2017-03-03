/**
 * Created by Vlasakh on 03.03.2017.
 */

import {
    ON_CHECK_FIELDS,
} from '../constants/ActionTypesRegister';
import BaseActions from './BaseActions';


// var __LDEV__ = true;
let __LDEV__ = false;

class Actions extends BaseActions
{
    public actionFormSubmit()
    {
        return (dispatch, getState) =>
        {
            let flag = true;


            dispatch({
                type: ON_CHECK_FIELDS,
                payload: []
            });
        }
    }
}

export default (new Actions()).export();
