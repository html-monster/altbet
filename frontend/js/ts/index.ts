/// <reference path="./../.d/common.d.ts" />
/// <reference path="./../.d/jquery.d.ts" />
declare let globalData : any;
declare let window : any;


// import { Chart } from "./models/PageEvent/Chart";

// local dev option
window.__LDEV__ = true;


// Altbet App object
export const App = {
    config: {
        currentTheme: globalData.theme
    }
};


// namespace EventPage {
//     export const Chart = ChartObj;
// }
