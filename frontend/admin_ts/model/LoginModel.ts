/**
 * Created by Vlasakh on 10.02.2017.
 */


/// <reference path="./../../js/.d/common.d.ts" />

import { MainConfig, DS } from "../inc/MainConfig";
import {AjaxSend} from "../component/AjaxSend";
import {DateLocalization} from "../component/DateLocalization";


var __LDEV__ = true;


export class LoginModel
{
    public login(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var ajaxPromise = (new AjaxSend()).send({
                formData: inProps.formData,
                message: `Error while deleting exchange “${inProps.name}”, please, try again`,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_EXCH_DEL,
                respCodes: [
                    {code: 100, message: `Exchange “${inProps.name}” deleted successfully`},
                    // {code: -101, message: "Some custom error"},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    // data = {Error: 200};
                    // data.Param1 = "TOR-PHI-3152017"; // id
                    // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // data.Param3 = "TOR-PHI-3152017"; // id
                    return data;
                },
            });

        return ajaxPromise;
    }
}

