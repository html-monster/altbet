/**
 * Created by Vlasakh on 04.01.2017.
 */

import Category from "./controller/Category";
import Exchanges from "./controller/Exchanges";
import { GroupsTree } from "./controller/GroupsTree";
import Body from "./view/Body";


export default class ADpp
{
    private controllers = {};
    private currentController = null;

    constructor()
    {
        // application controllers
        this.controllers['Category'] = Category;
        this.controllers['Exchanges'] = Exchanges;


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

            (new Body()).addClass(globalData.controller.name);
        }
    }
}