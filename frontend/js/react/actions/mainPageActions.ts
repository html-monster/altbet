import { ON_SOCKET_MESSAGE } from '../constants/ActionTypesPageMain';
import { WebsocketModel } from '../models/Websocket';


// export function actionOnLoad()
// {
//     return (dispatch) =>
//     {
//         ABpp.Websocket.subscribe()
//
//         __DEV__&&console.warn( 'this', this );
//         dispatch({
//             type: ON_LOAD,
//             payload: {}
//         });
//     }
// }


export function actionOnLoad()
{
    return (dispatch, getState) =>
    {
        ABpp.Websocket.subscribe((inData) =>
        {
            let state = getState().mainPage.marketsData;

            if( JSON.stringify(inData) != JSON.stringify(state) )
            {
// __DEV__&&console.debug( 'inData', inData, state );
                dispatch({
                    type: ON_SOCKET_MESSAGE,
                    payload: inData
                });
//             }
//             else
//             {
// __DEV__&&console.debug('samedata');
            } // endif

        }, WebsocketModel.CALLBACK_MAINPAGE_EXCHANGES);
    }
}
