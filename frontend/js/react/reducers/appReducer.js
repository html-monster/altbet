/**
 * Created by Vlasakh on 27.12.2016.
 */

import {
    SET_INSTANCE,
    ADD_CONTROLLER,
} from "../constants/ActionTypesRApp.js";



const initialState = {
    instance: null,
    controllers: {},
};


export default function appState(state = initialState, action)
{
    switch (action.type) {
        case SET_INSTANCE:
            return {...state, instance: action.payload};

        case ADD_CONTROLLER:
            state.controllers[action.payload.name] = action.payload.that;
            return {...state};

        default:
            return state
    }

}