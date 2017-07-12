/**
 * Created by Vlasakh on 05.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";

interface JQueryStatic {
    ajax(p1?, p2?, p3?): any;
}
declare var $: JQueryStatic;


var __LDEV__ = true;

export default class CategoryModel
{
    public deleteCategory(inProps)
    {
        var self = this;

        // 0||console.debug( 'inProps', inProps );
        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while deleting category, please, try again';
            $.ajax({
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                url: inProps.url,
                type: 'POST',
                success: function(data)
                {
                    __LDEV__&&console.debug( 'data AJAX', data );
                    // data.Error = 200;
                    // data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";
                    // data.name = inProps.name;

                    var error;
                    try
                    {
                        // user defined error
                        let code = parseInt(data.Error);
                        if( code > 100 && code < 200 )
                        {
                            error = -code;
                            throw new Error(message);


                        // success
                        } else if( code == 200 )
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
                            case 100 : message = `Category “${data.Param2}” deleted successfully`; break;
                            case -103 : message = "Category has exchanges, deletion denied"; break;
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
                data: new FormData(),
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



    public addCategory(inProps)
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
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_ADD,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    __LDEV__&&console.debug( 'data AJAX', data );
                    // data.code = 200;
                    // data.name = inProps.name;
                    // data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";

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
                            case 100 : message = `Category “${inProps.name}” created successfully`; break;
                            case -101 : message = "Category name is not unique"; break;
                            case -102 : message = "Category url is not unique"; break;
                            case -103 : message = "You cannot add subcategory because parent is not empty"; break;
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



    public saveEditCategory(inProps)
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
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_EDIT,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    __DEV__&&console.debug( 'data AJAX', data, MainConfig.BASE_URL );
                    // data.Error = 101;
                    // data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";
                    // data.name = inProps.name;

                    var error;
                    try
                    {
                        // data = JSON.parse(data);

                        // user defined error
                        let code = parseInt(data.Error);
                        if( code > 100 && code < 200 )
                        {
                            error = -code;
                            throw new Error(message);


                        // success
                        } else if( code == 200 )
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
                            case 100 : message = `Category “${inProps.name}” saved successfully`; break;
                            case -101 : message = "Category name is not unique"; break;
                            case -102 : message = "Category url is not unique"; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    let url = data.Param1; // redirect url
                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: url});
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
