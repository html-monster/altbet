/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    ON_GET_NEW_TABLE_DATA,
} from '../constants/ActionTypesUsers.js';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    // public static USING_TEAM = 1;


    private initialState = {
        // Players: [],
        ...globalData.AppData,
    };



    init()
    {
        let loadedData = {};
        this.initialState = {...this.initialState, ...loadedData};
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case ON_GET_NEW_TABLE_DATA:
                state = action.payload(state);
                return {...state};

            default:
                this.init();
                return state
        }
    }



    /**
     * Change current event in dropbox
     */
/*
    private setCurrentEvent(inProps, state)
    {
        return {...state};
    }
*/
}

//
// const $Reducer = new Reducer();
// export default $Reducer.actionsHandler.bind($Reducer);