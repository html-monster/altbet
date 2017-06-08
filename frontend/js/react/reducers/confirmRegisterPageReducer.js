import {
    ON_SEND_CONFIRMATION,
} from '../constants/ActionTypesPageConfirmRegister';


const initialState = {
    confirmPageData: appData.ConfirmPageData,
    sendConfirmationErrorMessage: "",
    sendConfirmationSuccess: undefined,
    sendConfirmation: false,
};


export default function confirmRegisterPage(state = initialState, action)
{
    switch (action.type) {
        case ON_SEND_CONFIRMATION:
            return {...state, sendConfirmation: !state.sendConfirmation, sendConfirmationErrorMessage: action.payload.message, sendConfirmationSuccess: action.payload.success };

        default:
            return state;
    }

}