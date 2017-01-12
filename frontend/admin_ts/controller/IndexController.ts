/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import {IndexView} from "../view/IndexView";
import Dialog from "../component/Dialog";
import ExchangeModel from "../model/ExchangeModel";


export class IndexController extends BaseController
{
    public actionView()
    {
        var self = this;

        let indexView = (new IndexView);
        indexView.setInfoMess();
        indexView.initAddForm();


        $('.exchanges').on('click', '.js-btn-crud[data-type=edit]', function (e) { self.onEditControlClick(e, this); });
    }



    private onEditControlClick(e, that)
    {
        var $that = $(that);

        e.preventDefault();

        let $ExchangeModel = (new ExchangeModel);
        $ExchangeModel.getExchange({id: $that.attr('id')}).then(result =>
        {
            if( result.code < 0 )
            {
                alert(result.message);
            }
            else
            {
                0||console.debug( 'result.fullname', result.fullname );
                new Dialog({
                    TPLName: '#TPLeditExchangeDialog',
                    target: '.js-mp-dialog',
                    render: true,
                    vars: {
                        title: `Edit exchange “${$that.data('name')}”`,
                        btnOkTitle: 'Save',
                        btnCancelTitle: 'Cancel',
                        data: result.data,
                        // type: 'modal-default',
                    },
                    callbackCancel: function() { /*indexView.endDelete()*/ },
                    callbackOK: function()
                    {
                        let $IndexView = (new IndexView);
                        $IndexView.beginSave();

                        var form = $that.closest('form');
                        var formData = new FormData(<HTMLFormElement>form[0]);

                        $ExchangeModel.saveExchange({url: $that.attr('url'), name: $that.data('catname')}).then( result =>
                        {
                            // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                            // location.href = result.url;
                        },
                        result => {
                            // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_ALERT, header: "Fail"});
                            // $IndexView.setInfoMess();
                            // // categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
                            // $IndexView.endDelete();
                        });

                        return true;
                    }
                })
            } // endif
        },
        result => {
            alert(result.message);
        });
    }
}
