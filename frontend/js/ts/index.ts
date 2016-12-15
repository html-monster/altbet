/// <reference path="./../.d/common.d.ts" />
/// <reference path="./../.d/jquery.d.ts" />
declare let globalData : any;
declare let window : any;


// import { Chart } from "./models/PageEvent/Chart";

// local dev option
window.__LDEV__ = true;


/**
 * Altbet common App object
 * Singleton
 */
export class App
{
    public static PAGE_MAIN = 1;
    public static PAGE_EVENT = 2;

    public static THEME_DARK = 'dark';
    public static THEME_LIGHT = 'light';

    public config = {
                currentTheme: null,     // current theme
                currentPage: null       // current page
            };


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
    }


    private setCurrentPage()
    {
        if( globalData.mainPage )
            return App.PAGE_MAIN;
        else if( globalData.eventPageOn )
            return App.PAGE_EVENT;
    }
}


// namespace EventPage {
//     export const Chart = ChartObj;
// }
