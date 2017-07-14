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
    ON_SET_CURR_TEAM,
    ON_ADD_TEAM_PLAYER_VARIABLE,
    ON_CH_TEAM_NAME,
    ON_GEN_TEAM_NAME,
    ON_CH_FORM_DATA,
    ON_GEN_FULL_NAME,
    ON_GEN_URL,
    ON_SAVE_EVENT_OK,
} from '../constants/ActionTypesNewFeedExchange';
/// TS_IGNORE
import {Common} from "../common/Common";



export default class Reducer
{
    public static USING_TEAM = 1;
    public static USING_TEAM_UP = 2;
    public static USING_RESERVE = 3;
    public static USING_VARIABLE = 4;


    private initialState = {
        Players: [],
        PlayersTeam1: {positions: {}, players: []},
        PlayersTeam1Reserve: {players: []},
        PlayersTeam1Variable: {players: []},
        PlayersTeam2: {positions: {}, players: []},
        PlayersTeam2Reserve: {players: []},
        PlayersTeam2Variable: {players: []},
        Positions: null,
        EventId: null,
        LastEventId: null,
        UPlayerData: {
            uniPositionName: 'Util',
            uniPositionIndex: 5,
        },
        EventFilter: {'0': '1min', '2': '2h', '4': '4h', '8': '8h'},
        Rules: {
            reserveLen: 5, // reserve players count
            variableLen: 5, // reserve players count
        },
        CurrentTeam: {
            num: 1,
            type: 1,
        },
        FormData: {
            teamName1: '',
            teamName2: '',
            startDate: '',
            fullName: '',
            category: '',
            url: '',
        },
        ParentCategory: 'Amer sport',
        ...globalData.AppData,
    };



    init()
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

            case ON_ADD_TEAM_PLAYER_VARIABLE:
                state = this.addTeamPlayerVariable(action.payload, state);
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

            case ON_SET_CURR_TEAM:
                let {type, team} = action.payload;
                return {...state, CurrentTeam: {num: team, type}};

            case ON_CH_TEAM_NAME:
                let {name, teamNum} = action.payload;
                state.FormData[`teamName` + teamNum] = name;
                return {...state};

            case ON_GEN_TEAM_NAME:
                state = this.generateTeamName(action.payload, state);
                return {...state};

            case ON_CH_FORM_DATA:
                state = this.changeFormData(action.payload, state);
                return {...state};

            case ON_GEN_FULL_NAME:
                state = this.generateFullName(action.payload, state);
                return {...state};

            case ON_GEN_URL:
                state = this.generateUrl(action.payload, state);
                return {...state};

            case ON_SAVE_EVENT_OK:
                state = this.saveEventSuccess(action.payload, state);
                return {...state};

            default:
                this.init();
                return state
        }
    }


    /**
     * Load user teams data
     * @return {PlayersTeam1, PlayersTeam2, LastEventId}
     */
    private loadData() : {PlayersTeam1, PlayersTeam2, LastEventId}
    {
        let $LastEventId = globalData.AppData.EventId;
        let data : any = localStorage.getItem('newFeedExchange');

        if( data )
        {
            data = JSON.parse(data);

            // 0||console.log( 'data.CurrentEventId.EventId , $LastEventId.EventId', data.EventId , $LastEventId.EventId );
            if( $LastEventId && data.EventId && data.EventId == $LastEventId )
            {
                // 0||console.log( 'data', data );
                this.initialState.Players.map((val, key) => {
                    if (val && data.Players[key] && val.ID == data.Players[key].Id && data.Players[key].used)
                    {
                        val.StartDate = data.Players[key].StartDate;
                        val.usedTeam = data.Players[key].usedTeam;
                        val.used = data.Players[key].used;
                    }
                    return val
                });

                // common add part
                this.recountStartDate(this.initialState);

                return data;
            }
        } // endif

        return {
            PlayersTeam1: {positions: {}, players: []},
            PlayersTeam2: {positions: {}, players: []},
            LastEventId: $LastEventId,
        };
    }


    /**
     * Save user teams data
     * @param state { PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId }
     */
    private saveData({ PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId, FormData })
    {
        let data = { PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId, FormData };
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
        let addedPlayer;

        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = Reducer.USING_TEAM;
                val.usedTeam = team;
                $Team.players.push(val);
                addedPlayer = val;
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer}, state);

        return state;
    }


    /**
     * Add universal player to said team
     */
    private addTeamUPPlayer({player, team}, state)
    {
        let $Team = state["PlayersTeam"+team];
        let addedPlayer;

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
                addedPlayer = val;
                break;
            } // endif;
        } // endfor

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer}, state);

        return state;
    }


    /**
     * Add reserve player to said team
     */
    private addTeamPlayerReserve({player, team}, state)
    {
        let $Team = state[`PlayersTeam${team}Reserve`];
        let addedPlayer;

        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = Reducer.USING_RESERVE;
                val.usedTeam = team;
                $Team.players.push(val);
                addedPlayer = val;
                break;
            } // endif;
        } // endfor

        state[`PlayersTeam${team}Reserve`].players = this.sortTeam($Team.players);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer}, state);

        return state;
    }


    /**
     * Add variable player to said team
     */
    private addTeamPlayerVariable({player, team}, state)
    {
        let $Team = state[`PlayersTeam${team}Variable`];
        let addedPlayer;

        for( let val of state.Players  )
        {
            if( player.Id == val.Id && !val.used )
            {
                val.used = Reducer.USING_VARIABLE;
                val.usedTeam = team;
                $Team.players.push(val);
                addedPlayer = val;
                break;
            } // endif;
        } // endfor

        state[`PlayersTeam${team}Variable`].players = this.sortTeam($Team.players);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer}, state);

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
        // state.Players.forEach((val) => val.used = false);

            // case 1:
            // case 2 : team = "PlayersTeam"+team; break;
            // case 3 : team = `PlayersTeam${team}Reserve`; break;
            // case 4 : team = `PlayersTeam${team}Variable`; break;
        // set team1 players states
        for( let val of state.PlayersTeam1.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    if( state.UPlayerData.uniPositionIndex == val.Index )
                    {
                        val2.used = Reducer.USING_TEAM_UP;
                        val2.usedTeam = 1;
                        val2.meta = { PositionOrig: val2.Position,
                            IndexOrig: val2.Index,
                        };
                        val2.Index = state.UPlayerData.uniPositionIndex;
                        val2.Position = state.UPlayerData.uniPositionName;
                    }
                    else
                    {
                        val2.used = Reducer.USING_TEAM;
                        val2.usedTeam = 1;
                    } // endif

                    break;
                } // endif;
            } // endfor
        }

        // set team2 players states
        for( let val of state.PlayersTeam2.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    if( state.UPlayerData.uniPositionIndex == val.Index )
                    {
                        val2.used = Reducer.USING_TEAM_UP;
                        val2.usedTeam = 2;
                        val2.meta = { PositionOrig: val2.Position,
                            IndexOrig: val2.Index,
                        };
                        val2.Index = state.UPlayerData.uniPositionIndex;
                        val2.Position = state.UPlayerData.uniPositionName;
                    }
                    else
                    {
                        val2.used = Reducer.USING_TEAM;
                        val2.usedTeam = 2;
                    } // endif
                    break;
                } // endif;
            } // endfor
        }

        // set team1 reserve players states
        for( let val of state.PlayersTeam1Reserve.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    val2.used = Reducer.USING_RESERVE;
                    val2.usedTeam = 1;
                    break;
                } // endif;
            } // endfor
        }

        // set team2 reserve players states
        for( let val of state.PlayersTeam2Reserve.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    val2.used = Reducer.USING_RESERVE;
                    val2.usedTeam = 2;
                    break;
                } // endif;
            } // endfor
        }

        // set team1 variable players states
        for( let val of state.PlayersTeam1Variable.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    val2.used = Reducer.USING_VARIABLE;
                    val2.usedTeam = 1;
                    break;
                } // endif;
            } // endfor
        }

        // set team2 variable players states
        for( let val of state.PlayersTeam2Variable.players )
        {
            for( let ii in state.Players )
            {
                let val2 = state.Players[ii];
                if( val.Id == val2.Id )
                {
                    val2.used = Reducer.USING_VARIABLE;
                    val2.usedTeam = 2;
                    break;
                } // endif;
            } // endfor
        }
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
        // 0||console.log( '{player, team, used}', {player, team, used} );
        // remove from team
        switch( used )
        {
            case 1:
            case 2 : team = "PlayersTeam"+team; break;
            case 3 : team = `PlayersTeam${team}Reserve`; break;
            case 4 : team = `PlayersTeam${team}Variable`; break;
        }

        let $Team = state[team];
        for( let ii in $Team.players  )
        {
            let val = $Team.players[ii];
            if( player.Id == val.Id )
            {
                if( val.used === 2 )
                {
                    player.Index = val.Index = val.meta.IndexOrig;
                    player.Position = val.Position = val.meta.PositionOrig;
                    player.meta = val.meta = null;
                } // endif
                player.used = val.used = false;
                $Team.players.splice(ii, 1);
                break;
            } // endif;
        } // endfor


        // count positions limits
        state[team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        this.saveData(state);

        return state;
    }



    /**
     * Change current event in dropbox
     */
    private setCurrentEvent(inProps, state)
    {
        const [ Players, LastEventId ]  = inProps;
        state.Players = Players;
        state.LastEventId = LastEventId;
        if (Players.length) this.markPlayers(state);
        return {...state};
    }


    /**
     * Change current event in dropbox
     */
    private setEventsPeriod(inProps, state)
    {
        const [TimeEvent, Period]  = inProps;
        return {...state, TimeEvent, Period};
    }


    /**
     * Common add part
     */
    private afterAddPlayer({player, addedPlayer}, state)
    {
        addedPlayer.EventId = state['LastEventId'];
        // add StartDate to every player
/*        let item;
        if (item = state.TimeEvent.find((val) => addedPlayer.TeamId == val.AwayId || addedPlayer.TeamId == val.HomeId))
        {
            player.StartDate = item.StartDate;
            addedPlayer.StartDate = item.StartDate;
        }*/

        this.recountStartDate(state);
    }


    /**
     * Recount start date for event
     */
    private recountStartDate(state)
    {
        let teams: any = [];
        let startDate = '';

        state.Players.forEach((val) =>
        {
            if (!teams.find((val2) => val2 == val.TeamId)) teams.push(val.TeamId);
        });

        state.TimeEvent.forEach((val) =>
        {
            if (teams.find((val2) => val2 == val.AwayId || val2 == val.HomeId))
            {
                let dt1 = moment(val.StartDate);
                if (!startDate) startDate = dt1;
                else if (dt1.isBefore(startDate)) startDate = dt1;
            }
        });

        state.FormData.startDate = startDate;
    }



    /**
     * Generate team name from top player
     */
    private generateTeamName({teamNum}, state)
    {
        let leadPlayer: any = {Eppg: 0};
        for( let val of state['PlayersTeam' + teamNum].players )
        {
            if (val.Eppg && val.Eppg > leadPlayer.Eppg) leadPlayer = val;
        } // endfor

        if (!leadPlayer.Name && state['PlayersTeam' + teamNum].players.length) leadPlayer = state['PlayersTeam' + teamNum].players[0];

        if (leadPlayer.Name) state.FormData[`teamName` + teamNum] = "Team " + leadPlayer.Name.split(' ')[1].trim();

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Generate full name from teams
     */
    private generateFullName(inProps, state)
    {
        state.FormData.fullName = `${state.FormData['teamName1']} vs ${state.FormData['teamName2']}`;

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Generate url of exchange form full name
     */
    private generateUrl(inProps, state)
    {
        let $name = state.FormData.fullName;
        if( $name != '' )
        {
            // 0||console.log( 'Common.createUrlAlias($name)', Common.createUrlAlias($name), state.FormData.startDate.format('MMDDY') );
            state.FormData.url = Common.createUrlAlias($name);
            if (state.FormData.startDate) state.FormData.url += '-' + state.FormData.startDate.format('MDY');
        } // endif

        // save teams data
        this.saveData(state);

        return state;
    }



    /**
     * Change form data from some input
     */
    private changeFormData({fieldName, val}, state)
    {
        state.FormData[fieldName] = val;

        return state;
    }


    /**
     * Save feed event
     */
    private saveEventSuccess({fieldName, val}, state)
    {
        // state.FormData[fieldName] = val;

        return state;
    }
}
