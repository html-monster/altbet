/**
 * Created by Vlasakh on 08.03.2017.
 */

var __LDEV__ = !true;

export class AjaxSend
{
    private options = {
            formData: null,
            message: "",
            url: "",
            respCodes: [],
            beforeChkResponse: null,
        };


    public send(inProps)
    {
        var self = this;
        var props = {...this.options, ...inProps};
        var message = props.message;

        let promise = new Promise((resolve, reject) =>
        {
            $.ajax({
                url: props.url,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                type: 'POST',
                success: function(data)
                {
                    var error = -1001;
                    try
                    {
                        __DEV__&&console.debug( 'data AJAX', data );

                        // before check response callback
                        if (props.beforeChkResponse) data = props.beforeChkResponse(data);



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