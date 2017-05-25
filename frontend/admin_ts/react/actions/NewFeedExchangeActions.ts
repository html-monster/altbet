import {
    ON_ADD_TEAM_PLAYER,
    ON_DEL_TEAM_PLAYER,
    ON_CHANGE_EVENT,
} from '../constants/ActionTypesNewFeedExchange.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig} from '../../inc/MainConfig';


var __LDEV__ = !true;

declare let orderClass;

class Actions extends BaseActions
{
    /**
     * Change current event
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
                        payload: [result.data.Param1, inProps, this.markPlayers],
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
     * Add team player action
     */
    public actionAddTeamplayer(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_PLAYER,
                payload: this.addTeamPlayer.bind(this, inProps),
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
                payload: this.delTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Remove player from said team
     */
    private delTeamPlayer({player, team}, state)
    {
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
}

export default (new Actions()).export();
