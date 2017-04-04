/**
 * Created by Vlasakh on 03.03.2017.
 */

import {
    ON_CHECK_FIELDS,
} from '../constants/ActionTypesRegister';
import BaseActions from './BaseActions';
import {AjaxSend} from '../models/AjaxSend';


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

            // 0||console.log( 'here 11', context, values, serverValidation, event.target, p1,  p2);
            const $form = $(event.target);
            if( (this.checkAreement('agreement', $form) && this.checkAreement('agreement_age', $form)) )
            {
                let formData = new FormData(<HTMLFormElement>$form[0]);
                formData.set('State', "");

                const ajaxPromise = (new AjaxSend()).send({
                    formData: formData,
                    message: `Error while registering user, please, try again`,
                    // url: ABpp.baseUrl + $form.attr('action'),
                    url: $form.attr('action'), // DEBUG: remove it
                    respCodes: [
                        {code: 100, message: ""},
                        // {code: -101, message: "Some custom error"},
                    ],
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
                    serverValidation({message: 'The payment is successful'});
                },
                result => {
                    // 0||console.log( 'result', result, result.code );
                    switch( result.code )
                    {
                        case -101:
                            serverValidation({error: 'User name failed, correct it, please', FirstName: "User name failed"});
                            break;
                    }
                });

            }


            // dispatch({
            //     type: ON_CHECK_FIELDS,
            //     payload: []
            // });
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
