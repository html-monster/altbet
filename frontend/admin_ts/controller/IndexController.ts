/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import {IndexView} from "../view/IndexView";
import Dialog from "../component/Dialog";
import ExchangeModel from "../model/ExchangeModel";
import {FormCheckers} from "../component/FormCheckers";
import {MainConfig} from "../inc/MainConfig";
import {InfoMessage} from "../component/InfoMessage";


export class IndexController extends BaseController
{
    private FormChecker : FormCheckers;
    private IndexView : IndexView;

    constructor()
    {
        super();

        this.FormChecker = new FormCheckers();
        this.IndexView = (new IndexView());
    }


    public actionView()
    {
        var self = this;

        let indexView = (new IndexView);
        indexView.setInfoMess();
        indexView.initAddForm();


        $('.F1addExch').on('submit', function (e) { self.onAddExchSubmit(e, this); });
        $('.exchanges').on('click', '.js-btn-crud[data-type=edit]', function (e) { self.onEditControlClick(e, this); });
    }



    private onAddExchSubmit(e, that)
    {
        var self = this;
        var $that = $(that);

        e.preventDefault();

        let $IndexView = this.IndexView;

        var ret = this.FormChecker.FormSubmit({ event: e,
            form: $that.closest('form'),
            justReturn: 1,
            beforeSubmit: () => $IndexView.beginAddExch(),
        });

// 0||console.log( 'ret', ret );
        if( ret )
        {
            var form = $that.closest('form');
            var formData = new FormData(<HTMLFormElement>form[0]);
            // formData.set('op', '1');
            (new ExchangeModel).addExch({url: $that.attr('url'), name: $(".js-ed-name").val(), formData}).then( result =>
            {
                0||console.log( 'result', result );
                window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                location.href = MainConfig.BASE_URL + result.url;
            },
            reuslt => {
                // 0||console.debug( 'reuslt', reuslt );
                $IndexView.setErrors({form: form, ...reuslt});
                $IndexView.endAddExch();
            });
            // (new CategoryModel).saveCategory($("#F1EditCat").serializeArray());
        }
        else
        {
            $IndexView.endAddExch();
        } // endif
    }



    private onEditControlClick(e, that)
    {
        var $that = $(that);

        e.preventDefault();

        let $IndexView = (new IndexView);
        let $ExchangeModel = (new ExchangeModel);
        $ExchangeModel.getExchange({id: $that.attr('id')}).then(result =>
        {
            if( result.code < 0 )
            {
                alert(result.message);
            }
            else
            {
                0||console.debug( 'result.fullname', result );
                $IndexView.renderEditForm({data: result.data, name: $that.data('name')}, function()
                    {
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
                );
            } // endif
        },
        result => {
            alert(result.message);
        });
    }
}
