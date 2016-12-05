import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Chart from '../components/EventPage/Chart'
import * as chartActions from '../actions/EventPage/chartActions.ts';

class EventPage extends React.Component
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
}),
dispatch => ({
    // eventPageActions: bindActionCreators(eventPageActions, dispatch),
    chartActions: bindActionCreators(chartActions, dispatch),
})
)(EventPage)