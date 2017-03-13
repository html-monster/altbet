/**
 * Created by Vlasakh on 27.12.2016.
 */

import {
    SET_INSTANCE,
    ADD_CONTROLLER,
} from "../constants/ActionTypesRApp.js";

import BaseActions from './BaseActions';
import {WebsocketModel} from '../models/Websocket';



class Actions extends BaseActions
{
    public actionOnLoad()
    {
        return (dispatch, getState) =>
        {
            // activate websocket
            ABpp.Websocket = new WebsocketModel();
            ABpp.Websocket.connectSocketServer();
            globalData.Websocket = ABpp.Websocket; // for debug
            
            
            Visibility.change(function (e, state) {
                0||console.log( 'Visibility', Visibility.state() );
            });
/*
            dispatch({
                type: SET_INSTANCE,
                payload: that
            });
*/
        }
    }
    
    
    public setInstance(that)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: SET_INSTANCE,
                payload: that
            });
        }
    }


    public addController(name, that)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ADD_CONTROLLER,
                payload: {name, that}
            });
        }
    }
}


export default (new Actions()).export();

// class RAppActions
// {
//     static setInstance(that)
//     {
//     0||console.debug( 'setInstance func' );
//         return (dispatch, getState) =>
//         {
//             dispatch({
//                 type: SET_INSTANCE,
//                 payload: {}
//             });
//         }
//     }
// }
// export default RAppActions;
