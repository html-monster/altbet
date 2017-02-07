/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import {IndexView} from "../view/IndexView";
import Dialog from "../component/Dialog";
import {FormCheckers} from "../component/FormCheckers";
import {MainConfig} from "../inc/MainConfig";
import {InfoMessage} from "../component/InfoMessage";
import {messageBox, AlertBox} from "../component/AlertBox";
import {User} from "../model/User";
import ExchangeModel from "../model/ExchangeModel";


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
        $('[data-js=tabl-exch]').on('click', '.js-btn-status[data-type=approve]', e => self.onSetStatusClick(e, ExchangeModel.STATUS_APPROVE));
        // set complete status
        $('[data-js=tabl-exch]').on('click', '.js-btn-status[data-type=complete]', e => self.onSetStatusClick(e, ExchangeModel.STATUS_COMPLETE));
        $('[data-js=tabl-exch]').on('click', '.js-btn-status[data-type=uncomplete]', e => self.onSetStatusClick(e, ExchangeModel.STATUS_UNCOMPLETE));
        // set settlement status
        $('[data-js=tabl-exch]').on('click', '.js-btn-status[data-type=settlement]', e => self.onSetStatusClick(e, ExchangeModel.STATUS_SETTLEMENT));

        // get exchange details
        $('[data-js-btn-detail]').on('click', e => self.onDetailControlClick(e)); //[data-js-btn-def-action]
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
                        $ExchangeModel.saveEditExchange({data: formData}).then(result =>
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



    private onDetailControlClick(ee)
    {
        var self = this;
        var $that = $(ee.target);
        let $IndexView = (new IndexView);
        let $ExchangeModel = (new ExchangeModel);
        let $details = $("[data-js-details]");
        var $tr = $that.closest("tr").next();
        var isOpened = $tr.parent().hasClass('js-opened');

        $tr.closest('table').find(".js-opened").removeClass('js-opened');
        if( isOpened )
        {
            $tr.children().children().stop().slideUp(399);
        }
        else
        {
            var $id = $that.data('id');
            $ExchangeModel.getDetails({id: $id}).then(result =>
            {
                if( result.code < 0 )
                {
                    messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
                }
                else
                {
                    0||console.debug( 'get details', result );
                    $details.slideUp(399);

                    var template = Handlebars.compile($("#TPLexchDetails").html());
                    var html = template(result.data);

                    var $td = $tr.children();
                    $td.html(html);
                    $tr.parent().addClass('js-opened');
                    $td.children().stop().slideDown(400);
                } // endif
            },
            result => {
                messageBox({message: result.message, title: 'Warning', type: AlertBox.TYPE_WARN});
            });
        } // endif
    }


    /**
     * Delete exchange
     * @param ee
     */
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

                formData.set('exchange', $that.data('id'));
                (new ExchangeModel).delExch({formData, name: $that.data('name')}).then( result =>
                {
                    window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                    location.reload();
                    // location.href = MainConfig.BASE_URL + result.data.Param1;
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



    private onSetStatusClick(ee, type)
    {
        var self = this;
        var $that = $(ee.target);
        var $IndexView = this.IndexView;
        var $question, statusName;
        var tplName = 'TPLmodalDialog';
        var afterInit = null;
        var vars : any = {};
        var url;


        switch( type )
        {
            case ExchangeModel.STATUS_SETTLEMENT : tplName = 'TPLcompleteStatus';
                afterInit = (that, target) => $IndexView.onCompleteDialogInit(that, target);
                statusName = "Settlement";
                vars = {
                    exchName: $that.data('name'),
                    homeName: $that.data('homename'),
                    awayName: $that.data('awayname'),
                };
                url = MainConfig.AJAX_EXCH_SET_STATUS_SETTLEMENT;
                break;

            case ExchangeModel.STATUS_COMPLETE : $question = 'Set status <span class="label label-warning">Completed</span> for “' + $that.data('name') + '” ?';
                statusName = "Completed";
                url = MainConfig.AJAX_EXCH_SET_STATUS_COMPLETED;
                // url = MainConfig.AJAX_TEST;
                break;
            case ExchangeModel.STATUS_UNCOMPLETE : $question = 'Return to <span class="label label-success">Approved</span> status for “' + $that.data('name') + '” ?';
                statusName = "Approved";
                url = MainConfig.AJAX_EXCH_SET_STATUS_APPROVED;
                break;
            default: $question = 'Set status <span class="label label-success">Approved</span> for “' + $that.data('name') + '” ?';
                statusName = "Approved";
                url = MainConfig.AJAX_EXCH_SET_STATUS_APPROVED;
        }


        var $Dialog = new Dialog({
            TPLName: '#' + tplName,
            target: '.js-mp-dialog',
            render: true,
            afterInit: afterInit,
            vars: {
                title: 'Question',
                modalBody: $question,
                btnOkTitle: 'OK',
                btnCancelTitle: 'Cancel',
                loading: true,
                ...vars,
            },
            // callbackCancel: function() { $IndexView.endDeleteExch() },
            callbackOK: (ee) =>
            {
                // $IndexView.beginDeleteExch();
                var formData = new FormData(<HTMLFormElement>$(ee.target).closest('form')[0]);
                formData.set('exchange', $that.data('id'));
                // formData.set('status', 2);
                // formData.set('result', $('[name=result]').val());
                (new ExchangeModel).setExchStatus({formData, name: $that.data('name'), statusName, url}).then( result =>
                {
                    0||console.log( 'result', result );
                    window.ADpp.User.setFlash({message: result.message, messageType: User.MESSAGE_TYPE_ABS, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                    window.ADpp.User.setFlash({id: result.data.Param1}, 'ChangedStatusExchId');
                    // location.href = MainConfig.BASE_URL + result.data.Param1;
                    location.reload();
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
