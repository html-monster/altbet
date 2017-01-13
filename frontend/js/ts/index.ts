/// <reference path="./../.d/common.d.ts" />
/// <reference path="./../.d/jquery.d.ts" />
import {SysEvents} from "../react/models/SysEvents";
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
    public static PAGE_MAIN = 'PAGE_MAIN';
    public static PAGE_EVENT = 'PAGE_EVENT';
    public static PAGE_ACCOUNT = 'PAGE_ACCOUNT';
    public static TAKER_FEES = 0.0086;
    public static MAKER_FEES = 0.0026;


    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    // application config
    public config = {
        currentTheme: null,   // current theme
        currentPage: null,    // current page
        takerFees: null,      // taker fees
        makerFees: null,       // maker fees
        basicMode: true,      // play mode
        tradeOn: false,       // active trader state
    };
    public baseUrl: "";                 // add before urls


    public actions : any = {};

    public User: User = null;                   // user entity
    public Websocket: WebsocketModel = null;    // websocket object
    public SysEvents: SysEvents = null;         // system events


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
        this.config.takerFees = ABpp.TAKER_FEES;
        this.config.makerFees = ABpp.MAKER_FEES;

        // init system events
        this.SysEvents = new SysEvents();

        // create user
        this.createUser();

        // set basic mode from user settings
        0||console.log( 'this.User.settings.basicMode', this.User.settings.basicMode );
        this.config.basicMode = this.User.settings.basicMode;
        this.config.tradeOn = this.User.settings.tradeOn;
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
        else if( globalData.userPageOn )
            return ABpp.PAGE_ACCOUNT;
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
