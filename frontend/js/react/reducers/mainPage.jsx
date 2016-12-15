import {
    ON_TEST,
    // ON_CHART_TYPE_CHANGE,
} from '../constants/ActionTypesPageMain';


const initialState = {
    pageEventData: appData.pageEventData,
    Chart: {
        ChartObj: null,
        types: null,
    },
};


export default function mainPage(state = initialState, action)
{
    switch (action.type)
    {
        case ON_TEST:
            return {...state, name: action.payload, error: ''};

        default:
            return state
    }

}