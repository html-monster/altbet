import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

// import Chart from '../components/EventPage/Chart';
import * as mainPageActions from '../actions/mainPageActions';
// import * as eventPageActions from '../actions/eventPageActions.ts';

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
        return <div>Hello</div>
        // return <Chart data={this.props.eventPage} actions={this.props.chartActions} />
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    mainPage: state.mainPage,
    // test: state.Ttest,
}),
dispatch => ({
    // eventPageActions: bindActionCreators(eventPageActions, dispatch),
    // chartActions: bindActionCreators(mainPageActions, dispatch),
})
)(EventPage)