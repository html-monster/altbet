/**
 * Created by Vlasakh on 03.03.2017.
 */

import {
    ON_CHECK_FIELDS,
} from '../constants/ActionTypesRegister';


const initialState = {
    // marketsData: appData.pageHomeData ? appData.pageHomeData.Data : null,
};


export default function registerBox(state = initialState, action)
{
    switch (action.type)
    {
        case ON_CHECK_FIELDS:
            return {...state, isTraiderOn: action.payload};

        default:
            return state
    }
}