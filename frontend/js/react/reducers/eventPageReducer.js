import {
    ON_CHART_MOUNT,
    ON_CHART_TYPE_CHANGE,
    ON_SOCKET_MESSAGE,
    ON_TRADE_ONOFF,
} from '../constants/ActionTypesPageEvent';


const initialState = {
    pageEventData: appData.pageEventData,
    socket: { activeOrders: null, bars: null },
    isTraiderOn: false,
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

        case ON_TRADE_ONOFF:
            // 0||console.log( 'action.payload', action.payload );
            return {...state, isTraiderOn: action.payload};

        case ON_SOCKET_MESSAGE:
                let newVar = {...state, socket: { activeOrders: action.payload.activeOrders, bars: action.payload.bars }};
                // 0||console.debug( 'newVar', newVar );
            return newVar;

        default:
            return state;
    }

}