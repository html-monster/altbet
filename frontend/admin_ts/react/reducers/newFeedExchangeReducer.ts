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
    ON_ADD_TEAM_DEFENCE,
    ON_REM_TEAM_DEFENCE,
    AFTER_CATEGORY_ADDED,
    ON_CH_TEAM_SIZE,
    ON_ADD_ALL_TEAM_PLAYERS,
    ON_DEL_ALL_TEAM_PLAYERS,
    ON_EVENT_TYPE_SELECT,
} from '../constants/ActionTypesNewFeedExchange';
/// TS_IGNORE
import {Common} from "../common/Common";


var __EMULATE__ = true;


export default class Reducer
{
    public static USING_TEAM = 1;
    public static USING_TEAM_UP = 2;
    public static USING_RESERVE = 3;
    public static USING_VARIABLE = 4;


    private initialState = {
        initialised: false,
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
        CurrentEventObj: globalData.AppData.TimeEvent[0],
        UPlayerData: {
            uniPositionName: 'Util',
            uniPositionIndex: 5,
        },
        EventFilter: {'0': '1min', '2': '2h', '4': '4h', '8': '8h', '12': '12h', '24': '24h','48': '48h'},
        Rules: {
            reserveLen: 5, // reserve players count
            variableLen: 5, // reserve players count
            nosave: false,
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
            OptionExchanges: {
                Spread: {checked: false, index: 0},
                MoneyLine: {checked: false, index: 1},
                TotalPoints: {checked: false, index: 2},
            },
            url: '',
            PlayerTopTeam1: {Name: '', Team: ''}, // PlayerHome
            PlayerTopTeam2: {Name: '', Team: ''}, // PlayerAway
            Team1Defense: {TeamId: null, EventId: null}, // HomeDefense
            Team2Defense: {TeamId: null, EventId: null}, // AwayDefense
            HomeTeamId: '', // in edit mode
            AwayTeamId: '', // in edit mode
            Exchange: '',   // in edit mode
        },
        Team1name: '', // team1 alias from server
        Team2name: '', // team2 alias from server
        TeamSize: '', // team custom size
        ...globalData.AppData,
    };



    init()
    {
        let loadedData;


        // do not initialise more
        if (this.initialState.initialised) return;


        this.initialState.Positions = this.preparePositions(globalData.AppData.Positions);

        // init teams size
        this.initialState.TeamSize = this._getTeamSize(this.initialState.Positions);

        // load saved teams
        if( globalData.IsEditFeedExchange )
        {
            loadedData = this.loadServerData();
        }
        else
        {
            loadedData = this.loadStorageData();
        } // endif
        0||console.log( 'this.initialState', this.initialState );


        // cancel saving data for F5
        this.initialState.Rules.nosave = globalData.IsEditFeedExchange;


        // 0||console.log( 'this.initialState, loadedData', this.initialState, loadedData );
        this.initialState = {...this.initialState, ...loadedData};
        //DEBUG: emulate
        // if (__EMULATE__) this.initialState.TimeEvent = this.initialState.TimeEvent.map((val) => {val.HomeId += 'H'; val.AwayId += 'A'; return val});
        // this.initialState.Categories.forEach((val) => val.IsCurrent = false);
        //DEBUG: remove
        // this.initialState.FormData = {
        //         ...this.initialState.FormData,
        //         Team1Defense: {TeamId: null, EventId: null}, // HomeDefense
        //         Team2Defense: {TeamId: null, EventId: null}, // AwayDefense
        //     };

        // init current event obj
        this.initialState.CurrentEventObj = this.initialState.TimeEvent.filter((val) => val.EventId == this.initialState.LastEventId)[0];
        this.initialState.initialised = true;

        // init start date
        this.recountStartDate(this.initialState);

        // init current category
        for( let val of this.initialState.Categories )
        {
            if (val.IsCurrent) {
                this.initialState.FormData.category = val.CategoryId;
                break;
            }
        } // endfor
    }


    public actionsHandler(state, action)
    {
        state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;

        switch (action.type)
        {
            case ON_ADD_TEAM_PLAYER:
                state = this.addTeamPlayer(action.payload, state);
                return {...state};

            case ON_ADD_ALL_TEAM_PLAYERS:
                state = this.addAllTeamPlayers(action.payload, state);
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

            case ON_DEL_ALL_TEAM_PLAYERS:
                state = this.delAllTeamPlayers(action.payload, state);
                return {...state};

            case ON_EVENT_TYPE_SELECT:
                state = this.eventTypeSelect(action.payload, state);
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

            case ON_ADD_TEAM_DEFENCE:
                state = this.addTeamDefence(action.payload, state);
                return {...state};

            case ON_REM_TEAM_DEFENCE:
                state = this.removeTeamDefence(action.payload, state);
                return {...state};

            case AFTER_CATEGORY_ADDED:
                state = this.refreshCategories(action.payload, state);
                return {...state};

            case ON_CH_TEAM_SIZE:
                state = this.setTeamSize({TeamSize: action.payload}, state);
                return {...state};

            default:
                this.init();
                return state
        }
    }


    /**
     * Load user teams data
     */
    private loadStorageData() : {PlayersTeam1, PlayersTeam2, LastEventId}
    {
        let $LastEventId = globalData.AppData.EventId;
        let data : any = localStorage.getItem('newFeedExchange');

        if( data )
        {
            data = JSON.parse(data);

            // set LastEventId as current event Id
            data.LastEventId = $LastEventId;

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
     * Load user teams data from server (Edit mode)
     */
    private loadServerData()
    {
        const { HomeName, AwayName, HomeAlias, AwayAlias, StartDateStr, FullName, EventId, UrlExchange, HomeTeamId, AwayTeamId, Exchange, } = this.initialState.Exchanges[0].Symbol;
        const { HomePlayers, AwayPlayers } = this.initialState.Exchanges[0];
        let { Categories, Players, FormData } = this.initialState;
        let catId;

        // init params
        this.initialState = {...this.initialState, LastEventId: EventId, FullName, EventId};
        // is edit mode
        this.initialState.IsEditFeedExchange = true;



        // init catogory
        Categories.forEach((val) => { if (val.IsCurrent) catId = val.CategoryId});


        // fill exchange data
        this.initialState.FormData = {...this.initialState.FormData, ...{
            teamName1: HomeName,
            teamName2: AwayName,
            startDate: StartDateStr,
            fullName: FullName,
            category: catId,
            url: UrlExchange,
            Team1Defense: {TeamId: null, EventId: null}, // HomeDefense
            Team2Defense: {TeamId: null, EventId: null}, // AwayDefense
            HomeTeamId,
            AwayTeamId,
            Exchange,
        }};

        // Aliases
        this.initialState.Team1name = HomeAlias;
        this.initialState.Team1name = AwayAlias;


        // init players
        let preparePlayers = (val, team) => {
            if( val.TeamType == 0 )
            {
                if( val.CustomPosition === "Util" ) this.addTeamUPPlayer({player: val, team: team, nosave: true}, this.initialState);
                else this.addTeamPlayer({player: val, team: team, nosave: true}, this.initialState);

                // this.initialState.Players = Players.map((vv) => vv.PlayerId == val.PlayerId&&__DEV__&&console.log( 'vv.Name', vv.Name, val.Name ) ? {...val} : vv);
            }
            else if( val.TeamType == 1 )
            {
                this.addTeamPlayerReserve({player: val, team: team, nosave: true}, this.initialState);
            }
            else if( val.TeamType == 2 )
            {
                this.addTeamPlayerVariable({player: val, team: team, nosave: true}, this.initialState);
            }
            else if( val.TeamType == 3 )
            {
                this.addTeamDefence({TeamId: val.TeamId, team, EventId: val.EventId, name: val.TeamName}, this.initialState)
            } // endif
        };
        HomePlayers.forEach((vv) => preparePlayers(vv, 1));
        AwayPlayers.forEach((vv) => preparePlayers(vv, 2));

        // state["PlayersTeam"+team].players = this.sortTeam($Team.players);
        // this.initialState.PlayersTeam1 = this.recountPositions(this.initialState.PlayersTeam1);

        // __DEV__&&console.log( 'this.initialState.PlayersTeam1', JSON.stringify(this.initialState.PlayersTeam1) );
    }


    /**
     * Save user teams data
     * @param state { PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId }
     */
    private saveData({ PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId, FormData, TeamSize })
    {
        let data = { PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, LastEventId, Players, EventId, FormData, TeamSize };
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
    private addTeamPlayer({player, team, nosave}, state)
    {
        let $Team = state["PlayersTeam"+team];
        let addedPlayer;

        // mark player on players table
        for( let val of state.Players  )
        {
            if( player.PlayerId == val.PlayerId && !val.used )
            {
                val.used = Reducer.USING_TEAM;
                val.usedTeam = team;
                val.CustomPosition = val.Position;
                break;
            } // endif;
        } // endfor


        // add player to team
        player.used = Reducer.USING_TEAM;
        player.usedTeam = team;
        player.CustomPosition = player.Position;
        $Team.players.push(player);
        addedPlayer = player;

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        if (!nosave) this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer, team}, state);

        return state;
    }


    /**
     * Add several team players action
     * // DEBUG: добавлено для тестирования
     */
    private addAllTeamPlayers({players, team}, state)
    {
        let $Team = state["PlayersTeam"+team];
        let addedPlayer;


        // mark player on players table
        players.forEach(itm => {
            for( let val of state.Players )
            {
                if( itm.PlayerId == val.PlayerId && !val.used )
                {
                    // mark current player
                    val.used = Reducer.USING_TEAM;
                    val.usedTeam = team;
                    val.CustomPosition = val.Position;

                    // add player to team
                    itm.used = Reducer.USING_TEAM;
                    itm.usedTeam = team;
                    itm.CustomPosition = itm.Position;
                    $Team.players.push(itm);
                    addedPlayer = itm;

                    // common add part
                    this.afterAddPlayer({player: {}, addedPlayer, team}, state);
                    break;
                } // endif;
            } // endfor
        });



        // sort players
        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        if (!state.Rules.nosave) this.saveData(state);

        return state;
    }


    /**
     * Add universal player to said team
     */
    private addTeamUPPlayer({player, team, nosave}, state)
    {
        let $Team = state["PlayersTeam"+team];
        let addedPlayer;

        // mark player on players table
        for( let val of state.Players  )
        {
            if( player.PlayerId == val.PlayerId && !val.used )
            {
                val.used = Reducer.USING_TEAM_UP;
                val.usedTeam = team;
                val.meta = { PositionOrig: val.Position,
                    IndexOrig: val.Index,
                };
                val.Index = state.UPlayerData.uniPositionIndex;
                val.Position = state.UPlayerData.uniPositionName;
                val.CustomPosition = state.UPlayerData.uniPositionName;
                break;
            } // endif;
        } // endfor

        // add player to team
        player.used = Reducer.USING_TEAM_UP;
        player.usedTeam = team;
        player.meta = { PositionOrig: player.Position,
            IndexOrig: player.Index,
        };
        player.Index = state.UPlayerData.uniPositionIndex;
        player.Position = state.UPlayerData.uniPositionName;
        player.CustomPosition = state.UPlayerData.uniPositionName;
        $Team.players.push(player);
        addedPlayer = player;

        state["PlayersTeam"+team].players = this.sortTeam($Team.players);

        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        if (!nosave) this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer, team}, state);

        return state;
    }


    /**
     * Add reserve player to said team
     */
    private addTeamPlayerReserve({player, team, nosave}, state)
    {
        let $Team = state[`PlayersTeam${team}Reserve`];
        let addedPlayer;

        // mark player on players table
        for( let val of state.Players  )
        {
            if( player.PlayerId == val.PlayerId && !val.used )
            {
                val.used = Reducer.USING_RESERVE;
                val.usedTeam = team;
                val.CustomPosition = val.Position;
                break;
            } // endif;
        } // endfor

        // add player to team
        player.used = Reducer.USING_RESERVE;
        player.usedTeam = team;
        player.CustomPosition = player.Position;
        $Team.players.push(player);
        addedPlayer = player;


        state[`PlayersTeam${team}Reserve`].players = this.sortTeam($Team.players);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        if (!nosave) this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer, team}, state);

        return state;
    }


    /**
     * Add variable player to said team
     */
    private addTeamPlayerVariable({player, team, nosave}, state)
    {
        let $Team = state[`PlayersTeam${team}Variable`];
        let addedPlayer;

        // mark player on players table
        for( let val of state.Players  )
        {
            if( player.PlayerId == val.PlayerId && !val.used )
            {
                val.used = Reducer.USING_VARIABLE;
                val.usedTeam = team;
                val.CustomPosition = val.Position;
                break;
            } // endif;
        } // endfor

        // add player to team
        player.used = Reducer.USING_VARIABLE;
        player.usedTeam = team;
        player.CustomPosition = player.Position;
        $Team.players.push(player);
        addedPlayer = player;


        state[`PlayersTeam${team}Variable`].players = this.sortTeam($Team.players);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        if (!nosave) this.saveData(state);

        // common add part
        this.afterAddPlayer({player, addedPlayer, team}, state);

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
                if( val.PlayerId == val2.PlayerId )
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
                if( val.PlayerId == val2.PlayerId )
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
                if( val.PlayerId == val2.PlayerId )
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
                if( val.PlayerId == val2.PlayerId )
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
                if( val.PlayerId == val2.PlayerId )
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
                if( val.PlayerId == val2.PlayerId )
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
            if( player.PlayerId == val.PlayerId )
            {
                val[type] = num;
                break;
            } // endif;
        } // endfor


        this.setTopPlayer({teamNum: 1}, state);
        this.setTopPlayer({teamNum: 2}, state);

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
        const { Players } = state;
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
            if( player.PlayerId == val.PlayerId )
            {
                if( val.used === 2 )
                {
                    player.Index = val.Index = val.meta.IndexOrig;
                    player.Position = val.Position = val.meta.PositionOrig;
                    player.meta = val.meta = null;
                } // endif
                player.Eppg = 0;
                player.Fppg = 0;
                player.used = val.used = false;
                $Team.players.splice(ii, 1);
                break;
            } // endif;
        } // endfor

        Players.forEach((val, key) => { if (player.PlayerId == val.PlayerId) Players[key] = player});


        // count positions limits
        state[team] = this.recountPositions($Team);

        this.recountStartDate(state);

        // mark used players
        // this.markPlayers(state);

        // save teams data
        state.Rules.nosave || this.saveData(state);

        return state;
    }


    /**
     * Remove all players from said team
     */
    private delAllTeamPlayers({team}, state)
    {
        const { Players } = state;

        state["PlayersTeam"+team].players.forEach(itm => {
            for( let ii in state.Players  )
            {
                let val = state.Players[ii];
                if( itm.PlayerId == val.PlayerId )
                {
                    if( val.used === 2 )
                    {
                        state.Players[ii].Index = val.Index = val.meta.IndexOrig;
                        state.Players[ii].Position = val.Position = val.meta.PositionOrig;
                        state.Players[ii].meta = val.meta = null;
                    } // endif
                    state.Players[ii].Eppg = 0;
                    state.Players[ii].Fppg = 0;
                    state.Players[ii].used = val.used = false;
                    break;
                } // endif;
            } // endfor
        });

        // Players.forEach((val, key) => { if (player.PlayerId == val.PlayerId) Players[key] = player});
        state['PlayersTeam' + team] = {positions: {}, players: []};


        // count positions limits
        // state[team] = this.recountPositions($Team);

        this.recountStartDate(state);

        // save teams data
        state.Rules.nosave || this.saveData(state);

        return state;
    }


    /**
     * Set event types
     */
    private eventTypeSelect(type, state)
    {
        state.FormData.OptionExchanges[type].checked = !state.FormData.OptionExchanges[type].checked;

        state.Rules.nosave || this.saveData(state);

        return state
    }



    /**
     * Change current event in dropbox
     */
    private setCurrentEvent(inProps, state)
    {
        const [ Players, LastEventId ]  = inProps;
        state.Players = Players;
        state.LastEventId = LastEventId;
        state.CurrentEventObj = state.TimeEvent.filter((val) => val.EventId == LastEventId)[0];

        if (Players.length) this.markPlayers(state);
        return {...state};
    }


    /**
     * Change current event in dropbox
     */
    private setEventsPeriod(inProps, state)
    {
        let [TimeEvent, Period]  = inProps;
        //DEBUG: emulate
        // if (__EMULATE__) TimeEvent = TimeEvent.map((val) => {val.HomeId += 'H'; val.AwayId += 'A'; return val});
        return {...state, TimeEvent, Period};
    }


    /**
     * Common add part
     */
    private afterAddPlayer({player, addedPlayer, team}, state)
    {
        addedPlayer.EventId = state.LastEventId; // need for backend

        this.setTopPlayer({teamNum: 1}, state);
        this.setTopPlayer({teamNum: 2}, state);
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
        let $events: any = [];
        let startDate = '';

        state.PlayersTeam1.players.forEach((val) =>
        {
            if (!$events.find((val2) => val2 == val.EventId)) $events.push(val.EventId);
        });

        state.PlayersTeam2.players.forEach((val) =>
        {
            if (!$events.find((val2) => val2 == val.EventId)) $events.push(val.EventId);
        });

        state.TimeEvent.forEach((val) =>
        {
            if ($events.find((val2) => val2 == val.EventId))
            {
                let dt1 = moment(val.StartDate);
                if (!startDate) startDate = dt1;
                else if (dt1.isBefore(startDate)) startDate = dt1;
            }
        });

        state.FormData.startDate = startDate;
        // 0||console.log( 'state.FormData.startDate', {'11': state.FormData.startDate, startDate, '22': state.Players} );
    }



    /**
     * Generate team name from top player
     */
    private generateTeamName({teamNum, Name, Team}, state)
    {
        this.setTopPlayer({teamNum, Name, Team}, state);

        Name = state.FormData[`PlayerTopTeam` + teamNum].Name;
        Team = state.FormData[`PlayerTopTeam` + teamNum].Team;

        if (Name) state.FormData[`teamName` + teamNum] = `Team ${Name.split(' ')[1].trim()}, ${Team}`;
        // if (state.FormData[`PlayerTopTeam` + teamNum].Name) state.FormData[`teamName` + teamNum] = `Team ${state.FormData[`PlayerTopTeam` + teamNum].split(' ')[1].trim()}, ${state[`Team${teamNum}name`]}`;

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Set top team player
     */
    private setTopPlayer({teamNum, ...float}, state)
    {
        const { Name, Team } = float;
        let leadPlayer: any = {Eppg: 0};
        for( let val of state['PlayersTeam' + teamNum].players )
        {
            if (val.Eppg && val.Eppg > leadPlayer.Eppg) leadPlayer = val;
        } // endfor

        if( Name )
        {
            state.FormData[`PlayerTopTeam` + teamNum] = {Name, Team};
        }
        else
        {
            if (!leadPlayer.Name && state['PlayersTeam' + teamNum].players.length) leadPlayer = state['PlayersTeam' + teamNum].players[0];

            if (leadPlayer.Name) state.FormData[`PlayerTopTeam` + teamNum] = {Name: leadPlayer.Name, Team: leadPlayer.Team};
        } // endif

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Generate full name from teams
     */
    private generateFullName(inProps, state)
    {
        state.FormData.fullName = `${state.FormData['teamName1']} (vs. ${state.FormData['teamName2']})`;

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
            state.FormData.url = Common.createUrlAlias($name);
            // if (state.FormData.startDate) state.FormData.url += '-' + state.FormData.startDate.format('MDY');
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


    /**
     * Add real team to defence
     */
    private addTeamDefence({TeamId, team, EventId, name = ''}, state)
    {
        let Defence : any = {};
        state.TimeEvent.forEach((val) => {
            if (val.HomeId === TeamId) Defence = {name: val.HomeTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`};
            if (val.AwayId === TeamId) Defence = {name: val.AwayTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`};
        });

        if (!name && !Defence.name) Defence.name = `Team ${team} defence`;

        state.FormData[`Team${team}Defense`] = {TeamId, EventId, name, ...Defence};

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Remove team from defence
     */
    private removeTeamDefence({team}, state)
    {
        state.FormData[`Team${team}Defense`] = {TeamId: '', EventId: ''};

        // save teams data
        this.saveData(state);

        return state;
    }


    /**
     * Remove team from defence
     */
    private setCatId({team}, state)
    {
        state.FormData.category = {TeamId: '', EventId: ''};

        // save teams data
        // this.saveData(state);

        return state;
    }


    /**
     * Refresh categories after adding new one
     */
    private refreshCategories({Categories, Emulate}, state)
    {
        // DEBUG: emulation
        state.Categories.forEach((val) => val.IsCurrent = false);
        let $cat = {...state.Categories[0]};
        $cat.Name = Emulate;
        $cat.IsCurrent = true;
        $cat.CategoryId  += 'new';
        state.Categories.push($cat);
        Categories = state.Categories;
        // ==============================


        // set new cattegories
        state.Categories = Categories;

        return state;
    }


    /**
     * Get teams size
     * @private
     */
    _getTeamSize(Positions)
    {
        let len = 0;
        Positions.forEach((val) => len += val.Quantity);
        return len;
    }


    /**
     * Set teams size
     * @private
     */
    setTeamSize({TeamSize}, state)
    {
        state.TeamSize = TeamSize;
        this.saveData(state);

        return state;
    }
}
