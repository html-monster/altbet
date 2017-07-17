/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react' ;

export default class Chart extends React.PureComponent
{
    // componentDidMount()
    // {
    //     this.props.actions.actionChartMount();
	// }

    // componentWillReceiveProps(nextProps)
    // {
        // let checked = this.props.data.Chart.ChartObj.getType() === this.props.data.Chart.types.TYPE_SPLINE;
		//
		// this.refs.chartType.checked = !checked;
    // }

    render()
    {
        const { chartTypeChange } = this.props;

        return <div className="chart_container">
                {/*<h2>{this.props.data.pageEventData.IsMirrorName}</h2>*/}
                <label className="chk-chart-type checkbox checkbox_horizontal green-brown label-left">
                    <input ref="chartType" type="checkbox" defaultChecked={false} onChange={chartTypeChange} />
                    <span className="label"><b>Line</b>/<i>Area</i></span>
                    <span />
                </label>
                {/*<input id="IsMirror" name="IsMirror" type="hidden" defaultChecked={this.props.data.IsMirror} value={`${this.props.data.IsMirror}`} />*/}
                {/*<input id="IsMirror" name="IsMirror" type="hidden" value={false} />*/}
                <div className="chart">
                    <div id={"eventContainer_" + this.props.id} ref={'ChartContainer'}/>
                </div>
            </div>;
    }


    // _onChkChange()
    // {
    //     this.props.actions.actionChartTypeChange(this.refs.chartType.checked);
    // }
}

// if( __DEV__ )
// {
//     PageMyPos.propTypes = {
//         data: React.PropTypes.shape({
//             positionData: PropTypes.number.isRequired,
//             historyData: PropTypes.array.isRequired,
//         })
//     };
// } // endif
