/**
 * Created by Vlasakh on 05.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";


export default class CategoryModel
{
    public saveCategory(data)
    {
        var self = this;

        0||console.debug( 'data', data, data.getAll('op') );
        var promise = new Promise((resolve, reject) =>
        {
                // data = {code: 100};
                // 101 not unique name
                // 102 not unique url
            var message = 'Error while saving data, please, try again';
            $.ajax({
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST, //AJAX_CATEGORY_EDIT,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_EDIT,
                type: 'POST',
                success: function(data)
                {
                    0||console.debug( 'data AJAX', data );
                    var error = 0;
                    try
                    {
                        // data = JSON.parse(data);

                        // some undefined error
                        if( data.code >= 100 && data.code < 200 )
                        {
                            error = -data.code;
                            throw new Error(message);


                        // success
                        } else if( data.code == 200 )
                        {
                            error = 100;
                            throw new Error('Category saved successfully');


                        // not controlled error
                        } else if (!data.code)
                        {
                            error = -1000;
                            throw new Error(message);
                        } // endif


                    } catch (e) {
                        console.warn( 'E', error );
                        switch( error )
                        {
                            case -101 : message = "Category name is empty"; break;
                            case -100: ;
                            case -1000 : ; break;
                            default: error = -1001;
                        }
                        error = 1;
                    }

                    error < 0 ? reject({code: error, message}) : resolve({code: error, message});
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
            }, 'json')
            // .always(function () {
            //     // form.find('.loading-ico').fadeOut(200);
            // })
        });

        return promise;
    }
}
