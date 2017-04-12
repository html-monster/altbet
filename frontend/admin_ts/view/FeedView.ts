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
    private Model = null;


    constructor(inModel)
    {
        super();

        this.Model = inModel;
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
        let data = [];
        for( let ii = 0, countii = globalData.AllSport.length; ii < countii; ii++ )
        {
            data.push({id: globalData.AllSport[ii], text: globalData.AllSport[ii]});
        } // endfor

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
        }).on("select2:select", (ee) => this.onSportsSelect(ee)).val("-100").trigger("change");


        var queryString = window.location.search || '';
        var keyValPairs = [];
        var params      = {};
        queryString     = queryString.substr(1);

        if (queryString.length)
        {
           keyValPairs = queryString.split('&');
           for (let pairNum in keyValPairs)
           {
              var key = keyValPairs[pairNum].split('=')[0];
              if (!key.length) continue;
              if (typeof params[key] === 'undefined')
                 params[key] = "";
              params[key] = keyValPairs[pairNum].split('=')[1];
           }
        }
        0||console.log( 'window.location.search', window.location.search, params );
    }


    private onSportsSelect(ee)
    {
        0||console.log( '$(ee.target).val()', $(ee.target).val() );
    }
}
