import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
} from '../constants/ActionTypesNewFeedExchange';


const initialState = {
    ...globalData.AppData,
    PlayersTeam1: {positions: {}, players: []},
    PlayersTeam2: {positions: {}, players: []},
    CurrentEventId: Object.keys(globalData.AppData.TimeEvent)[0],
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
            const [ Players, CurrentEventId, markPlayers ]  = action.payload;
            state.Players = Players;
            if (Players.length) markPlayers(state);
            return {...state, CurrentEventId};

        default:
            return state
    }

}