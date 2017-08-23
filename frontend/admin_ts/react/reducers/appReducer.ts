/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
	ON_CH_TEST_MODE,
} from '../constants/ActionTypesApp.js';
/// TS_IGNORE
// import {Common} from "../common/Common";



export default class Reducer
{
    private initialState = {
        TestMode: false,    // radio in user menu
        admDevUsers: globalData.admDevUsers, // admin dev users
        isAdmin: false,     // is admin user
        UserData: globalData.UserData,
    };



    init()
    {
        let loadedData = {};
        const { UserData: {userName}, admDevUsers } = this.initialState;

        // set is admin flag
        this.initialState.isAdmin = admDevUsers.indexOf(userName) != -1;
        this.initialState = {...this.initialState, ...loadedData};
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case ON_CH_TEST_MODE:
                return {...state, TestMode: action.payload};

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
