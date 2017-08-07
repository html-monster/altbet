/**
 * Created by tianna on 08.02.17.
 */



import {
    ON_BALVAN,
} from '../constants/ActionTypesAccountPage';


const initialState = {
    pageEventData: appData.pageEventData,
    socket: { activeOrders: null, bars: null },
    isTraiderOn: false,
    Chart: {
            ChartObj: null,
            types: null,
        },
};


export default function accountPage(state = initialState, action)
{
    switch (action.type) {
        case ON_BALVAN:
            return {...state };


        default:
            return state;
    }

}