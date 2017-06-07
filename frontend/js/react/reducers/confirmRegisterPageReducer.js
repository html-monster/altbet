import {
    ON_SEND_CONFIRMATION,
} from '../constants/ActionTypesPageConfirmRegister';


const initialState = {
    pageEventData: appData.pageEventData,
    socket: { activeOrders: null, bars: null },
    isTraiderOn: false,
    Chart: {
            ChartObj: null,
            types: null,
        },
};


export default function confirmRegisterPage(state = initialState, action)
{
    switch (action.type) {
        case ON_SEND_CONFIRMATION:
            return {...state };

        default:
            return state;
    }

}