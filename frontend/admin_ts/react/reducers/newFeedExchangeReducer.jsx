// import {
//     ON_POS_PRICE_CLICK,
//     ON_SOCKET_MESSAGE,
//     ON_BASIC_MODE_CH,
//     TRAIDER_MODE_CH,
// } from '../constants/ActionTypesPageMain';


const initialState = {
    AppData: globalData.AppData || {},
};


export default function newFeedExchange(state = initialState, action)
{
    switch (action.type)
    {
        // case TRAIDER_MODE_CH:
        //     return {...state, isTraiderOn: action.payload};

        default:
            return state
    }

}