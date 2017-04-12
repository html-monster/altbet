/**
 * Created by Vlasakh on 12.04.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
// import {InfoMessage} from "../component/InfoMessage";
// import BodyView from "./BodyView";
// import Dialog from "../component/Dialog";
// import {RadioBtns} from "../component/RadioBtns";
// import {Loading} from "../component/Loading";
// import {translit} from "../component/translit.js";
// import {FormFilters} from "../component/FormFilters";
// import {User} from "../model/User";
import Common from "../inc/Common";


export class FeedView extends BaseView
{
    constructor()
    {
        super();
    }



    public init()
    {
        this.initAllSports();
    }



    /**
     * init sports dropdown
     */
    public initAllSports()
    {
        let data = Common.feelDropDown(globalData.AllSport);
        data.unshift({id: '-100', text: '- choose sport -'});


        $("[data-js-allsports]").select2({
            data: data,
            dropdownAutoWidth: true,
            // templateResult: (state) => {
            //         if (!state.id) {
            //             return state.text;
            //         }
            //         var $state = $('<span class="icon ' + state.id + '">' + state.text + '</span>');
            //         if (state.id < 0) var $state = $('<span class="icon noicon">' + state.text + '</span>');
            //         return $state;
            //     }
        }).val("-100").trigger("change");
    }
}
