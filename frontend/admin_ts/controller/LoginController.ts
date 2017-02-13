/**
 * Created by Vlasakh on 10.02.2017.
 */

import BaseController from "./BaseController";
import {LoginModel} from "../model/LoginModel";
import {LoginView} from "../view/LoginView";
import { MainConfig, DS } from "../inc/MainConfig";
import {FormCheckers} from "../component/FormCheckers";


export class LoginController extends BaseController
{
    private FormChecker: FormCheckers;


    constructor()
    {
        super();

        this.FormChecker = new FormCheckers();
    }



    /**
     * Edit category
     */
    public actionView()
    {
        var self = this;
        var form = $(".F1Loginform");

        form.submit(function (e) { self.onLoginFormSubm(e, this); });


        // (new CategoryEdit).prepareForm({icons: globalData.iconClasses, form});
    }


    private onLoginFormSubm(e, that)
    {
        var self = this;
        var $that = $(that);

        e.preventDefault();

        let $LoginView = new LoginView();

        var $form = $that.closest('form');
        var ret = this.FormChecker.FormSubmit({ event: e,
            form: $form,
            justReturn: 1,
            beforeSubmit: () => $LoginView.beginLogin(),
            onError: [
                (props) => $LoginView.setErrors(props),
                (props) => $LoginView.setErrors(props),
            ],
        });


        if( ret )
        {
            var formData = new FormData(<HTMLFormElement>$form[0]);
            // formData.set('op', '1');

            (new LoginModel()).login({url: $form.attr('action'), formData}).then( result =>
            {
                // 0||console.log( 'result', result );
                // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                // window.ADpp.User.setFlash({...result}, 'AddExchSucc');
                // location.href = MainConfig.BASE_URL + result.data.Param1;
                location.href = MainConfig.BASE_URL;
            },
            result => {
                // 0||console.debug( 'result', result );
                $LoginView.setErrors({form: $form, ...result});
                $LoginView.endLogin();
            });
        }
        else
        {
            $LoginView.endLogin();
        } // endif
    }
}
