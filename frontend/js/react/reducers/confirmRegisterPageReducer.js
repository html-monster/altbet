import {
    ON_SEND_CONFIRMATION,
} from '../constants/ActionTypesPageConfirmRegister';


const initialState = {
    confirmPageData: appData.ConfirmPageData,
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