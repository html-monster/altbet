import {
    ON_SEND_CONFIRMATION,
} from '../constants/ActionTypesPageConfirmRegister';


const initialState = {
    confirmPageData: appData.ConfirmPageData,
    sendConfirmation: {
        ErrorMessage: '',
        Success: false,
        sending: false,
    },
};


export default function confirmRegisterPage(state = initialState, action)
{
    switch (action.type)
    {
        case ON_SEND_CONFIRMATION:
            const { ErrorMessage, Success } = action.payload;
            return {...state, sendConfirmation: {sending: !state.sendConfirmation.sending, ErrorMessage, Success }};

        default:
            return state;
    }

}