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
import {messageBox, AlertBox} from "../component/AlertBox";


export class IndexController extends BaseController
{
    private FormChecker : FormCheckers;
    private IndexView : IndexView;

    constructor()
    {
        super();

        this.IndexView = (new IndexView());
        this.FormChecker = new FormCheckers();
        this.FormChecker.addCheckerCustom('handicap', (props) => this.IndexView.onCheckHandicap(props) );
        this.FormChecker.addCheckerCustom('datechk', (props) => this.IndexView.onCheckDateFields(props) );
    }


    public actionView()
    {
        var self = this;

        let indexView = (new IndexView);
        indexView.init();


        $('[data-js=btn-create]').click(e => $('.F1addExch').submit());
        $('.F1addExch').on('submit', function (e) { self.onAddExchSubmit(e, this); });
        $('[data-js=tabl-exch]').on('click', '.js-btn-crud[data-type=edit]', function (e) { self.onEditControlClick(e, this); });
        $('[data-js=tabl-exch]').on('click', '.js-btn-crud[data-type=del]', e => self.onDelControlClick(e));
        // debug
        // $('[data-js=BtnDefAction]').on('click', function (e) { self.onEditControlClick(e, this); });
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
            onError: [
                (props) => $IndexView.setErrorOnField(props, 0),
                (props) => $IndexView.setErrorOnField(props, 1),
            ],
        });

// 0||console.log( 'ret', ret );
        if( ret )
        {
            var form = $that.closest('form');
            var formData = new FormData(<HTMLFormElement>form[0]);
            // 0||console.log( 'inProps.formData', JSON.stringify(form.serializeArray()) );

            // formData.set('op', '1');
            (new ExchangeModel).addExch({url: $that.attr('url'), name: $(".js-ed-name").val(), formData}).then( result =>
            {
                0||console.log( 'result', result );
                // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                window.ADpp.User.setFlash({...result}, 'AddExchSucc');
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
        var self = this;
        var $that = $(that);

        e.preventDefault();

        let $IndexView = (new IndexView);
        let $ExchangeModel = (new ExchangeModel);
        // 0||console.log( '$that.attr(),', $that.data('id'), $that );
        $ExchangeModel.getExchange({id: $that.data('id')}).then(result =>
        {
            if( result.code < 0 )
            {
                messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
            }
            else
            {
                // 0||console.debug( 'result.fullname', result );
                $IndexView.renderEditForm({data: result.data, name: $that.data('name')}, function(event)
                    {
                        let form = $(event.target).closest('form');
                        // 0||console.log( 'event.target.closest()', event.target, form );
                        var ret = self.FormChecker.FormSubmit({ event: e,
                            form: form,
                            justReturn: 1,
                            beforeSubmit: (props) => $IndexView.beginSave(props),
                            onError: [
                                (props) => $IndexView.setErrorOnField(props, 0),
                                (props) => $IndexView.setErrorOnField(props, 1),
                            ],
                        });

                        if( ret )
                        {
                            var formData = new FormData(<HTMLFormElement>form[0]);

                            $ExchangeModel.saveExchange({url: $that.attr('url'), name: $that.data('catname')}).then( result =>
                            {
                                0||console.log( 'result', result );
                                $IndexView.setEditSuccess({...result, ...result.data});
                                // window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                                // location.href = result.url;
                            },
                            result => {
                                0||console.log( 'result', result );
                                $IndexView.setErrors({form: form, ...result, noScroll: true});
                                $IndexView.endEditExch();
                            });

                        } else {
                            $IndexView.endEditExch();
                        } // endif

                        return false;
                    }
                );
            } // endif
        },
        result => {
            messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
        });
    }



    private onDelControlClick(ee)
    {
        var $that = $(ee.target);
        var $IndexView = this.IndexView;

        var $Dialog = new Dialog({
            TPLName: '#TPLmodalDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: 'Warning',
                modalBody: 'Delete category “' + $that.data('name') + '” ?',
                btnOkTitle: 'Delete',
                btnCancelTitle: 'Cancel',
                type: 'modal-danger',
            },
            callbackCancel: function() { $IndexView.endDeleteExch() },
            callbackOK: function()
            {
                $IndexView.beginDeleteExch();

                // var formData = new FormData();
                // formData.set('url', '1');
                // (new ExchangeModel).deleteCategory({url: $that.data('url'), name: $that.data('catname')}).then( result =>
                // {
                //     window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                //     $IndexView.endDelete();
                //     location.href = MainConfig  .BASE_URL + result.url;
                // },
                // result => {
                //     window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_ALERT, header: "Fail"});
                //     $IndexView.setInfoMess();
                //     // categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
                //     // indexView.endDelete();
                //     $Dialog.close();
                // });

                return false;
            }
        });

    }
}
