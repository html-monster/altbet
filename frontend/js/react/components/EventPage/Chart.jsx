/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react' ;

export default class Chart extends React.Component
{
    constructor(props)
    {
        super();

        this.state = {checked: true};
    }

    componentDidMount()
    {
        this.props.actions.actionChartMount();
	}

    componentWillReceiveProps(nextProps)
    {
        let checked = this.props.data.Chart.ChartObj.getType() === this.props.data.Chart.types.TYPE_SPLINE;

        this.refs.chartType.checked = !checked;
    }

    render()
    {
        const { pageEventData } = this.props.data;
        let checked = this.state.checked;

        return <div>
                <h2>{pageEventData.IsMirrorName}</h2>
                <label className="chk-chart-type checkbox checkbox_horizontal green-brown label-left">
                    <input ref="chartType" type="checkbox" defaultChecked={true} onChange={::this._onChkChange} />
                    <span className="label"><b>Line</b>/<i>Area</i></span>
                    <span />
                </label>
                {/*<input id="IsMirror" name="IsMirror" type="hidden" defaultChecked={this.props.data.IsMirror} value={`${this.props.data.IsMirror}`} />*/}
                <input id="IsMirror" name="IsMirror" type="hidden" value={`${pageEventData.IsMirror}`} />
                <div className="chart">
                    <div id={`eventContainer_${pageEventData.chartId}`}/>
                </div>
            </div>;
    }


    _onChkChange()
    {
        this.props.actions.actionChartTypeChange(this.refs.chartType.checked);
    }
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
