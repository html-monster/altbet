/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
import {InfoMessage} from "../component/InfoMessage";
import BodyView from "./BodyView";
import Dialog from "../component/Dialog";
import {RadioBtns} from "../component/RadioBtns";


export class IndexView extends BaseView
{
    private InfoMessage = null;


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
        (new BodyView).showLoading($('.js-btn-cancel'), {pic: 2, outerAlign: BodyView.ALIGN_OUTER_RIGHT, offsetX: 4});
    }



    public checkFields()
    {
/*        let error = false;
        let message = '';
        let element;
        let form = $(".F1addExch");


        try {
            element = $(".js-ed-fullname", form);
            var val = element.val();
            if( val == '' )
            {
                throw Error("Field “Name” is empty");
            } // endif


            element = $(".js-ed-url", form);
            val = element.val();
            if( val == '' )
            {
                throw Error("Field “Url” is empty");
            } // endif
        } catch (e) {
            error = true;
            message = e.message;
        }



        if( error )
        {
            this.setErrorOnField({element, message});
            return false;
        }
        else
        {
            return true;
        } // endif*/
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



    private closeInfoMess()
    {
        InfoMessage.prevInfoMessage && InfoMessage.prevInfoMessage.close();
    }
}
