/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
import {InfoMessage} from "../component/InfoMessage";
import BodyView from "./BodyView";
import Dialog from "../component/Dialog";
import {RadioBtns} from "../component/RadioBtns";
import {Loading} from "../component/Loading";


export class IndexView extends BaseView
{
    private InfoMessage = null;
    private Loading: Loading = null;
    private T1errmess = null;


    constructor()
    {
        super();

        this.Loading = new Loading();
    }


    /**
     * set info message above exchange table
     * @param inClass
     */
    public setInfoMess()
    {
        var self = this;

        let flash = window.ADpp.User.getFlash();

        if (flash)
            setTimeout(() =>
            {
                InfoMessage.prevInfoMessage && InfoMessage.prevInfoMessage.close();

                self.InfoMessage = new InfoMessage({
                    TPLName: '#TPLinfoMessage',
                    target: '.js-infomessage',
                    render: true,
                    vars: {
                        header: flash.header,
                        text: flash.message,
                        type: flash.type,
                    }
                });
            }, 300);
    }



    /**
     * init add exchange form
     * @param inClass
     */
    public initAddForm()
    {
        var self = this;

        // data-js="EdFullname"
        (new RadioBtns({
            activeClass: "btn-success",
            target: "[data-js=radio-btn]",
            callbacks: [() => $("[data-js=EdFullname]").slideUp(200), () => $("[data-js=EdFullname]").slideDown(400)],
        })).apply();


        $('.js-dt-start-date, .js-dt-end-date').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "showWeekNumbers": true,
            "timePicker": true,
            "timePicker24Hour": true,
            timePickerIncrement: 5,
            "opens": "left",
            locale: {
                format: 'MM/DD/YYYY H:mm'
            }
        });


        $("[data-js=ChkStartDate]").click(function () { $(this).find("input").click(); });
        $("[data-js=ChkStartDate] input").click(function(e) { $(".js-dt-start-date").prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
        $("[data-js=ChkEndDate]").click(function () { $(this).find("input").click(); });
        $("[data-js=ChkEndDate] input").click(function(e) { $(".js-dt-end-date").prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
    }


    /**
     * Before delete category in the tree
     */
    public beginDelete()
    {
        var self = this;

        this.closeInfoMess();
        (new BodyView).showLoading($('.js-dialog [data-js=ok]'), {pic: 4, outerAlign: BodyView.ALIGN_OUTER_LEFT, offsetX: -8});
    }


    /**
     * Before save edit exchange
     */
    public beginSave()
    {
        var self = this;

        this.closeInfoMess();
        (new BodyView).showLoading($('.js-mp-dialog [data-js=ok]'), {pic: 2, outerAlign: BodyView.ALIGN_OUTER_LEFT, offsetX: -8});
    }



    public endDelete()
    {
        (new BodyView).hideLoading(100);
    }



    public beginAddExch()
    {
        var self = this;

        // this.closeAlert();
        this.Loading.showLoading({targetElm: '[data-js=loading]', element: "[data-js=btn-create]", pic: 2, outerAlign: Loading.ALIGN_OUTER_RIGHT, offsetX: 4, position: Loading.POS_INLINE});
    }


    public endAddExch()
    {
        this.Loading.hideLoading();
    }



    public renderEditForm(data, callbackOk)
    {
        new Dialog({
            TPLName: '#TPLeditExchangeDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: `Edit exchange “${data.name}”`,
                btnOkTitle: 'Save',
                btnCancelTitle: 'Cancel',
                data: data.data,
                // type: 'modal-default',
            },
            afterInit: (dialogContext, wrapper) =>
            {
                (new RadioBtns({
                    activeClass: "btn-success",
                    target: "[data-js=radio-btn]",
                    callbacks: [() => $("[data-js=EdFullname]", wrapper).slideUp(200), () => $("[data-js=EdFullname]", wrapper).slideDown(400)],
                })).apply();


                $('[data-js=StartDate], [data-js=EndDate]', wrapper).daterangepicker({
                    "singleDatePicker": true,
                    "showDropdowns": true,
                    "showWeekNumbers": true,
                    "timePicker": true,
                    "timePicker24Hour": true,
                    timePickerIncrement: 5,
                    "opens": "left",
                    locale: {
                        format: 'MM/DD/YYYY H:mm'
                    }
                });



                $("[data-js=ChkStartDate]", wrapper).click(function () { $(this).find("input").click(); });
                $("[data-js=ChkStartDate] input", wrapper).click(function(e) { $(".js-dt-start-date", wrapper).prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
                $("[data-js=ChkEndDate]", wrapper).click(function () { $(this).find("input").click(); });
                $("[data-js=ChkEndDate] input", wrapper).click(function(e) { $(".js-dt-end-date", wrapper).prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
            },
            callbackCancel: function() { /*indexView.endDelete()*/ },
            callbackOK: callbackOk
        });
    }



    public setErrors(inProps)
    {
        var self = this;
        var message;

        if( inProps.code < -100 && inProps.code > -200)
        {
            // controlled messages need switch and focus
            message = inProps.message;
        }
        else
        {
            message = inProps.message;
        } // endif

        // let alert = $(".js-alert", inProps.form);
        let alert = $('.F1addExch .js-info-mess');
        alert.hide();

        // alert.find('.js-text').text(message);

        self.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessage',
            target: '.F1addExch .js-info-mess',
            render: true,
            vars: {
                header: "Alert",
                text: message,
                type: InfoMessage.TYPE_ALERT,
            }
        });

        alert.fadeIn(400, () => $('body').animate({scrollTop: 0 }, 500));



        clearTimeout(this.T1errmess);
        this.T1errmess = setTimeout(() => { alert.fadeOut(200); }, 10000);
    }



    private closeInfoMess()
    {
        InfoMessage.prevInfoMessage && InfoMessage.prevInfoMessage.close();
    }



    private setErrorOnField(inProps)
    {
        let form = inProps.element.closest('form');
        form.find('.js-form-group').removeClass('has-error');
        // form.find('.js-error-icon').hide();
        // form.find('.js-message').hide();

        let fieldWrapp = inProps.element.closest('.js-form-group');
        fieldWrapp.addClass('has-error');
        fieldWrapp.find('.js-message').text(inProps.message);
        inProps.element.focus();

        inProps.element.on('blur', function()
        {
            $(this).off('blur');
            // clearTimeout(self.T1wait);
            $(this).closest('.js-form-group').removeClass('has-error');
        });
        // fieldWrapp.find('.js-error-icon').show();
    }
}
