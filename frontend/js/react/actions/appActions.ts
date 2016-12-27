/**
 * Created by Vlasakh on 27.12.2016.
 */

import {
    SET_INSTANCE,
    ADD_CONTROLLER,
} from "../constants/ActionTypesRApp.js";


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


export function setInstance(that)
{
    return (dispatch, getState) =>
    {
        dispatch({
            type: SET_INSTANCE,
            payload: that
        });
    }
}


export function addController(name, that)
{
    return (dispatch, getState) =>
    {
        dispatch({
            type: ADD_CONTROLLER,
            payload: {name, that}
        });
    }
}

