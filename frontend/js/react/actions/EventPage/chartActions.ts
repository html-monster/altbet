import { ON_CHART_MOUNT, ON_CHART_TYPE_CHANGE } from '../../constants/ActionTypesPageEvent.js';
import { Chart } from "../../models/PageEvent/Chart";

declare let window;

export function actionChartTypeChange(checked)
{
    return (dispatch, getState) => {
        let ChartObj = getState().eventPage.Chart.ChartObj;
        ChartObj.setType(!checked ? Chart.TYPE_AREASPLINE : Chart.TYPE_SPLINE);
        // dispatch({
        //     type: ON_CHART_MOUNT,
        //     payload: { Chart: ChartObj }
        // });
    }
}



export function actionChartMount()
{
    let ChartObj = new Chart();
    ABpp.Chart = ChartObj;
    // Listen for chart data
    window.ee.addListener('EventPage.Chart.setData', function (data)
    {
        // __DEV__&&console.warn( 'EventPage.Chart.setData listened', data );
        ChartObj.drawEventChart(data);
    });

    return function(dispatch){
        dispatch({
            type: ON_CHART_MOUNT,
            payload: { Chart: ChartObj, types: Chart }
        });
    }
}
