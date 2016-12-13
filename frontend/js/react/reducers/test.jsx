import { ON_TEST } from '../constants/ActionTypesPageEvent'



const initialState = {
    Ttest: 'hello w',
};


export default function test(state = initialState, action)
{
    switch (action.type) {
        case ON_TEST:
            return {...state, name: action.payload, error: ''};

        default:
            return state
    }

}