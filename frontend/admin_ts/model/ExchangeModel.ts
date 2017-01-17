/**
 * Created by Vlasakh on 05.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";


var __LDEV__ = true;


export default class ExchangeModel
{
    public getExchange(inProps)
    {
        var self = this;
        let data = new FormData();
        data.set('exchange', inProps.id);

        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while getting exchange info, please, try again';
            $.ajax({
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_EXCH_EDIT,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'GET',
                success: function(data)
                {
                    // 0||console.debug( 'data AJAX', data );
                    // emulate
                    data.code = 200;
                    data.data = {
                            fullname: 'Buffalo Bills_vs_New England Patriots',
                            sidename1: 'Buffalo Bills',
                            sidename2: 'New England Patriots',
                            sidealias1: '',
                            sidealias2: '',
                            sidehandicap1: '',
                            sidehandicap2: '',
                            startDate: '',
                            endDate: '1/4/17 13:30',
                        };

                    var error;
                    try
                    {
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
        let data = new FormData();
        data.set('id', inProps.id);

        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while saving exchange info, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST, //AJAX_CATEGORY_EDIT,
                // url: inProps.url, //AJAX_CATEGORY_EDIT,
                type: 'POST',
                success: function(data)
                {
                    // 0||console.debug( 'data AJAX', data );
                    // emulate
                    data.code = 200;
                    data.data = {
                            fullname: 'Buffalo Bills_vs_New England Patriots',
                            sidename1: 'Buffalo Bills',
                            sidename2: 'New England Patriots',
                            sidealias1: '',
                            sidealias2: '',
                            sidehandicap1: '',
                            sidehandicap2: '',
                            startDate: '',
                            endDate: '',
                        };

                    var error;
                    try
                    {
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
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_ADD,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    __LDEV__&&console.debug( 'data AJAX', data );
                    data.Error = 101;
                    data.Param2 = inProps.name;
                    data.Param1 = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";

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


                    } catch (e) {
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

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: data.Param1});
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
}
