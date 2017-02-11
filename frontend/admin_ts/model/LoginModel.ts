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
                message: `Error while login, please, try again`,
                url: inProps.url,
                respCodes: [
                    {code: 100, message: ""},
                    {code: -101, message: "Wrong login or password"},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    // data = {Error: 100};
                    // data.Param1 = "?path=sport&status=approved";
                    // data.Param1 = "TOR-PHI-3152017"; // id
                    // data.Param1 = "?status=New";
                    // data.Param2 = "Buffalo Bills_vs_New England Patriots";
                    // data.Param3 = "TOR-PHI-3152017"; // id
                    return data;
                },
            });

        return ajaxPromise;
    }
}

