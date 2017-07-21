/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    SETTING_ON_FILE_LOAD,
    SETTING_LOAD_FILE_ERROR,
    SETTING_CHANGE_PROGRESS_BAR,
} from '../constants/ActionTypesGidxVerification.js';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    // public static USING_TEAM = 1;


    private initialState = {
        loadProgress: 0,
        loadError: '',
        files: [], //globalData.userPageOn ? appData.pageAccountData.jsonImageInfo : null
        config: {
            maxFiles: 6,
        }
    };



    init()
    {
        /*let loadedData = {};
        this.initialState = {...this.initialState, ...loadedData};*/
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
		case SETTING_ON_FILE_LOAD:
            0||console.info( 'SETTING_ON_FILE_LOAD action.payload', action.payload );
			return {...state, files: action.payload};

		case SETTING_CHANGE_PROGRESS_BAR:
			return {...state, loadProgress: action.payload};

		case SETTING_LOAD_FILE_ERROR:
			return {...state, loadError: action.payload};

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