import {
    ON_POS_PRICE_CLICK,
    ON_SOCKET_MESSAGE,
    ON_BASIC_MODE_CH,
    TRAIDER_MODE_CH,
} from '../constants/ActionTypesPageMain';


const initialState = {
    marketsData: appData.pageHomeData ? appData.pageHomeData.Data : null,
    isBasicMode: globalData.basicMode,
    isTraiderOn: globalData.autoTradeOn,
    activeExchange: {name: '', // exchange unique name
        isMirror: false},
};


export default function mainPage(state = initialState, action)
{
    switch (action.type)
    {
        case ON_SOCKET_MESSAGE:
            // 0||console.debug( 'state', state );
            // 0||console.debug( 'newVar', newVar );
                let newVar = {...state, marketsData: action.payload};
            return newVar;

        case ON_POS_PRICE_CLICK:
            return {...state, activeExchange: {name: action.payload[0], isMirror: action.payload[1]}};

        case ON_BASIC_MODE_CH:
            return {...state, isBasicMode: action.payload};

        case TRAIDER_MODE_CH:
            return {...state, isTraiderOn: action.payload};

        default:
            return state
    }

}