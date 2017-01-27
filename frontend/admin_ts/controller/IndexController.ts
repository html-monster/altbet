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
import {User} from "../model/User";


export class IndexController extends BaseController
{
    private FormChecker : FormCheckers;
    private IndexView : IndexView;
    private InfoMessage : InfoMessage;

    constructor()
    {
        super();

        this.IndexView = (new IndexView());
        this.FormChecker = new FormCheckers();
        this.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessageAbs',
            target: "[data-js=DiInfoMP]",
            timeout: 5000,
        });
        this.FormChecker.addCheckerCustom('handicap', (props) => this.IndexView.onCheckHandicap(props) );
        this.FormChecker.addCheckerCustom('datechk', (props) => this.IndexView.onCheckDateFields(props) );
    }


    public actionView()
    {
        var self = this;

        let indexView = (new IndexView);
        indexView.init();


        // add submit click
        $('[data-js=btn-create]').click(e => $('.F1addExch').submit());
        $('.F1addExch').on('submit', function (e) { self.onAddExchSubmit(e, this); });
        // edit click
        $('[data-js=tabl-exch]').on('click', '.js-btn-crud[data-type=edit]', function (e) { self.onEditControlClick(e, this); });
        // delete click
        $('[data-js=tabl-exch]').on('click', '.js-btn-crud[data-type=del]', e => self.onDelControlClick(e));
        // set approve status
        $('[data-js=tabl-exch]').on('click', '.js-btn-status[data-type=approve]', e => self.onSetApproveStatusClick(e));
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
        var $id = $that.data('id');
        $ExchangeModel.getExchange({id: $id}).then(result =>
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
                    var form = $(event.target).closest('form');
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
                        formData.set('Exchange', $id);
// 0||console.log( 'form', form, formData.get('HomeName'), formData.get('Exchange') );
                        $ExchangeModel.saveExchange({data: formData}).then( result =>
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
                });
            } // endif
        },
        result => {
            messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
        });
    }



    private onDelControlClick(ee)
    {
        var self = this;
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

                var formData = new FormData();
                formData.set('id', $that.data('id'));
                (new ExchangeModel).delExch({formData, name: $that.data('name')}).then( result =>
                {
                    window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                    location.href = MainConfig.BASE_URL + result.data.Param1;
                },
                result => {
                    self.InfoMessage.render({
                        vars: {
                            header: "Info",
                            text: result.message,
                            type: InfoMessage.TYPE_ALERT,
                        }
                    });

                    $Dialog.close();
                    $IndexView.endDeleteExch();
                });

                return false;
            }
        });

    }



    private onSetApproveStatusClick(ee)
    {
        var self = this;
        var $that = $(ee.target);
        var $IndexView = this.IndexView;

        var $Dialog = new Dialog({
            TPLName: '#TPLmodalDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: 'Question',
                modalBody: 'Set status <b>Approved</b> for “' + $that.data('name') + '” ?',
                btnOkTitle: 'OK',
                btnCancelTitle: 'Cancel',
                loading: true,
                // type: 'modal-default',
            },
            callbackCancel: function() { $IndexView.endDeleteExch() },
            callbackOK: () =>
            {
                // $IndexView.beginDeleteExch();

                var formData = new FormData();
                formData.set('id', $that.data('id'));
                formData.set('status', 2);
                (new ExchangeModel).setExchStatus({formData, name: $that.data('name'), statusName: "Approved"}).then( result =>
                {
                    0||console.log( 'result', result );
                    window.ADpp.User.setFlash({message: result.message, messageType: User.MESSAGE_TYPE_ABS, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                    window.ADpp.User.setFlash({id: result.data.Param3}, 'ChangedStatusExchId');
                    location.href = MainConfig.BASE_URL + result.data.Param1;
                },
                result => {
                    0||console.log( 'result', result );
                    self.InfoMessage.render({
                        vars: {
                            header: "Info",
                            text: result.message,
                            type: InfoMessage.TYPE_ALERT,
                        }
                    });

                    $Dialog.close();
                    // $IndexView.endDeleteExch();
                });

                return false;
            }
        });

    }
}
