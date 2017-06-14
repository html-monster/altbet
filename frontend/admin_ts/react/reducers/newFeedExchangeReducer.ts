/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
    ON_ENTER_PPG,
    ON_ADD_TEAM_UP_PLAYER,
} from '../constants/ActionTypesNewFeedExchange';


class Reducer
{
    private initialState = {
        ...globalData.AppData,
        PlayersTeam1: {positions: {}, players: []},
        PlayersTeam2: {positions: {}, players: []},
        Positions: null,
        CurrentEventId: null,
        uniPositionName: 'Util',
        uniPositionIndex: 5,
    };


    constructor()
    {
        this.initialState.Positions = this.preparePositions(globalData.AppData.Positions);
        // load saved teams
        // this.initialState = {...this.initialState, ...this.loadData()};
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case ON_ADD_TEAM_PLAYER:
                state = this.addTeamPlayer(action.payload, state);
                return {...state};

            case ON_ADD_TEAM_UP_PLAYER:
                state = this.addTeamUPPlayer(action.payload, state);
                return {...state};

            case ON_DEL_TEAM_PLAYER:
                state = this.delTeamPlayer(action.payload, state);
                return {...state};

            case ON_ENTER_PPG:
                state = this.setPPGValues(action.payload, state);
                return {...state};

            case ON_CHANGE_EVENT:
                state = this.setCurrentEvent(action.payload, state);
                return {...state};

            default:
                return state
        }
    }


    /**
     * Load user teams data
     * @return {PlayersTeam1, PlayersTeam2, CurrentEventId}
     */
    private loadData() : {PlayersTeam1, PlayersTeam2, CurrentEventId}
    {
        let $CurrentEventId = globalData.AppData && globalData.AppData.TimeEvent.length ? globalData.AppData.TimeEvent[0] : "";
        let data : any = localStorage.getItem('newFeedExchange');

        if( data )
        {
            data = JSON.parse(data);

            if( $CurrentEventId && data.CurrentEventId.EventId == $CurrentEventId.EventId ) return data;
        } // endif

        return {
            PlayersTeam1: {positions: {}, players: []},
            PlayersTeam2: {positions: {}, players: []},
            CurrentEventId: $CurrentEventId,
        };
    }


    /**
     * Save user teams data
     * @param state {PlayersTeam1, PlayersTeam2, CurrentEventId}
     */
    private saveData({ PlayersTeam1, PlayersTeam2, CurrentEventId })
    {
        let data = { PlayersTeam1, PlayersTeam2, CurrentEventId };
        localStorage.setItem('newFeedExchange', JSON.stringify(data));
    }


    private preparePositions(inPositions)
    {
        let res = [];
        inPositions.forEach((val) => {
            res[val.Index] = val;
        });
        return res;
    }



    /**
     * Add player to said team
     */
    private addTeamPlayer({player, team}, state)
    {
        let $Team = state["PlayersTeam"+team];
        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = team;
                $Team.players.push(val);
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team] = this.sortTeam($Team);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        this.markPlayers(state);

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Add universal player to said team
     */
    private addTeamUPPlayer({player, team}, state)
    {
        console.debug( 'uni pl', 0 );
        let $Team = state["PlayersTeam"+team];
        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = team;
                val.meta = { PositionOrig: val.Position,
                    IndexOrig: val.Index,
                };
                val.Index = state.uniPositionIndex;
                val.Position = state.uniPositionName;
                $Team.players.push(val);
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team] = this.sortTeam($Team);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        this.markPlayers(state);

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Sort team by positions and name
     */
    private sortTeam(itms)
    {
        itms.players.sort(sortFunction);

        return itms;

        function sortFunction(aa, bb)
        {
            aa = {...aa};
            bb = {...bb};
            if (aa["Index"] < 10 ) aa["Index"] = "0" + aa["Index"];
            if (bb["Index"] < 10 ) bb["Index"] = "0" + bb["Index"];

            if (aa["Index"] + aa["Name"] === bb["Index"] + bb["Name"]) {
                return 0;
            }
            else {
                return (aa["Index"] + aa["Name"] < bb["Index"] + bb["Name"]) ? -1 : 1;
            }
        }
    }


    /**
     * Recount team used positions
     */
    private recountPositions(inTeam)
    {
        inTeam.positions = {};
        for( let val of inTeam.players  )
        {
            let itm : any = inTeam.positions[val['Index']];
            inTeam.positions[val['Index']] = (itm||0) + 1;
        } // endfor

        return inTeam;
    }


    /**
     * Recount team used positions
     */
    private markPlayers(state)
    {
        // reset players states
        state.Players.forEach((val) => val.used = false);

        // set team1 players states
        for( let val of state.PlayersTeam1.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id ) { val2.used = 1; } // endif;
            } // endfor
        }

        // set team2 players states
        for( let val of state.PlayersTeam2.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id ) { val2.used = 2; } // endif;
            } // endfor
        }
    }



    /**
     * Add team player action
     */
    private setPPGValues({player, team, type, num}, state)
    {
        let $Team = state["PlayersTeam"+team];
        for( let val of $Team.players )
        {
            if( player.Id == val.Id )
            {
                val[type] = num;
                break;
            } // endif;
        } // endfor

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Remove player from said team
     */
    private delTeamPlayer({player, team}, state)
    {
        // remove from team
        let $Team = state["PlayersTeam"+team];
        for( let ii in $Team.players  )
        {
            let val = $Team.players[ii];
            if( player.Id == val.Id )
            {
                val.used = false;
                val.Index = val.meta.IndexOrig;
                val.Position = val.meta.PositionOrig;
                val.meta = null;
                $Team.players.splice(ii, 1);
                break;
            } // endif;
        } // endfor


        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        this.markPlayers(state);

        // save teams data
        this.saveData(state);

        return state;
    }



    /**
     * Change current event in dropbox
     */
    private setCurrentEvent(inProps, state)
    {
        const [ Players, CurrentEventId ]  = inProps;
        state.Players = Players;
        if (Players.length) this.markPlayers(state);
        return {...state, CurrentEventId};
    }
}


const $Reducer = new Reducer();
export default $Reducer.actionsHandler.bind($Reducer);