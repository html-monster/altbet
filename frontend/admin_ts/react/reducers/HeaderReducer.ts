/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    ON_TEST_MODE,
} from '../constants/ActionTypesHeader.js';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    // public static USING_TEAM = 1;


    private initialState = {
        // Players: [],
        admUsers: [ "java", "vova" ],
        isAdmin: false,
        ...globalData.HeaderData,
    };



    init()
    {
        let loadedData = {};
        const { userName, admUsers } = this.initialState;

        // set is admin flag
        this.initialState.isAdmin = admUsers.indexOf(userName) != -1;

        this.initialState = {...this.initialState, ...loadedData};
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case ON_TEST_MODE:
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