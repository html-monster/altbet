/**
 * Created by Vlasakh on 05.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";
import {DateLocalization} from "../../js/react/models/DateLocalization";
import {AjaxSend} from "../component/AjaxSend";


var __LDEV__ = true;


export default class ExchangeModel
{
    public static STATUS_APPROVE = 1 ;
    public static STATUS_COMPLETE = 2 ;
    public static STATUS_UNCOMPLETE = 22 ;
    public static STATUS_SETTLEMENT = 3 ;

    public getExchange(inProps)
    {
        var self = this;
        let data = new FormData();
        data.set('exchange', inProps.id);
        // 0||console.log( 'inProps.id', inProps.id );

        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while getting exchange info, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_EXCH_GET,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    var error;
                    try
                    {
                        // emulate
                        // data[0].Symbol.TypeEvent = 2;
                        // -------


                        // prepate struct
                        __LDEV__&&console.debug( 'data AJAX', data );
                        data = self.prepareEditData(data);
                        __LDEV__&&console.debug( 'prepareEditData', data );


                        //         fullname: 'Buffalo Bills_vs_New England Patriots',
                        //         sidename1: 'Buffalo Bills',
                        //         sidename2: 'New England Patriots',
                        //         sidealias1: '',
                        //         sidealias2: '',
                        //         sidehandicap1: '',
                        //         sidehandicap2: '',
                        //         startDate: '',
                        //         endDate: '1/4/17 13:30',
                        //     };

                        // success
                        if( data.code == 200 )
                        {
                            error = 100;
                            throw new Error("");


                        // undefined error
                        } else
                        {
                            error = -1000;
                            throw new Error(message);
                        } // endif


                    } catch (e) {
                        error < 0 && console.warn( 'E', error );
                        switch( error )
                        {
                            case 100: break; // success
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, data: data.data});
                },
                error: function() {
                    reject({code: -1002, message});
                },
                // Form data
                data: data,
                // Options to tell jQuery not to process data or worry about the content-type
                cache: false,
                contentType: false,
                processData: false
            }, 'json');
            // .always(function () {
            //     // form.find('.loading-ico').fadeOut(200);
            // })
        });

        return promise;
    }



    public saveExchange(inProps)
    {
        var self = this;
        var data = inProps.data;
// 0||console.log( 'data', data );


        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while saving exchange info, please, try again';
            $.ajax({
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_EXCH_EDIT,
                type: 'POST',
                success: function(data)
                {
                    __LDEV__&&console.debug( 'data AJAX', data );

                    // emulate
                    data.Param1 = {
                        Symbol: {
                            FullName: data.Param2,
                            Exchange: data.Param3,
                        }
                    };
                    // data = {Error: 200};
                    // data.Param1 = Url
                    // data.Param2 = FullName
                    // data.Param3 = Exchange
                    // data.Param1 = {
                    //     Symbol: {
                    //         FullName: 'Buffalo Bills_vs_New England Patriots 22222222222222',
                    //         HomeName: 'Buffalo Bill2 22222',
                    //         AwayName: 'New England Patriots 22222',
                    //         sidealias1: '',
                    //         sidealias2: '',
                    //         sidehandicap1: '',
                    //         sidehandicap2: '',
                    //         startDate: '',
                    //         endDate: '',
                    //         Exchange: 'TOR-CLE-3292017',
                    //     }
                    // };

                    var fullName = data.Param1.Symbol.FullName;

                    var error;
                    try
                    {
                        // user defined error
                        if( data.Error > 100 && data.Error < 200 )
                        {
                            error = -data.Error;
                            throw new Error(message);


                        // success
                        } else if( data.Error == 200 )
                        {
                            error = 100;
                            throw new Error("");


                        // undefinded error
                        } else
                        {
                            error = -1000;
                            throw new Error(message);
                        } // endif


                    } catch (e) {
                        error < 0 && console.warn( 'E', error );
                        switch( error )
                        {
                            case 100:
                                message = `Exchange “${fullName}” saved successfully`; break; // success
                            case -102 : message = "Url is not unique"; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, data: data.Param1.Symbol});
                },
                error: function() {
                    reject({code: -1002, message});
                },
                // Form data
                data: data,
                // Options to tell jQuery not to process data or worry about the content-type
                cache: false,
                contentType: false,
                processData: false
            }, 'json');
            // .always(function () {
            //     // form.find('.loading-ico').fadeOut(200);
            // })
        });

        return promise;
    }



    public addExch(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var promise = new Promise((resolve, reject) =>
        {
                // 101 not unique name
                // 102 not unique url
            // for no icon option
            if (inProps.formData.get("Icon") == '-100') inProps.formData.set("Icon", "");


            var message = 'Error while saving data, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_EXCH_ADD,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    __LDEV__&&console.debug( 'data AJAX', data );
                    // emulate
                    // data = {Error: 200};
                    // // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // // data.Param3 = "BBB-NNN-3312017"; // id
                    // data.Param3 = "TOR-PHI-3152017"; // id

                    var error;
                    try
                    {
                        // data = JSON.parse(data);

                        // user defined error
                        if( data.Error > 100 && data.Error < 200 )
                        {
                            error = -data.Error;
                            throw new Error(message);


                        // success
                        } else if( data.Error == 200 )
                        {
                            error = 100;
                            throw new Error("");


                        // undefinded error
                        } else
                        {
                            error = -1000;
                            throw new Error(message);
                        } // endif


                    } catch (ee) {
                        error < 0 && console.warn( 'E', error );
                        switch( error )
                        {
                            case 100 : message = `Exchange “${data.Param2}” created successfully`; break;
                            case -101 : message = "Aliases are not unique"; break;
                            case -102 : message = "Url is not unique"; break;
                            case -103 : message = "Invalid exchange session time. Start time must be less then end time."; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: data.Param1, id: data.Param3});
                },
                error: function() {
                    reject({code: -1002, message});
                },
                // Form data
                data: inProps.formData,
                // Options to tell jQuery not to process data or worry about the content-type
                cache: false,
                contentType: false,
                processData: false
            }, 'json')
            // .always(function () {
            //     // form.find('.loading-ico').fadeOut(200);
            // })
        });

        return promise;
    }



    public delExch(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var ajaxPromise = (new AjaxSend()).send({
                formData: inProps.formData,
                message: `Error while deleting exchange “${inProps.name}”, please, try again`,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                respCodes: [
                    {code: 100, message: `Exchange “${inProps.name}” deleted successfully`},
                    // {code: -101, message: "Some custom error"},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    data = {Error: 200};
                    // data.Param1 = "?path=sport&status=approved";
                    data.Param1 = "?status=New";
                    data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    data.Param3 = "TOR-PHI-3152017"; // id
                    return data;
                },
            });

        return ajaxPromise;
    }



    public getDetails(inProps)
    {
        var ajaxPromise = (new AjaxSend()).send({
                formData: inProps.formData,
                message: "Cannot get details",
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_GET_DETAILS,
                respCodes: [
                    {code: 100, message: ""},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    data.Error = 200;
                    // // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // data.Param3 = "TOR-PHI-3152017"; // id
                    return data;
                },
            });

        return ajaxPromise;
    }



    public setExchStatus(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var ajaxPromise = (new AjaxSend()).send({
                formData: inProps.formData,
                message: `Error while changing status for exchange “${inProps.name}”, please, try again`,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                url: MainConfig.BASE_URL + DS + inProps.url,
                respCodes: [
                    {code: 100, message: `Status <b>${inProps.statusName}</b> was set successfully for exchange “${inProps.name}”`},
                    // {code: -101, message: "Some custom error"},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    data = {Error: 200};
                    // data.Param1 = "?path=sport&status=approved";
                    data.Param1 = "?status=New";
                    data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    data.Param3 = "TOR-PHI-3152017"; // id
                    return data;
                },
            });

        return ajaxPromise;
    }



    private prepareEditData(data)
    {
        data = {
            code: 200,
            data: {...data[0]},
        } ;
        data.Symbol = {
            ChkStartDate: false,
            ChkEndDate: false,
            ...data.Symbol,
        };


        if (data.data.Symbol.StartDate)
        {
            data.data.Symbol.ChkStartDate = true;
            data.data.Symbol.StartDate = (new DateLocalization).fromSharp(data.data.Symbol.StartDate, 0, {TZOffset: false}).unixToLocalDate({format: 'MM/DD/Y h:mm'});
        }

        if (data.data.Symbol.EndDate)
        {
            data.data.Symbol.ChkEndDate = true;
            data.data.Symbol.EndDate = (new DateLocalization).fromSharp(data.data.Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'MM/DD/Y h:mm'});
        }


        // fullname type
        if( data.data.Symbol.TypeEvent == 2 )
        {
            data.data.Symbol.FullNameShow = '';

        // vs type
        } else {
            data.data.Symbol.FullNameShow = 'display: none';
        } // endif


        // status
        // if( data.data.Symbol.Status.toLowerCase() == 'new' )
        if( data.data.Symbol.Status == 0 )
        {
            data.data.Symbol.isUrlShow = true;
        }
        else
        {
            data.data.Symbol.isUrlShow = false;
        } // endif

        return data;
    }
}
