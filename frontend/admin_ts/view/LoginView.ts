/**
 * Created by Vlasakh on 10.02.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
import {InfoMessage} from "../component/InfoMessage";
import BodyView from "./BodyView";
import Dialog from "../component/Dialog";
import {RadioBtns} from "../component/RadioBtns";
import {Loading} from "../component/Loading";
import {translit} from "../component/translit.js";
import {User} from "../model/User";
import Common from "../inc/Common";


export class LoginView extends BaseView
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
    }



    public beginLogin()
    {
       var self = this;

        $("[data-js-wellcome]").show();
        $("[data-js-error]").hide();

        this.Loading.showLoading({targetElm: $('[data-js-loading]'), element: $("[data-js-btn-login]"), pic: 2, outerAlign: Loading.ALIGN_OUTER_LEFT, offsetX: 4, position: Loading.POS_INLINE});
    }



    public endLogin()
    {
        this.Loading.hideLoading();
    }



    public setErrors(props)
    {
        var $mess = $("[data-js-error]");

        $("[data-js-wellcome]").hide();
        $mess.children("span").text(props.message);
        $mess.show()

        this.Loading.hideLoading();
    }
}
