import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Chart from './EventPage/Chart'

class EventPage extends React.Component
{
    constructor(props)
    {
        super();

        // this.state = {data: props.data};
        // 0||console.debug( 'this.props', this.props, props );
    }

    render()
    {
        return <Chart data={this.props.eventPage.pageEventData} />
    }
}


export default connect(state => ({
    eventPage: state.eventPage,
}),
dispatch => ({
    // pageActions: bindActionCreators(pageActions, dispatch),
    // userActions: bindActionCreators(userActions, dispatch)
})
)(EventPage)