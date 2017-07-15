/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    WITHDRAW_QUANTITY_CHANGE,
    WITHDRAW_QUANTITY_VALIDATE,
} from '../constants/ActionTypesGidxCashier.js';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    private initialState = {
        approved: false,
        // data: appData.pageAccountData,
        depositQuantity: '',
        form: null,
        validationMessage: appData.Gidx ? appData.Gidx.response : '',
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
            case WITHDRAW_QUANTITY_CHANGE:
                return {...state, depositQuantity : action.payload, validationMessage: ''};

            case WITHDRAW_QUANTITY_VALIDATE:
                return {...state, sumValidation : action.payload};

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