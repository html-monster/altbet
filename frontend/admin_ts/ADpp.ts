/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../js/.d/common.d.ts" />


import Category from "./controller/Category";
import Exchanges from "./controller/Exchanges";
import { GroupsTree } from "./controller/GroupsTree";
import BodyView from "./view/BodyView";
import { MainConfig } from "./inc/MainConfig";


export default class ADpp
{
    private controllers = {};
    private currentController = null;

    constructor()
    {
        window.ADpp = this;

        // application controllers
        this.controllers['Category'] = Category;
        this.controllers['Exchanges'] = Exchanges;

        if (location.host == 'localhost') MainConfig.BASE_URL = '/AltBet.Admin';


        // init current controller (sets in razor views)
        if( globalData && globalData.controller )
        {
            this.currentController = new this.controllers[globalData.controller.name]();
        } // endif;
    }



    /**
     * on JQuery ready
     */
    public ready()
    {
        (new GroupsTree()).init();

        // call current action
        if (this.currentController) {
            this.currentController['action' + globalData.controller.action]();

            (new BodyView()).addClass(globalData.controller.name);
        }
    }
}