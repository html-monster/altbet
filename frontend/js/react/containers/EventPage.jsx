import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from '../common/BaseController';
import Chart from '../components/EventPage/Chart';
import * as chartActions from '../actions/EventPage/chartActions.ts';
// import * as eventPageActions from '../actions/eventPageActions.ts';

class EventPage extends React.Component implements BaseController
{
    constructor(props)
    {
        super();

        // ABpp.controllers.EventPage

        // this.state = {data: props.data};
        // 0||console.debug( 'this.props', this.props, props );
    }

    render()
    {
        return <Chart data={this.props.eventPage} actions={this.props.chartActions} />
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    eventPage: state.eventPage,
    // test: state.Ttest,
}),
dispatch => ({
    // eventPageActions: bindActionCreators(eventPageActions, dispatch),
    chartActions: bindActionCreators(chartActions, dispatch),
})
)(EventPage)