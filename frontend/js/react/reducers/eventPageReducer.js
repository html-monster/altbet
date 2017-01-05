import {
    ON_CHART_MOUNT,
    ON_CHART_TYPE_CHANGE,
    ON_SOCKET_MESSAGE,
} from '../constants/ActionTypesPageEvent';


const initialState = {
    pageEventData: appData.pageEventData,
    socket: { activeOrders: null, bars: null },
    Chart: {
            ChartObj: null,
            types: null,
        },
};


export default function eventPage(state = initialState, action)
{
    switch (action.type) {
        case ON_CHART_MOUNT:
            state.Chart.ChartObj = action.payload.Chart;
            state.Chart.types = action.payload.types;
            return {...state };

        case ON_CHART_TYPE_CHANGE:
            return {...state, name: action.payload, error: ''};

        case ON_SOCKET_MESSAGE:
            // 0||console.debug( 'state', state );
            // 0||console.debug( 'newVar', newVar );
                let newVar = {...state, socket: { activeOrders: action.payload.activeOrders, bars: action.payload.bars }};
            return newVar;

        default:
            return state
    }

}