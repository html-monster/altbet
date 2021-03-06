/**
 * Created by Vlasakh on 08.03.2017.
 *
            const ajaxPromise = (new AjaxSend()).send({
                formData: inProps,
                message: `Error ...`,
                url: MainConfig.BASE_URL + "/" + MainConfig.AJAX_FEED_GET_EVENTS,
                respCodes: [
                    {code: 100, message: ""},
                    {code: -101, message: "Some custom error"},
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
 */

/// <reference path="../../.d/common.d.ts" />



 interface JQueryStatic {
    ajax(p1?, p2?, p3?): any;
}
declare var $: JQueryStatic;

var __LDEV__ = !true;
interface JQueryStatic {
    ajax(p1?, p2?, p3?): any;
}
declare var $: JQueryStatic;

export class AjaxSend
{
    private options = {
            formData: null,
            type: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            message: "",
            url: "",
            exData: {}, // additional jquery ajax params
            respCodeName: 'Error',
            respCodes: [],
            beforeChkResponse: null,
        };


    public send(inProps)
    {
        let self = this;
        let props = {...this.options,
            ...inProps,
            headers: {...this.options.headers, ...inProps.headers},
        };
        let message = props.message;

        // 0||console.log( 'props', {props, inProps} );

        let promise = new Promise((resolve, reject) =>
        {
            $.ajax({
                url: props.url,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: props.type,
                success: function(data)
                {
                    var error = -1001;
                    try
                    {
                        __DEV__&&console.debug( 'data AJAX', data );

                        // before check response callback
                        if (props.beforeChkResponse) data = props.beforeChkResponse(data);



                        // user defined error
                        if( data[props.respCodeName] > 100 && data[props.respCodeName] < 200 )
                        {
                            error = -data[props.respCodeName];
                            throw new Error(message);


                        // catched server error, common error
                        } else if( data[props.respCodeName] == 100 )
                        {
                            error = -100;
                            throw new Error(message);


                        // success
                        } else if( data[props.respCodeName] == 200 )
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
                            case -100: ; // some backend not controlled error
                            case -1000 : ; break;
                            default:
// 0||console.log( 'error, val.code', error, self.options.respCodes );
                                for( let val of props.respCodes )
                                {
                                    if( error == val.code )
                                    {
                                        message = val.message || val.callback&&val.callback(data);
                                        break;
                                    } // endif
                                } // endfor
                        }
                    }


                    error < 0 ? reject({code: error, message, data}) : resolve({code: error, message, data});
                },
                error: function() {
                    reject({code: -1002, message});
                },
                // Form data
                data: props.formData || new FormData(),
                ...props.exData,
                // Options to tell jQuery not to process data or worry about the content-type
                cache: false,
                // contentType: false,
                // processData: false
            }, 'json');
            // .always(function () {
            //     // form.find('.loading-ico').fadeOut(200);
            // })
        });

        return promise;
    }
}