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
    ON_ADD_TEAM_DEFENCE,
    ON_REM_TEAM_DEFENCE,
    AFTER_CATEGORY_ADDED,
    ON_CH_TEAM_SIZE,
    ON_ADD_ALL_TEAM_PLAYERS,
    ON_DEL_ALL_TEAM_PLAYERS,
    ON_EVENT_TYPE_SELECT,
    ON_ACTION_EXCHANGE_LIMIT,
} from '../constants/ActionTypesNewFeedExchange.js';
import BaseActions from './BaseActions';
import {AjaxSend} from '../common/AjaxSend';
import {MainConfig, DS} from '../../inc/MainConfig';
import {Common} from '../common/Common';
import {InfoMessage} from "../../component/InfoMessage";


var __DEBUG__ = !true;

declare let orderClass;

export default class Actions extends BaseActions
{
    private T1 = 0;
    private TestMode = false;
    private PreSeasonMode = true; // для тестирование sport radar-a

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
        return (dispatch, getState) =>
        {
            0||console.log( 'inProps', {inProps} );
            // prepare data
            let data : any = {};
            inProps.formData.forEach((val) => data[val.name] = val.value);
            data.ParentId = inProps.ParentId;

            const ajaxPromise = (new AjaxSend()).send({
                formData: data,
                message: `Error while adding category, please, try again`,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_ADD,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                respCodes: [
                    {code: 100, message: `Category “${data.Name}” created successfully`},
                    {code: -101, message: "Category name is not unique"},
                    {code: -102, message: "Category url is not unique"},
                    {code: -103, message: "You cannot add subcategory because parent category is not empty"},
                ],
/*                beforeChkResponse: (data) =>
                {
                    // DEBUG: emulate
                    data = {Error: 103};
                    // data.Param1 = "TOR-PHI-3152017"; // id
                    // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // data.Param3 = "TOR-PHI-3152017"; // id

                    return data;
                },*/
            });


            ajaxPromise.then( result =>
                {
                    0||console.log( 'result', result, result.code );
                    inProps.callback && inProps.callback(result);
                    dispatch({
                        type: AFTER_CATEGORY_ADDED,
                        payload: {Categories: result.data.Categories, Emulate: data.Name},
                    });
                },
                result => {
                    0||console.log( 'result', result, result.code );
                    inProps.callback && inProps.callback(result);
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
                    // 0||console.log( 'result.data.TimeEvent', result.data.TimeEvent );
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
    public actionSaveEvent(inProps)
    {
        return (dispatch, getState) =>
        {
            let data = getState().newFeedExchange;
            const {TestMode} = getState().AppData;
            let IsEditFeedExchange = data.IsEditFeedExchange;
            let ret;

            this.TestMode = TestMode;


            // check for correct team fillness
            if( ret = this.checkTeam(data.PlayersTeam1, data.Positions, 1, data.UPlayerData, data.TeamSize) )
            {
            // check for correct team fillness
            } else if (ret = this.checkTeam(data.PlayersTeam2, data.Positions, 2, data.UPlayerData, data.TeamSize))
            {
            // check for reserve
            } else if (!this.TestMode && (ret = this.checkReserveTeam(data.PlayersTeam1Reserve, 1)) )
            {
            } else if (!this.TestMode && (ret = this.checkReserveTeam(data.PlayersTeam2Reserve, 2)))
            {
            // check for variable
            } else if (!this.TestMode && (ret = this.checkVariableTeam(data.PlayersTeam1Variable, 1)))
            {
            } else if (!this.TestMode && (ret = this.checkVariableTeam(data.PlayersTeam2Variable, 2)))
            {
            // check for empty form fields
            } else if (ret = this.checkFormData(data.FormData))
            {
            } // endif


            // DEBUG
            // ret = false;

            // some errors
            if (ret)
            {
                inProps.callback && inProps.callback({errorCode: ret.error, title: '', message: ret.message});
                return;
            }


            // prepare data
            data = this.prepareData(data);
            // data = data.HomeTeam;
__DEV__ && console.log( 'data', data );

            // edit or insert url
            let url = MainConfig.BASE_URL + "/" + (IsEditFeedExchange ? MainConfig.AJAX_FEED_CHANGE_FEED_EXCHANGE : MainConfig.AJAX_FEED_CREATE_FEED_EXCHANGE);

            // post data to server
            const ajaxPromise = (new AjaxSend()).send({
                formData: JSON.stringify(data),
                message: `Error while saving new event, please try again`, // error 100 and other
                // url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_TEST,
                url: url,
                exData: {
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    // traditional: true,
                },
                // respCodes: [
                //     {code: 100, message: ""},
                //     // {code: -100, message: ""},
                // ],
                beforeChkResponse: (data) =>
                {
                    // DEBUG: emulate
                    // data = {Error: 100};
                    // data = {"Error":200,"UrlExchange":"?path=fantasy-sport/american-football/nfl\u0026status=New\u0026lastnode=last-node","Exchanges":["GB-SEA-HC-9212015","GB-SEA-ML-9212015","GB-SEA-TP-9212015"]};
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
                    0||console.log( 'result', result, result.code );

                    // reset saved data
                    localStorage.setItem('newFeedExchange', JSON.stringify({}));

                    Common.redirectWMessage({url: result.data.UrlExchange, message: `Event “${data.FullName}” was saved successfully`, type: InfoMessage.TYPE_SUCCESS, title: 'SUCCESS', exInfo: {id: result.data.Exchanges}});
                },
                result => {
                    0||console.log( 'result', result, result.code );

                    inProps.callback({errorCode: result.code, title: 'ERROR', message: result.message});
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
                300
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
     * Add change team name
     */
    public actionExchangeLimit(inProps)
    {
        return (dispatch, getState) =>
        {
            if( inProps )
            {
                dispatch({
                    type: ON_ACTION_EXCHANGE_LIMIT,
                    payload: inProps,
                    // payload: this.addTeamPlayer.bind(this, inProps),
                });
            } // endif
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
     * Add team defence
     */
    public actionAddTeamDefence(inProps?)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ADD_TEAM_DEFENCE,
                payload: inProps,
                // payload: this.addTeamDefence.bind(this, inProps),
            });
        };
    }


    /**
     * Remove team defence
     */
    public actionDelTeamDefence(inProps?)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_REM_TEAM_DEFENCE,
                payload: inProps,
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
     * Add team player action
     */
    public actionEventTypeClick(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_EVENT_TYPE_SELECT,
                payload: inProps,
                // payload: this.addTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Add several team players action
     * // DEBUG: добавлено для тестирования
     */
    public actionAddAllTeamplayers(inProps)
    {
        return (dispatch, getState) =>
        {
            if( confirm("Add all players to team ?") )
            {
                dispatch({
                    type: ON_ADD_ALL_TEAM_PLAYERS,
                    payload: inProps,
                });
            }
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
     * Del all team players action
     * // DEBUG: добавлено для тестирования
     */
    public actionDelAllTeamplayers(inProps)
    {
        return (dispatch, getState) =>
        {
            if( confirm("Delete all players from team ?") )
            {
                dispatch({
                    type: ON_DEL_ALL_TEAM_PLAYERS,
                    payload: inProps, // this.delTeamPlayer.bind(this, inProps),
                });
            } // endif
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
     * Del team player action
     */
    public actionChangeTeamSize(inProps)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_CH_TEAM_SIZE,
                payload: inProps, // this.delTeamPlayer.bind(this, inProps),
            });
        };
    }


    /**
     * Check for form data
     */
    private checkFormData(data)
    {
        const { category, fullName, teamName1, teamName2, url, Team1Defense, Team2Defense, OptionExchanges } = data;
        let message, error;


        if( !Object.keys(OptionExchanges).filter(itm => OptionExchanges[itm].checked).length )
        {
            message = 'Please set Event type(s)';
            error = -311;
        }
        else if( teamName1 === '' )
        {
            message = 'Please fill team 1 name';
            error = -302;
        }
        else if( teamName2 === '' )
        {
            message = 'Please fill team 2 name';
            error = -302;
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
        }
        else if( !Team1Defense.TeamId )
        {
            message = 'Please set the defence of team 1';
            error = -303;
        }
        else if( !Team2Defense.TeamId )
        {
            message = 'Please set the defence of team 2';
            error = -303;
        } // endif


        if (message) return {message, error};
        else false;
    }


    /**
     * Check for team positions fillness etc
     */
    private checkTeam(data, inPositions, inTeam, Rules, TeamSize)
    {
        const { players, positions } = data;
        let message, error, teams = {};


        try {
            // check for size
            if (!this.PreSeasonMode && players.length > TeamSize)
            {
                message = `Command ${inTeam} is greater than the specified command size in options`;
                error = -310;
                throw new Error(message);
            }
            // check for size
            if (!this.PreSeasonMode && players.length < TeamSize)
            {
                message = `Command ${inTeam} is lower than the specified command size in options`;
                error = -310;
                throw new Error(message);
            }


            // check positions
/*            for( let val of inPositions  )
            {
                if (!val) continue;
                if (positions[val.Index] != val.Quantity)
                {
                    if (val.Index == Rules.uniPositionIndex) val.Name = 'Universal Player';
                    message = `Position "${val.Name}" in team ${inTeam} is not full`;
                    error = -306;
                    throw new Error(message);
                }
            }*/ // endfor


            // check fppg and eppg fillness
            for( let val of players  )
            {
                teams[val.TeamId] = true;
/*
                if( !Common.isNumeric(val.Fppg) )
                {
                    message = `Please fill the FPPG for player "${val.Name}" in team ${inTeam}`;
                    error = -308;
                    throw new Error(message);
                }
                else if( !Common.isNumeric(val.Eppg) )
                {
                    message = `Please fill the EPPG for player "${val.Name}" in team ${inTeam}`;
                    error = -308;
                    throw new Error(message);
                } // endif*/
            } // endfor


            // check for team count
            if( !this.TestMode && Object.keys(teams).length < 2 )
            {
                message = `Team ${inTeam} players have to consists from minimum 2 events`;
                error = -307;
                throw new Error(message);
            } // endif

        } catch (e) {
            return {message, error};
        }


        return false;
    }


    /**
     * Check for team reserve
     */
    private checkReserveTeam(data, inTeam)
    {
        const { players } = data;
        let message, error;

        try {
            if( !data.players.length )
            {
                error = -308;
                throw new Error(message = `Please, fill team ${inTeam} reserve players`);
            } // endif


            // check fppg and eppg fillness
/*            for( let val of players  )
            {
                if( !Common.isNumeric(val.Fppg) )
                {
                    error = -308;
                    throw new Error(message = `Please fill the FPPG for player "${val.Name}" in team ${inTeam}`);
                }
                else if( !Common.isNumeric(val.Eppg) )
                {
                    error = -308;
                    throw new Error(message = `Please fill the EPPG for player "${val.Name}" in team ${inTeam}`);
                } // endif
            }*/ // endfor

        } catch (e) {
            return {message, error};
        }

        return false;
    }


    /**
     * Check for variable team players
     */
    private checkVariableTeam(data, inTeam)
    {
        const { players } = data;
        let message, error;

        try {
            if( !data.players.length )
            {
                error = -309;
                throw new Error(message = `Please, fill team ${inTeam} variable players`);
            } // endif


            // check fppg and eppg fillness
/*            for( let val of players  )
            {
                if( !Common.isNumeric(val.Fppg) )
                {
                    error = -308;
                    throw new Error(message = `Please fill the FPPG for player "${val.Name}" in team ${inTeam}`);
                }
                else if( !Common.isNumeric(val.Eppg) )
                {
                    error = -308;
                    throw new Error(message = `Please fill the EPPG for player "${val.Name}" in team ${inTeam}`);
                } // endif
            }*/ // endfor
        } catch (e) {
            return {message, error};
        }

        return false;
    }


    /**
     * Prepare data for sending
     */
    private prepareData(inProps)
    {
        let resObj: any = {};
        const {category, fullName, StartEventId, teamName1, teamName2, url, Team1Defense, Team2Defense, PlayerTopTeam1, PlayerTopTeam2, HomeTeamId, AwayTeamId, Exchange, OptionExchanges, ExchangeLimit} = inProps.FormData;
        let {Team1name, Team2name, EventId, PlayersTeam1, PlayersTeam2, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, IsEditFeedExchange} = inProps;

        resObj.FullName = fullName;
        resObj.CategoryId = category;
        resObj.HomeName = teamName1;
        resObj.AwayName = teamName2;

        resObj.HomeDefense = Team1Defense;
        resObj.AwayDefense = Team2Defense;
        // resObj.StartDate = startDate.format();
        resObj.StartEventId = StartEventId;
        resObj.UrlExchange = url;
        resObj.EventId = EventId;
        resObj.ExchangeLimit = ExchangeLimit;

        // in new mode
        resObj.HomeAlias = Team1name;
        resObj.AwayAlias = Team2name;
        resObj.PlayerHome = PlayerTopTeam1.Name;
        resObj.PlayerAway = PlayerTopTeam2.Name;

        // in edit mode
        resObj.HomeTeamId = HomeTeamId;
        resObj.AwayTeamId = AwayTeamId;
        resObj.Exchange = Exchange;

        // set event type
        resObj.OptionExchanges = [];
        Object.keys(OptionExchanges).forEach(itm => {
            if( OptionExchanges[itm].checked ) resObj.OptionExchanges.push(OptionExchanges[itm].index)
        });

// [07.07.17 17:04:53] Vitaliy Yakubovskiy: ты мне должен передать для exchange - FullName, HomeName, HomeAlias, AwayName, AwayAlias, StartDate, UrlExchange, CategoryId, OptionExchanges(0-HC, 1-ML, 2-TP), HomeTeam(список игроков team1), AwayTeam(список игроков team2), EventId
// [07.07.17 17:07:38] Vitaliy Yakubovskiy: и для игроков PlayerId, Fppg, Eppg, TeamType (0-Basic, 1-Reserve, 2-Variable)

        // prepare teams
        PlayersTeam1 = PlayersTeam1.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 0}});
        PlayersTeam2 = PlayersTeam2.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 0}});
        PlayersTeam1Reserve = PlayersTeam1Reserve.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 1}});
        PlayersTeam2Reserve = PlayersTeam2Reserve.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 1}});
        PlayersTeam1Variable = PlayersTeam1Variable.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 2}});
        PlayersTeam2Variable = PlayersTeam2Variable.players.map((val) => {return{...val, PlayerId: val.PlayerId, TeamType: 2}});

        resObj.HomeTeam = PlayersTeam1.concat(PlayersTeam1Reserve).concat(PlayersTeam1Variable);
        resObj.AwayTeam = PlayersTeam2.concat(PlayersTeam2Reserve).concat(PlayersTeam2Variable);


        return resObj;
    }


    /**
     * Add real team to defence
     */
    private TODEL_addTeamDefence({TeamId, team})
    {
    }
}

// export default (new Actions()).export();
