/**
 * Created by Vlasakh on 05.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";


export default class CategoryModel
{
    public deleteCategory(inProps)
    {
        var self = this;

        var promise = new Promise((resolve, reject) =>
        {
            var message = 'Error while deleting category, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST, //AJAX_CATEGORY_EDIT,
                // url: inProps.url, //AJAX_CATEGORY_EDIT,
                type: 'POST',
                success: function(data)
                {
                    // 0||console.debug( 'data AJAX', data );
                    data.code = 200;
                    data.name = inProps.name;
                    data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";

                    var error;
                    try
                    {
                        // user defined error
                        if( data.code > 100 && data.code < 200 )
                        {
                            error = -data.code;
                            throw new Error(message);


                        // success
                        } else if( data.code == 200 )
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
                            case 100 : message = `Category “${data.name}” deleted successfully`; break;
                            case -103 : message = "Category has exchanges, deletion denied"; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: data.url});
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
            var message = 'Error while saving data, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST, //AJAX_CATEGORY_EDIT,
                // url: inProps.url,
                type: 'POST',
                success: function(data)
                {
                    0||console.debug( 'data AJAX', data );
                    data.code = 200;
                    data.name = inProps.name;
                    data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";

                    var error;
                    try
                    {
                        // data = JSON.parse(data);

                        // user defined error
                        if( data.code > 100 && data.code < 200 )
                        {
                            error = -data.code;
                            throw new Error(message);


                        // success
                        } else if( data.code == 200 )
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
                            case 100 : message = `Category “${data.name}” created successfully`; break;
                            case -101 : message = "Category name is not unique"; break;
                            case -102 : message = "Category url is not unique"; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: data.url});
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



    public saveCategory(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var promise = new Promise((resolve, reject) =>
        {
                // 101 not unique name
                // 102 not unique url
            var message = 'Error while saving data, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST, //AJAX_CATEGORY_EDIT,
                // url: inProps.url,
                type: 'POST',
                success: function(data)
                {
                    0||console.debug( 'data AJAX', data );
                    data.code = 200;
                    data.name = inProps.name;
                    data.url = "http://localhost/AltBet.Admin/?path=sport%2Famerican-football";

                    var error;
                    try
                    {
                        // data = JSON.parse(data);

                        // user defined error
                        if( data.code > 100 && data.code < 200 )
                        {
                            error = -data.code;
                            throw new Error(message);


                        // success
                        } else if( data.code == 200 )
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
                            case 100 : message = `Category “${data.name}” saved successfully`; break;
                            case -101 : message = "Category name is not unique"; break;
                            case -102 : message = "Category url is not unique"; break;
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message, url: data.url});
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
