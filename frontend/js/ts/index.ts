/// <reference path="./../.d/common.d.ts" />
/// <reference path="./../.d/jquery.d.ts" />

// import "babel-polyfill";

import {SysEvents} from "../react/models/SysEvents";
// import OddsConverter from '../react/models/oddsConverter/oddsConverter';

declare let globalData : any;
declare let window : any;


import { User } from "../react/models/User";
import { Localization } from "../react/common/Localization";

declare const WebsocketModel: any;

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
    public static PAGE_MYPOS = 'PAGE_MYPOS';
    public static PAGE_LANDING = 'PAGE_LANDING';
    public static PAGE_STATIC = 'PAGE_STATIC';
    public static PAGE_ANSWER = 'PAGE_ANSWER';
    public static PAGE_ACCOUNT_CONFIRM = 'P8';
    public static TAKER_FEES = 0.04;
    public static MAKER_FEES = 0.04;


    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    public ver = "3";


    // application config
    public config = {
        currentTheme: null,   // current theme
        currentPage: null,    // current page
        currentOddSystem: null, // current Odd System
        takerFees: null,      // taker fees
        makerFees: null,      // maker fees
        basicMode: true,      // play mode
        tradeOn: false,       // active trader state
    };
    public baseUrl: "";                 // add before urls


    // action from components
    public actions : any = {};

    public User: User = null;                   // user entity
    public Websocket = null;                    // websocket object
    public SysEvents: SysEvents = null;         // system events
    public Store = null;                        // redux store
    // public OddsConverter = null;                        // redux store
    public Localization = null;                 // localization module
    public Chart = null;                        // EP chart


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

        this.config.currentOddSystem = localStorage.getItem('currentOddSystem') ? localStorage.getItem('currentOddSystem') : 'Implied';
        // this.OddsConverter = new OddsConverter();

        // set basic mode from user settings
        this.config.basicMode = this.User.settings.basicMode;
        this.config.tradeOn = this.User.settings.tradeOn;

        // set curr ver
        globalData.AppVersion = this.ver; // for debug only
        this.baseUrl = globalData.rootUrl.slice(0, -1);


        this.Localization = Localization;
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
        else if( globalData.landingPage )
            return ABpp.PAGE_LANDING;
        else if( globalData.actionName === "getstaticpage" )
            return ABpp.PAGE_STATIC;
        else if( globalData.answerPageOn )
            return ABpp.PAGE_ANSWER;
        else if( globalData.action === "confirm" && globalData.controller === "account" )
            return ABpp.PAGE_ACCOUNT_CONFIRM
            ;
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
