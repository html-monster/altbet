import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
    ON_ENTER_PPG,
    ON_ADD_TEAM_UP_PLAYER,
    ON_CHANGE_EVENTS_PERIOD,
    ON_ADD_TEAM_PLAYER_RESERVE,
    ON_SET_CURR_TEAM,
} from '../constants/ActionTypesNewFeedExchange.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig} from '../../inc/MainConfig';


var __DEBUG__ = !true;

declare let orderClass;

class Actions extends BaseActions
{
    private T1 = 0;

    /**
     * Change current event in dropbox
     */
    public actionChangeEvent(inProps)
    {
        return (dispatch, getState) =>
        {
            let data = new FormData();
            data.set('EventId', inProps);

            const ajaxPromise = (new AjaxSend()).send({
                formData: data,
                message: `Error while registering user, please, try again`,
                // url: ABpp.baseUrl + $form.attr('action'),
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GETPLAYERS,
                respCodes: [
                    {code: 100, message: ""},
                    // {code: -101, message: "Some custom error"},
                ],
                // beforeChkResponse: (data) =>
                // {
                //     // DEBUG: emulate
                //     data = {Error: 101};
                //     // data.Param1 = "TOR-PHI-3152017"; // id
                //     // data.Param1 = "?path=sport&status=approved";
                //     // data.Param1 = "?status=New";
                //     // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                //     // data.Param3 = "TOR-PHI-3152017"; // id
                //
                //     return data;
                // },
            });


            ajaxPromise.then( result =>
                {
                    dispatch({
                        type: ON_CHANGE_EVENT,
                        payload: [result.data.Players, inProps],
                    });
                },
                result => {
                    // 0||console.log( 'result', result, result.code );
                    if( result.code != 100 )
                    {
                        dispatch({
                            type: ON_CHANGE_EVENT,
                            payload: [[], inProps],
                        });
                    }
                });
        };
    }



    /**
     * Change events period
     */
    public actionChangeEventsPeriod({EventId, filterVal})
    {
        return (dispatch, getState) =>
        {
            let data = new FormData();
            data.set('EventId', EventId);
            data.set('Period', filterVal);

            const ajaxPromise = (new AjaxSend()).send({
                formData: data,
                message: `Error ...`,
                // url: ABpp.baseUrl + $form.attr('action'),
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GETTIMEEVENT,
                // respCodes: [
                //     {code: 100, message: ""},
                //     // {code: -101, message: "Some custom error"},
                // ],
                // beforeChkResponse: (data) =>
                // {
                //     // DEBUG: emulate
                //     data = {Error: 101};
                //     // data.Param1 = "TOR-PHI-3152017"; // id
                //     // data.Param1 = "?path=sport&status=approved";
                //     // data.Param1 = "?status=New";
                //     // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                //     // data.Param3 = "TOR-PHI-3152017"; // id
                //
                //     return data;
                // },
            });


            ajaxPromise.then( result =>
                {
                    dispatch({
                        type: ON_CHANGE_EVENTS_PERIOD,
                        payload: [result.data.TimeEvent, filterVal],
                    });
                },
                result => {
                    if( result.code != 100 )
                    {
                        0||console.warn( 'Result code: ', result.code );
                        return;
                    }
                });
        };
    }


    /**
     * Add team player action
     */
    public actionPPGValues(inProps)
    {
        return (dispatch, getState) =>
        {
            clearTimeout(this.T1);
            this.T1 = setTimeout(() => {
                dispatch({
                    type: ON_ENTER_PPG,
                    payload: inProps, //this.setPPGValues.bind(this, inProps),
                    // payload: this.setPPGValues.bind(this, inProps),
                })},
                800
            );
        };
    }


    /**
     * Add team player action
     */
    public actionAddTeamplayer(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_PLAYER,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Add team reserver player
     */
    public actionAddTeamplayerReserve(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_PLAYER_RESERVE,
                payload: inProps,
            });
        };
    }

    /**
     * Set current team for adding
     */
    public actionSetCurrTeam(type, team)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_SET_CURR_TEAM,
                payload: {type, team},
            });
        };
    }


    /**
     * Add team universal player action
     */
    public actionAddUPTeamplayer(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_UP_PLAYER,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Del team player action
     */
    public actionDelTeamplayer(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_DEL_TEAM_PLAYER,
                payload: inProps, // this.delTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Remove player from said team
     */
/*
    private delTeamPlayer({player, team}, state)
    {
        0||console.log( 'player', player );
        // return to player
        // for( let val of state.Players  )
        // {
        //     if( player.Id == val.Id ) { val.used = false; break; } // endif;
        // }


        // remove from team
        let $Team = state["PlayersTeam"+team];
        for( let ii in $Team.players  )
        {
            let val = $Team.players[ii];
            if( player.Id == val.Id )
            {
                $Team.players.splice(ii, 1);
                break;
            } // endif;
        } // endfor


        // count positions limits
        state["PlayersTeam"+team] = this.recountPositions($Team);

        // mark used players
        this.markPlayers(state);

        return state;
    }
*/


    /**
     * Add player to said team
     */
/*
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

        return state;
    }
*/


    /**
     * Sort team by positions and name
     */
/*
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
*/


    /**
     * Recount team used positions
     */
/*
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
*/


/*
    /!**
     * Recount team used positions
     *!/
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
*/


/*
    /!**
     * Add team player action
     *!/
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

        return state;
    }
*/
}

export default (new Actions()).export();
