/// <reference path="../../.d/common.d.ts" />

declare let globalData;

import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
    ON_ENTER_PPG,
    ON_ADD_TEAM_UP_PLAYER,
    ON_CHANGE_EVENTS_PERIOD,
    ON_ADD_TEAM_PLAYER_RESERVE,
} from '../constants/ActionTypesNewFeedExchange';



class Reducer
{
    public static USING_TEAM = 1;
    public static USING_TEAM_UP = 2;
    public static USING_RESERVE = 3;
    public static USING_VARIABLE = 4;


    private initialState = {
        Players: [],
        PlayersTeam1: {positions: {}, players: []},
        PlayersTeam1Reserve: {players: []},
        PlayersTeam2: {positions: {}, players: []},
        PlayersTeam2Reserve: {players: []},
        Positions: null,
        CurrentEventId: null,
        UPlayerData: {
            uniPositionName: 'Util',
            uniPositionIndex: 5,
        },
        EventFilter: {'0': '1min', '2': '2h', '4': '4h', '8': '8h'},
        Rules: {
            reserveLen: 5, // reserve players count
        },
        ...globalData.AppData,
    };


    constructor()
    {
        this.initialState.Positions = this.preparePositions(globalData.AppData.Positions);
        // load saved teams
        let loadedData = this.loadData();
        this.initialState = {...this.initialState, ...loadedData};
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

            case ON_ADD_TEAM_PLAYER_RESERVE:
                state = this.addTeamPlayerReserve(action.payload, state);
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

            case ON_CHANGE_EVENTS_PERIOD:
                state = this.setEventsPeriod(action.payload, state);
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

            if( $CurrentEventId && data.CurrentEventId && data.CurrentEventId.EventId == $CurrentEventId.EventId )
            {
                this.initialState.Players.map((val, key) => {
                    if (val.ID == data.Players[key].Id && data.Players[key].used)
                    {
                        val.usedTeam = data.Players[key].usedTeam;
                        val.used = data.Players[key].used;
                    }
                    return val
                });

                return data;
            }
        } // endif

        return {
            PlayersTeam1: {positions: {}, players: []},
            PlayersTeam2: {positions: {}, players: []},
            CurrentEventId: $CurrentEventId,
        };
    }


    /**
     * Save user teams data
     * @param state {PlayersTeam1, PlayersTeam2, CurrentEventId, Players}
     */
    private saveData({ PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, CurrentEventId, Players })
    {
        let data = { PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, CurrentEventId, Players };
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
                val.used = Reducer.USING_TEAM;
                val.usedTeam = team;
                $Team.players.push(val);
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

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
        let $Team = state["PlayersTeam"+team];
        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = Reducer.USING_TEAM_UP;
                val.usedTeam = team;
                val.meta = { PositionOrig: val.Position,
                    IndexOrig: val.Index,
                };
                val.Index = state.UPlayerData.uniPositionIndex;
                val.Position = state.UPlayerData.uniPositionName;
                $Team.players.push(val);
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        this.markPlayers(state);

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Add reserve player to said team
     */
    private addTeamPlayerReserve({player, team}, state)
    {
        let $Team = state[`PlayersTeam${team}Reserve`];
        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = Reducer.USING_RESERVE;
                val.usedTeam = team;
                $Team.players.push(val);
                break;
            } // endif;
        } // endfor

        state[`PlayersTeam${team}Reserve`].players = this.sortTeam($Team.players);

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
        itms.sort(sortFunction);

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
        /*state.Players.forEach((val) => val.used = false);

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
        }*/
    }



    /**
     * Add team player action
     */
    private setPPGValues({player, team, type, num}, state)
    {
        let $Team = state[team];
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
    private delTeamPlayer({player, team, used}, state)
    {
        0||console.log( '{player, team, used}', {player, team, used} );
        // remove from team
        switch( used )
        {
            case 1:
            case 2 : team = "PlayersTeam"+team; break;
            case 3 : team = `PlayersTeam${team}Reserve`; break;
        }

        let $Team = state[team];
        for( let ii in $Team.players  )
        {
            let val = $Team.players[ii];
            if( player.Id == val.Id )
            {
                if( val.used === 2 )
                {
                    val.Index = val.meta.IndexOrig;
                    val.Position = val.meta.PositionOrig;
                    val.meta = null;
                } // endif
                val.used = false;
                $Team.players.splice(ii, 1);
                break;
            } // endif;
        } // endfor


        // count positions limits
        state[team] = this.recountPositions($Team);

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


    /**
     * Change current event in dropbox
     */
    private setEventsPeriod(inProps, state)
    {
        const [TimeEvent, Period]  = inProps;
        return {...state, TimeEvent, Period};
    }
}


const $Reducer = new Reducer();
export default $Reducer.actionsHandler.bind($Reducer);