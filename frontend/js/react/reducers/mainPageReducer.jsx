import {
    ON_SOCKET_MESSAGE,
    // ON_CHART_TYPE_CHANGE,
} from '../constants/ActionTypesPageMain';


const initialState = {
    marketsData: appData.pageHomeData,
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

        default:
            return state
    }

}