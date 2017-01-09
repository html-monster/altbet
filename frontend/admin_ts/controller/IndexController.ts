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


        (new ExchangeModel).getExchange({id: $that.attr('id')}).then( result =>
        {
            window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
            location.href = result.url;
        },
        result => {
            window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_ALERT, header: "Fail"});
            indexView.setInfoMess();
            // categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
            indexView.endDelete();
        });

        new Dialog({
            TPLName: '#TPLmodalDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: 'Warning',
                modalBody: 'Delete category “' + $that.data('catname') + '” ?',
                btnOkTitle: 'Delete',
                btnCancelTitle: 'Cancel',
                type: 'modal-danger',
            },
            callbackCancel: function() { /*indexView.endDelete()*/ },
            callbackOK: function()
            {
                // indexView.beginDelete();
                //
                // // var formData = new FormData();
                // // formData.set('url', '1');
                // (new CategoryModel).deleteCategory({url: $that.attr('url'), name: $that.data('catname')}).then( result =>
                // {
                //     window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                //     location.href = result.url;
                // },
                // result => {
                //     window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_ALERT, header: "Fail"});
                //     indexView.setInfoMess();
                //     // categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
                //     indexView.endDelete();
                // });

                return true;
            }
        })
    }
}
