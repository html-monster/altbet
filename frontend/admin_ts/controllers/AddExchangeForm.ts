/**
 * Created by Vlasakh on 29.12.2016.
 */

/// <reference path="../../js/.d/common.d.ts" />


export class AddExchangeForm
{
    public init()
    {
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
}

