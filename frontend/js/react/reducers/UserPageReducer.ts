/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    SUBSCRIBE_ONE_SIGNAL,
} from '../constants/ActionTypesUserPage.js';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    private initialState = {
        OneSignal : null,
    };



    private init()
    {
        /*let loadedData = {};
        this.initialState = {...this.initialState, ...loadedData};*/
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case SUBSCRIBE_ONE_SIGNAL:
                return {...state, OneSignal: action.payload.OneSignal};


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

