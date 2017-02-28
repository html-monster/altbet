/**
 * Created by Vlasakh on 20.02.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import {AjaxSend} from "../component/AjaxSend";
import { MainConfig, DS } from "../inc/MainConfig";


var __LDEV__ = true;


export class TreeModel
{
    public moveNode(inProps)
    {
        var self = this;

        // 0||console.debug( 'data', data, data.getAll('op') );
        var ajaxPromise = (new AjaxSend()).send({
                formData: inProps.formData,
                message: `Error while moving category, please, reload page (press F5)`,
                url: MainConfig.BASE_URL + DS + MainConfig.AJAX_CATEGORY_MOVE,
                // url: MainConfig.BASE_URL + DS + MainConfig.AJAX_TEST,
                respCodes: [
                    {code: 100, message: `Category “${inProps.name}” moved successfully`},
                    // {code: -101, message: "Some custom error"},
                ],
                beforeChkResponse: (data) =>
                {
                    // emulate
                    // 0||console.log( 'data', data );
                    // data = {Error: 100};
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