/// <reference path="./../.d/common.d.ts" />
/// <reference path="./../.d/jquery.d.ts" />
declare let globalData : any;
declare let window : any;


import { User } from "../react/models/User";
import { WebsocketModel } from "../react/models/Websocket";

// declare var WebsocketModel: WebsocketModel;

// local dev option
// __LDEV__ = true;


/**
 * Altbet common App object
 * Singleton
 */
export class ABpp
{
    public static PAGE_MAIN = 1;
    public static PAGE_EVENT = 2;

    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    // application config
    public config = {
                currentTheme: null,     // current theme
                currentPage: null       // current page
            };

    public actions : any = {};

    public User: User = null;           // user entity
    public Websocket: WebsocketModel = null; // websocket object
    public baseUrl: "";                 // add before urls


    private static instance = null;


    public static getInstance()
    {
        return this.instance ? this.instance : this.instance = new this;
    }



    private constructor()
    {
        // set current theme from server
        this.config.currentTheme = globalData.theme;

        // set current page from server
        this.config.currentPage = this.setCurrentPage();

        // create user
        this.createUser();
    }


    public registerAction(name, action)
    {
        this.actions[name] = action;
    }


    private setCurrentPage()
    {
        if( globalData.mainPage )
            return ABpp.PAGE_MAIN;
        else if( globalData.eventPageOn )
            return ABpp.PAGE_EVENT;
    }


    private createUser()
    {
        this.User = new User();
        this.User.settings = Object.assign({}, this.User.settings, {
            // ...this.User.settings,
            basicMode: globalData.basicMode,
            tradeOn: globalData.tradeOn,
            autoTradeOn: globalData.autoTradeOn,
        });
    }
}


// namespace EventPage {
//     export const Chart = ChartObj;
// }
