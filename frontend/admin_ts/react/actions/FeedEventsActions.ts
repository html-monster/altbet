import {
    ON_GET_NEW_TABLE_DATA,
} from '../constants/ActionTypesFeedEvents.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig} from '../../inc/MainConfig';


var __DEBUG__ = !true;

declare let orderClass;

class Actions extends BaseActions
{
    /**
     * Get new events data
     */
    public actionGetNewTableData(inProps, callback)
    {
        return (dispatch, getState) =>
        {
            // let data = new FormData();
            // data.set('EventId', inProps);

            0||console.log( 'inProps', inProps, callback );
            // return;

            const ajaxPromise = (new AjaxSend()).send({
                formData: inProps,
                message: `Error while get new data from server`,
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GET_EVENTS,
            });


            ajaxPromise.then( result =>
                {
                    0||console.log( 'result', result );
                    dispatch({
                        type: ON_GET_NEW_TABLE_DATA,
                        payload: this.setNewTableData.bind(this, {Model: result.data.Model}),
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
    public actionPPGValues(inProps)
    {
        return (dispatch, getState) =>
        {
            setTimeout(() => {
                dispatch({
                    type: ON_GET_NEW_TABLE_DATA,
                    payload: inProps, //this.setPPGValues.bind(this, inProps),
                    // payload: this.setPPGValues.bind(this, inProps),
                })},
                500
            );

            // .data.Model
        };
    }


    /**
     * Set new table data
     */
    private setNewTableData({Model}, state)
    {
        return {...state, ...Model};
    }
}

export default (new Actions()).export();
