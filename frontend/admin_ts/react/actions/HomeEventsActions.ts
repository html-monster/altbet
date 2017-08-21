import {
    ON_GET_NEW_TABLE_DATA,
    ON_SET_EDITED_EVENT_DATA,
} from '../constants/ActionTypesHomeEvents.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig} from '../../inc/MainConfig';


var __DEBUG__ = !true;

declare let orderClass;

export default class Actions extends BaseActions
{
    /**
     * Get new events data
     */
    public actionGetNewTableData({props, callback})
    {
        return (dispatch, getState) =>
        {
            const ajaxPromise = (new AjaxSend()).send({
                formData: props,
                type: 'GET',
                message: `Error while get new data from server`,
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GET_EVENTS,
            });


            ajaxPromise.then( result =>
                {
                    0||console.log( 'result', result );
                    dispatch({
                        type: ON_GET_NEW_TABLE_DATA,
                        payload: this.setNewTableData.bind(this, {Model: result.data.Model, callback}),
                    });
                },
                result => {
                    0||console.log( 'result', result );
                    callback && callback({errorCode: -100, title: 'Warning', message: result.message})
                });
        };
    }


    /**
     * Add team player action
     */
    public actionSetEditedEventData(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_SET_EDITED_EVENT_DATA,
                payload: this.setEditedEventData.bind(this, inProps),
            });
        };
    }


    /**
     * Set new table data
     */
    private setEditedEventData({data}, state)
    {
        __DEV__&&console.log( '{p1, p2, state}', {data} );
        for( let ii in state.Exchanges )
        {
            let val = state.Exchanges[ii];

            __DEV__&&console.log( 'val.Symbol.Name, data.Name', val.Symbol.Exchange, data.Exchange );
            if( val.Symbol.Exchange === data.Exchange )
            {
                state.Exchanges[ii].Symbol = {...val.Symbol, ...data};
                break;
            } // endif
        } // endfor
                __DEV__&&console.log( '{p1, p2, state}', {Symbol: state.Exchanges[0].Symbol} );


        return state;
    }


    /**
     * Set new table data
     */
    private setNewTableData({Model, callback}, state)
    {
        callback && callback({errorCode: 100, title: '', message: ''});
        return {...state, ...Model};
    }
}
