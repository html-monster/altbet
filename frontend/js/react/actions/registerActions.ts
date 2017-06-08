/**
 * Created by Vlasakh on 03.03.2017.
 */

import {
    ON_CHECK_FIELDS,
} from '../constants/ActionTypesRegister';
import {
    ON_SEND_CONFIRMATION,
} from '../constants/ActionTypesPageConfirmRegister';
import BaseActions from './BaseActions';
import {AjaxSend} from '../models/AjaxSend';
import {Dialog} from '../models/Dialog';


// var __LDEV__ = true;
let __LDEV__ = false;

class Actions extends BaseActions
{
    public actionFormSubmit(context, values, serverValidation, event, p1, p2)
    {
        var self = this;
        return (dispatch, getState) =>
        {
            __DEV__ && console.log('registrationAjax:', values);
            let flag = true;

            0||console.log( 'here 11', values/*, serverValidation, event.target, p1,  p2*/);
            const $form = $(event.currentTarget);
            if( (this.checkAreement('agreement', $form) && this.checkAreement('agreement_age', $form)) )
            {
                // let formData = new FormData(<HTMLFormElement>$form[0]);
                // console.log('values:', values);
                // formData.set('State', "");

                const ajaxPromise = (new AjaxSend()).send({
                    formData: values,
                    message: `Error while registering user, please, try again`,
                    // url: ABpp.baseUrl + $form.attr('action'),
                    url: $form.attr('action'),
                    // url: "http://192.168.1.249/AltBet/order/TestAction", // DEBUG: remove it
                    respCodeName: 'ErrorCode',
                    respCodes: [
                        {code: 100, message: ""},
                        // {code: -101, message: "Some custom error"},
                    ],
/*                    beforeChkResponse: (data) =>
                    {
                        // DEBUG: emulate
                        data = {ErrorCode: 200};
                        // data.Param1 = "TOR-PHI-3152017"; // id

                        return data;
                    },*/
                });


                ajaxPromise.then( result =>
                    {
                        0||console.log( 'success', result );
                        serverValidation({message: 'Registration is successful'});

                        $('.sign_up_form .close').click();

                        new Dialog({
                            render: true,
                            type: Dialog.TYPE_MESSAGE,
                            vars: {
                                contentHtml: `<span class="">Registration is successful. You need to activate account. Please, check your email for  activation link.</span>`,
                                btn1Text: "OK",
                                // btn2Text: "No",
                            },
                            callbackOK: (inProps) => {location.reload()},
                        });
                    },
                    result => {
                        0||console.log( 'result', result );
                        switch( result.code )
                        {
                            case -101:
                                serverValidation({error: 'User name failed, correct it, please', FirstName: "User name failed"});
                                break;
                            default:
                                serverValidation({error: 'User registration failed, please, refresh the page and try again'});
                        }
                    });

            }


            // dispatch({
            //     type: ON_CHECK_FIELDS,
            //     payload: []
            // });
        }
    }


    /**
     * Send confirmation letter
     */
    public actionSendConfirmEmail(userName, confCode, inUrl)
    {
        // __DEV__ && console.log('actionSendConfirmEmail 111111', {userName, confCode, inUrl});
        return (dispatch, getState) =>
        {
            const ajaxPromise = (new AjaxSend()).send({
                formData: {},
                message: `Error while activating user, please, try again later`,
                url: ABpp.baseUrl + `/${globalData.controller}/` + inUrl,
                // url: inUrl,
                respCodeName: 'ErrorCode',
                respCodes: [
                    {code: 100, message: ""},
                    // {code: -101, message: "Some custom error"},
                ],
/*                    beforeChkResponse: (data) =>
                {
                    // DEBUG: emulate
                    data = {ErrorCode: 200};
                    // data.Param1 = "TOR-PHI-3152017"; // id

                    return data;
                },*/
            });


            ajaxPromise.then( result =>
                {
                    0||console.log( 'success', result );
                    dispatch({
                        type: ON_SEND_CONFIRMATION,
                        payload: {success: true}
                    });
                },
                result => {
                    0||console.log( 'result', result );
                    dispatch({
                        type: ON_SEND_CONFIRMATION,
                        payload: {success: false, message: result.data ? result.data.ErrorMessage : result.message}
                    })
/*
                    switch( result.code )
                    {
                        case -101:
                            // serverValidation({error: 'User name failed, correct it, please', FirstName: "User name failed"});
                            break;
                        default: ;
                            // serverValidation({error: 'User registration failed, please, refresh the page and try again'});
                    }
*/
                });
        }
    }


    private checkAreement(item, context)
    {
        if(context.find(`#${item}`).prop('checked')) return true;
        else
        {
            context.find(`.agreement label[for=${item}]`).addClass('animated shake');
            setTimeout(() => {
                context.find(`.agreement label[for=${item}]`).removeClass('animated shake');
            }, 500);
            return false;
        }
    }
}

export default (new Actions()).export();
