declare let __DEV__;
/** @var ABpp */
declare let ABpp;
declare let __LDEV__;
declare let moment;
declare let appData;
// declare var window : any;
declare let dataController;
declare let mainChartController;
declare let globalData;
declare let defaultMethods;
declare let activeTraderClass;
declare let Promise;
declare const DS;
declare const Visibility;
// declare let $;


interface ABpp
{
    config: {
        currentTheme: null,   // current theme
        currentPage: null,    // current page
        takerFees: null,      // taker fees
        makerFees: null,       // maker fees
        basicMode: true,      // play mode
        tradeOn: false,       // active trader state
    }
}


interface JQuery
{
    jstree(p1?, ...p2?)
    datepicker(p1?);
    daterangepicker(p1?);
    select2(p1?);
}


interface Window
{
    ADpp : any;
    SocketSubscribe : any;
    HomeEvents : any;
    gidxServiceStatus: any;
}



// interface globalData
// {
//     myPosOn : any,
//     myOrdersOn : any,
// }

interface Object
{
    assign(t1, t2?, t3?)
}

interface FormData {
    set(p1, p2)
}


interface Math {
    round10(p1, p2)
}



// admin
declare var Handlebars;
