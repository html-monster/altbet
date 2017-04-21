import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
} from '../constants/ActionTypesNewFeedExchange';


const initialState = {
    ...globalData.AppData,
    PlayersTeam1: {positions: {}, players: []},
    PlayersTeam2: {positions: {}, players: []},
};


export default function newFeedExchange(state = initialState, action)
{
    switch (action.type)
    {
        case ON_ADD_TEAM_PLAYER:
            state = action.payload(state);
            return {...state};

        case ON_DEL_TEAM_PLAYER:
            state = action.payload(state);
            return {...state};

        case ON_CHANGE_EVENT:
            state = action.payload(state);
            // action.payload(state);
            return {...state};

        default:
            return state
    }

}