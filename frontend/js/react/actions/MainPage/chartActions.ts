// import { ON_CHART_MOUNT } from '../../constants/ActionTypesPageMain';
// import Chart from "../../models/MainPage/Chart";
// import BaseActions from '../BaseActions';
// import { WebsocketModel } from '../../models/Websocket';
//
// // declare let window;
// /// <reference path="../../../.d/common.d.ts" />
//
// export default class chartActions extends BaseActions
// {
//     private actionChartTypeChange(checked)
//     {
//         return (dispatch, getState) => {
//         //     let ChartObj = getState().mainPage.Chart.ChartObj;
//         //     ChartObj.setType(checked ? Chart.TYPE_AREASPLINE : Chart.TYPE_SPLINE);
//         //     // dispatch({
//         //     //     type: ON_CHART_MOUNT,
//         //     //     payload: { Chart: ChartObj }
//         //     // });
//         }
//     }
//
//     private actionChartMount()
//     {
//         // let ChartObj = new Chart();
//         // ABpp.Chart = ChartObj;
//         // // Listen for chart data
//         // ABpp.Websocket.subscribe((inData) =>
//         // {
//         //     ChartObj.drawEventChart(inData);
//         //
//         // }, WebsocketModel.CALLBACK_MAINPAGE_CHART);
//         // // window.ee.addListener('EventPage.Chart.setData', function (data)
//         // // {
//         // //     ChartObj.drawEventChart(data);
//         // //     // __DEV__&&console.warn( 'EventPage.Chart.setData listened', data );
//         // // });
//         //
//         return (dispatch) => {
//         //     dispatch({
//         //         type: ON_CHART_MOUNT,
//         //         payload: { Chart: ChartObj, types: Chart }
//         //     });
//         }
//     }
// }
//
//
