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
    ON_SAVE_EVENT_FAIL,
} from '../constants/ActionTypesNewFeedExchange.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig} from '../../inc/MainConfig';


var __DEBUG__ = !true;

declare let orderClass;

export default class Actions extends BaseActions
{
    private T1 = 0;

    /**
     * Change current event in dropbox
     */
    public actionChangeEvent(inProps)
    {
        return (dispatch, getState) =>
        {
            const ajaxPromise = (new AjaxSend()).send({
                formData: {'EventId': inProps},
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
     * Create new category
     */
    public actionCreateCategory(inProps)
    {
        0||console.log( 'inProps', inProps );
        return;

        return (dispatch, getState) =>
        {
            const ajaxPromise = (new AjaxSend()).send({
                formData: {'EventId': inProps},
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
            let data;// : any = new FormData();
            // data.set('EventId', EventId);
            // data.set('Period', filterVal);
            data = {'EventId': EventId, 'Period': filterVal};

            const ajaxPromise = (new AjaxSend()).send({
                formData: data,
                message: `Error ...`,
                // url: ABpp.baseUrl + $form.attr('action'),
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GETTIMEEVENT,
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
// 0||console.log( 'here', 0 );

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
                        0||console.warn( 'Result code: ', result );
                        return;
                    }
                });
        };
    }


    /**
     * Save feed event
     */
    // todo: Сделать сохранение данных, проверки, callbak и прочее
    public actionSaveEvent(inProps)
    {
        return (dispatch, getState) =>
        {
            let data = getState().newFeedExchange;
            let ret;

            // check for correct team fillness
            if( ret = this.checkTeam(data.PlayersTeam1, data.Positions, 1, data.UPlayerData) )
            {
            // check for correct team fillness
            } else if (ret = this.checkTeam(data.PlayersTeam2, data.Positions, 2, data.UPlayerData))
            {
            // check for reserve
            } else if (ret = this.checkReserveTeam(data.PlayersTeam1Reserve, 1))
            {
            } else if (ret = this.checkReserveTeam(data.PlayersTeam2Reserve, 2))
            {
            // check for variable
            } else if (ret = this.checkVariableTeam(data.PlayersTeam1Variable, 1))
            {
            } else if (ret = this.checkVariableTeam(data.PlayersTeam2Variable, 2))
            {
            // check for empty form fields
            } else if (ret = this.checkFormData(data.FormData))
            {
            } // endif


            // some errors
            if (ret)
            {
                inProps.callback && inProps.callback({errorCode: ret.error, title: '', message: ret.message});
                return;
            }



            // post data to server
            // let data = new FormData();
            const ajaxPromise = (new AjaxSend()).send({
                formData: {team1: data.PlayersTeam1.players},
                message: `Error ...`,
                // url: ABpp.baseUrl + $form.attr('action'),
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_TEST,
                // respCodes: [
                //     {code: 100, message: ""},
                //     // {code: -101, message: "Some custom error"},
                // ],
                beforeChkResponse: (data) =>
                {
                    // DEBUG: emulate
                    data = {Error: 101};
                    // data.Param1 = "TOR-PHI-3152017"; // id
                    // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // data.Param3 = "TOR-PHI-3152017"; // id

                    return data;
                },
            });


            ajaxPromise.then( result =>
                {
                    dispatch({
                        type: ON_SAVE_EVENT_OK,
                        payload: inProps,
                    });
                },
                result => {
                    let message = 'Save error';
                    switch( result.code )
                    {
                        case 100 :
                        default: ;
                    }

                    inProps.callback({errorCode: result.code, title: '', message});
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
                500
            );
        };
    }


    /**
     * Add change team name
     */
    public actionChangeTeamName(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_CH_TEAM_NAME,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }



    /**
     * Add change form data from some input
     */
    public actionChangeFormData(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_CH_FORM_DATA,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Generate full name from teams names
     */
    public actionGenerateFullName(inProps?)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_GEN_FULL_NAME,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Generate
     */
    public actionGenerateUrl(inProps?)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_GEN_URL,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Add generate team name
     */
    public actionGenerateTeamName(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_GEN_TEAM_NAME,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
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
     * Add team reserver player
     */
    public actionAddTeamplayerVariable(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_PLAYER_VARIABLE,
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
     * Check for form data
     */
    private checkFormData(data)
    {
        const { category, fullName, teamName1, teamName2, url } = data;
        let message, error;


        /*if( category === '' )
        {
            message = 'Please set the events category';
            error = -301;
        }
        else*/ if( teamName1 === '' )
        {
            message = 'Please fill team 1 name';
            error = -302;
        }
        else if( teamName2 === '' )
        {
            message = 'Please fill team 2 name';
            error = -303;
        }
        else if( fullName === '' )
        {
            message = 'Please fill full name';
            error = -304;
        }
        else if( url === '' )
        {
            message = 'Please fill url for event';
            error = -305;
        } // endif

        if (message) return {message, error};
        else false;
    }


    /**
     * Check for team positions fillness etc
     */
    private checkTeam(data, inPositions, inTeam, Rules)
    {
        const { players, positions } = data;
        let message, error, teams = {};


        // check positions
        for( let val of inPositions  )
        {
            if (!val) continue;
            if (positions[val.Index] != val.Quantity)
            {
                if (val.Index == Rules.uniPositionIndex) val.Name = 'Universal Player';
                message = `Position "${val.Name}" in team ${inTeam} is not full`;
                error = -306;
                if (message) return {message, error};
                else false;
            }
        } // endfor


        // check for team count
        for( let val of players  )
        {
            teams[val.TeamId] = true;
        } // endfor

        if( Object.keys(teams).length < 2 )
        {
            message = `Team ${inTeam} players have to consists from minimun 2 events`;
            error = -307;
        } // endif


        if (message) return {message, error};
        else false;
    }


    /**
     * Check for team reserve
     */
    private checkReserveTeam(data, inTeam)
    {
        const { players } = data;
        let message, error;


        if( !data.players.length )
        {
            message = `Please, fill team ${inTeam} reserve players`;
            error = -308;
        } // endif


        if (message) return {message, error};
        else false;
    }


    /**
     * Check for variable team players
     */
    private checkVariableTeam(data, inTeam)
    {
        const { players } = data;
        let message, error;


        if( !data.players.length )
        {
            message = `Please, fill team ${inTeam} variable players`;
            error = -309;
        } // endif


        if (message) return {message, error};
        else false;
    }
}

// export default (new Actions()).export();
