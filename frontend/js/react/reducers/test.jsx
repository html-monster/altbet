import {
    ON_CHART_MOUNT,
    ON_CHART_TYPE_CHANGE,
} from '../constants/ActionTypesPageEvent';


const initialState = {
    pageEventData: appData.pageEventData,
    Chart: {
        ChartObj: null,
        types: null,
    },
};


export default function test(state = initialState, action)
{
    switch (action.type) {
        case ON_CHART_MOUNT:
            state.Chart.ChartObj = action.payload.Chart;
            state.Chart.types = action.payload.types;
            return {...state };

        case ON_CHART_TYPE_CHANGE:
            return {...state, name: action.payload, error: ''};

        default:
            return state
    }

}