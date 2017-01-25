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
import {translit} from "../component/translit.js";
// import Common from "../inc/Common";


export class IndexView extends BaseView
{
    private InfoMessage = null;
    private InfoMessageAbs = null;
    private Loading: Loading = null;
    private T1errmess = null;
    private T2esm = null; // edit success unhighlight
    private esmTr = null; // edit success tr
    private DialogEdit = null; // edit form dialog


    constructor()
    {
        super();

        this.Loading = new Loading();
    }



    public init()
    {
        this.setInfoMess();
        this.initAddForm();

        // if success addition
        let data = window.ADpp.User.getFlash('AddExchSucc');
        data && this.highlightAddedExch(data);
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

        let form = $('.F1addExch');


        // data-js="EdFullname"
        (new RadioBtns({
            activeClass: "btn-success",
            target: $("[data-js=radio-btn]", form),
            callbacks: [() => $("[data-js=EdFullname]").slideUp(200), () => $("[data-js=EdFullname]").slideDown(400)],
        })).apply();


        // auto fill url
        let $EdNames = $("[data-js=EdHomeName], [data-js=AwayName]", form);
        $EdNames.blur((ee) => this.onNamesBlur(ee, {names: $EdNames, form: form}));
        $("[data-js=FullName]", form).blur((ee) => this.onFullNameBlur(ee, {form: form}));


        $("[data-js=HomeHandicap], [data-js=AwayHandicap]", form).keypress((ee) => this.onlyDigits(ee));


        $('.js-dt-start-date, .js-dt-end-date', form).daterangepicker({
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


        // disable/enable on date
        let $ChkStartDate = $("[data-js=ChkStartDate]", form);
        let $ChkEndDate = $("[data-js=ChkEndDate]", form);
        $ChkStartDate.click(function () { $(this).find("input").click(); });
        $("input", $ChkStartDate).click(function(e) { $(".js-dt-start-date", form).prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
        $ChkEndDate.click(function () { $(this).find("input").click(); });
        $("input", $ChkEndDate).click(function(e) { $(".js-dt-end-date", form).prop('disabled', !$(this).prop('checked')); e.stopPropagation(); });
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
     * Before delete exch
     */
    public beginDeleteExch()
    {
        this.beginDelete();
    }


    /**
     * Before save edit exchange
     */
    public beginSave(props)
    {
       var self = this;

        let items = $('.js-message');
        for(let ii = 0, countii = items.length; ii < countii; ii++ )
        {
            self.setErrorOnField({elem: $(items[ii])}, 1);
        } // endfor


        0||console.log( 'props', props );
        let form = props.form;

        this.Loading.showLoading({targetElm: $('[data-js=loading]', form), element: $("[data-js=btn-create]", form), pic: 2, outerAlign: Loading.ALIGN_OUTER_LEFT, offsetX: 4, position: Loading.POS_INLINE});
    }



    public endDelete()
    {
        (new BodyView).hideLoading(100);
    }



    public endDeleteExch()
    {
        (new BodyView).hideLoading(100);
    }



    public beginAddExch()
    {
        var self = this;

        // this.closeAlert();
        let items = $('.js-message');
        for(let ii = 0, countii = items.length; ii < countii; ii++ )
        {
            self.setErrorOnField({elem: $(items[ii])}, 1);
        } // endfor


        this.Loading.showLoading({targetElm: '[data-js=loading]', element: "[data-js=btn-create]", pic: 2, outerAlign: Loading.ALIGN_OUTER_RIGHT, offsetX: 4, position: Loading.POS_INLINE});
    }



    public endAddExch()
    {
        this.Loading.hideLoading();
    }



    public endEditExch()
    {
        this.Loading.hideLoading();
    }



    public renderEditForm(data, callbackOk)
    {
        this.DialogEdit = new Dialog({
            TPLName: '#TPLeditExchangeDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: `Edit exchange “${data.name}”`,
                btnOkTitle: 'Save',
                btnCancelTitle: 'Cancel',
                data: data.data.Symbol,
                // type: 'modal-default',
            },
            afterInit: (dialogContext, wrapper) =>
            {
                (new RadioBtns({
                    activeClass: "btn-success",
                    target: "[data-js=radio-btn]",
                    defaultIndex: data.data.Symbol.TypeEvent == 1 ? 0 : 1,
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


        // clear highlights
        $("[data-js=tabl-exch] tr").removeClass("added edited animated");
        clearTimeout(this.T2esm);
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

        0||console.log( 'inProps', inProps );
        let alert = $('.js-info-mess', inProps.form);
        alert.hide();

        // alert.find('.js-text').text(message);

        self.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessage',
            target: $('.js-info-mess', inProps.form),
            render: true,
            vars: {
                header: "Alert",
                text: message,
                type: InfoMessage.TYPE_ALERT,
            }
        });

        if (!inProps.noScroll) alert.fadeIn(400, () => $('body').animate({scrollTop: 0 }, 500));



        clearTimeout(this.T1errmess);
        this.T1errmess = setTimeout(() => { alert.fadeOut(200); }, 10000);
    }



    public highlightAddedExch(data)
    {
        this.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessageAbs',
            target: "[data-js=DiInfoMP]",
            render: true,
            vars: {
                header: "Info",
                text: data.message,
                type: InfoMessage.TYPE_SUCCESS,
            }
        });

        let $tr = $("[data-js=tabl-exch] " + `[data-id=${data.id}]`);
        $tr.addClass('added').attr('title', 'added');
        setTimeout(() => $tr.addClass('animated').attr('title', ''), 5000);

        if( $tr.offset().top > $(window).innerHeight() ) $('body').animate({scrollTop: $tr.offset().top - 50 }, 500);
    }



    public onCheckHandicap(props)
    {
        let ret : any = {message: ''};
        try {
            if( props.value != '' )
            {
                if( props.value < -999.9 || props.value > 999.9 )
                {
                    throw new Error("Field must contain number between -999.9 and 999.9");
                }
                else
                {
                    let form = $(props.item).closest('form');
                    let item1 = $("[data-js=HomeHandicap]", form);
                    let item2 = $("[data-js=AwayHandicap]", form);


                    if( item1.val() == '' && item2.val() != '' ) {ret.item = item1; throw new Error("Set first handicap")};
                    if( item1.val() != '' && item2.val() == '' ) {ret.item = item2; throw new Error("Set second handicap"); }
                } // endif
            } // endif
            // (props) => $IndexView.setErrorOnField(props, 0),
        } catch (e) {
            return {...ret, message: e.message};
        }

        return false;
    }



    public onCheckDateFields(props)
    {
        let ret : any = {message: ''};
        try {
            let form = $(props.item).closest('form');
            let item1 = $("[data-js=ChkStartDate] input", form);
            let item2 = $("[data-js=ChkEndDate] input", form);
            let item3 = $("[data-js=StartDate]", form);

            0||console.log( 'item1.val()', item2.prop('checked'), item2.val() );

            if( !item1.prop('checked') && !item2.prop('checked') ) {ret.item = item3; throw new Error("Set start date or end date")};

        } catch (e) {
            return {...ret, message: e.message};
        }

        return false;
    }



    public setErrorOnField(inProps, isRemove)
    {
        if( isRemove )
        {
            let frmgrp = inProps.elem.closest('.js-form-group');
            frmgrp.removeClass('has-error');
            frmgrp.find('.js-error-icon').fadeOut(200);
            frmgrp.find('.js-message').fadeOut(200);
        }
        else
        {
            let item = inProps.elem;
            let form = item.closest('form');
            let frmgrp = item.closest('.js-form-group');
            frmgrp.removeClass('has-error');
            frmgrp.find('.js-error-icon').fadeIn(200);
            frmgrp.find('.js-message').fadeIn(200);

            let fieldWrapp = item.closest('.js-form-group');
            fieldWrapp.addClass('has-error');
            fieldWrapp.find('.js-message').text(inProps.message);
            item.focus();
        } // endif
    }



    public setEditSuccess(inProps)
    {
        0||console.log( 'inProps inProps', inProps );

        this.InfoMessage = new InfoMessage({
            TPLName: '#TPLinfoMessageAbs',
            target: "[data-js=DiInfoMP]",
            render: true,
            vars: {
                header: "Info",
                text: inProps.message,
                type: InfoMessage.TYPE_SUCCESS,
            }
        });


        let $table = $("[data-js=tabl-exch]");
        let $tr = $(`[data-id=${inProps.Exchange}]`, $table);
        $("[data-js=TD-FullName]", $tr).text(inProps.FullName);
        $("[data-js=TD-HomeName]", $tr).text(inProps.HomeName);
        $("[data-js=TD-HomeHandicap]", $tr).text(inProps.HomeHandicap);
        $("[data-js=TD-AwayName]", $tr).text(inProps.AwayName);
        $("[data-js=TD-AwayHandicap]", $tr).text(inProps.AwayHandicap);
        $("[data-js=TD-StartDate]", $tr).text(inProps.StartDate);
        $("[data-js=TD-EndDate]", $tr).text(inProps.EndDate);
        $("[data-js=TD-UrlExchange]", $tr).text(inProps.UrlExchange);

        this.DialogEdit.close();

        this.esmTr = $tr;
        $tr.addClass('edited');
        clearTimeout(this.T2esm);
        this.T2esm = setTimeout(() => $tr.addClass('animated'), 4000);


        if( $tr.offset().top > $(window).innerHeight() ) $('body').animate({scrollTop: $tr.offset().top - 50 }, 500);
    }



    private closeInfoMess()
    {
        InfoMessage.prevInfoMessage && InfoMessage.prevInfoMessage.close();
    }



    private onNamesBlur(ee, inProps)
    {
        var $that = $(ee.target)

        let name1 = translit(inProps.names[0].value, 5);
        let name2 = translit(inProps.names[1].value, 5);
        if( name1 != '' && name2 != '' )
        {
            if( $("[data-js=valueStor]", inProps.form).val() == 1 )
            {
                $("[data-js=Url]", inProps.form).val(name1.replace(" ", "-") + "-vs-" + name2.replace(" ", "-"));
            } // endif
        } // endif
    }



    private onFullNameBlur(ee, inProps)
    {
        var $that = $(ee.target)

        let name = translit($that.val(), 5);
        if( name != '' )
        {
            if( $("[data-js=valueStor]", inProps.form).val() == 2 )
            {
                $("[data-js=Url]", inProps.form).val(name.replace(" ", "-"));
            } // endif
        } // endif
    }



    private onlyDigits(ee)
    {
        var $that = $(ee.target);

        if (!(ee.which==8 || ee.which==44 ||ee.which==45 ||ee.which==46 ||(ee.which>47 && ee.which<58))) return false;
    }
}