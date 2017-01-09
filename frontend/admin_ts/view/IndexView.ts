/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
import {InfoMessage} from "../component/InfoMessage";
import BodyView from "./BodyView";


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

        // $(".js-cb-ddlstatus").select2();
        // });
    }



    public beginDelete()
    {
        var self = this;

        this.closeInfoMess();
        (new BodyView).showLoading($('.js-dialog [data-js=ok]'), {pic: 4, outerAlign: BodyView.ALIGN_OUTER_LEFT, offsetX: -8});
    }



    public endDelete()
    {
        (new BodyView).hideLoading(100);
    }



    private closeInfoMess()
    {
        InfoMessage.prevInfoMessage && InfoMessage.prevInfoMessage.close();
    }
}
