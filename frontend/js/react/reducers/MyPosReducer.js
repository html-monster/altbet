/**
 * Created by Vlasakh on 16.01.2017.
 */

import {
    BALVAN,
} from '../constants/ActionTypesMyPos';


const initialState = {
    openOrdersData: appData.openOrdersData,
    positionData: appData.positionData,
    historyData: appData.historyData,
};


export default function myPosReduce(state = initialState, action)
{
    switch (action.type)
    {
        case BALVAN:
            // 0||console.debug( 'state', state );
            // 0||console.debug( 'newVar', newVar );
            return {...state, marketsData: action.payload};

        default:
            return state
    }
}