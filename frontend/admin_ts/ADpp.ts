/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../js/.d/common.d.ts" />


import {CategoryController} from "./controller/CategoryController";
import Exchanges from "./controller/Exchanges";
import { GroupsTree } from "./controller/GroupsTree";
import BodyView from "./view/BodyView";
import { MainConfig } from "./inc/MainConfig";
import {User} from "./model/User";
import {IndexController} from "./controller/IndexController";
import {LoginController} from "./controller/LoginController";
// import {RadioBtns} from "./component/RadioBtns";


export default class ADpp
{
    private User = null;

    private controllers = {};
    private currentController = null;

    constructor()
    {
        window.ADpp = this;

        // application controllers
        this.controllers['Category'] = CategoryController;
        this.controllers['Exchanges'] = Exchanges;
        this.controllers['Index'] = IndexController;
        this.controllers['Login'] = LoginController;

        if (location.host == 'localhost' || location.host == '192.168.1.249') MainConfig.BASE_URL = '/AltBet.Admin';
        else MainConfig.BASE_URL = '/Admin';


        // init current controller (sets in razor views)
        if( globalData && globalData.controller )
        {
            this.currentController = new this.controllers[globalData.controller.name]();
        } // endif;


        // init user
        this.User = new User();
    }



    /**
     * on JQuery ready
     */
    public ready()
    {
        Handlebars.registerHelper('iif', function(test, yes, no) {
            return test ? yes : no;
        });


        (new GroupsTree()).init();

        // call current action
        if (this.currentController) {
            this.currentController['action' + globalData.controller.action]();

            (new BodyView()).addClass(globalData.controller.name);
        }
    }
}