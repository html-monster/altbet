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
    public static PAGE_MAIN = '1';
    public static PAGE_EVENT = '2';
    public static PAGE_ACCOUNT = '3';
    public static PAGE_MYPOS = '4';
    public static TAKER_FEES = 0.0086;
    public static MAKER_FEES = 0.0026;


    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    public ver = 0.1;


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


    // action from components
    public actions : any = {};

    public User: User = null;                   // user entity
    public Websocket: WebsocketModel = null;    // websocket object
    public SysEvents: SysEvents = null;         // system events
    public Store = null;                        // redux store


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

        // set fees
        this.config.takerFees = ABpp.TAKER_FEES;
        this.config.makerFees = ABpp.MAKER_FEES;

        // init system events
        this.SysEvents = new SysEvents();

        // create user
        this.createUser();

        // set basic mode from user settings
        this.config.basicMode = this.User.settings.basicMode;
        this.config.tradeOn = this.User.settings.tradeOn;

        // set curr ver
        globalData.AppVersion = this.ver; // for debug only
        this.baseUrl = globalData.rootUrl.slice(0, -1);
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
        else if( globalData.myPosOn )
            return ABpp.PAGE_MYPOS;
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
