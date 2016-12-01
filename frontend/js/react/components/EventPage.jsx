import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Chart from './EventPage/Chart'

class EventPage extends React.Component
{
    constructor(props)
    {
        super();

        // this.state = {data: props.data};
    }

    render()
    {
        // const {test1} = this.props;

        return <Chart />
    }
}


export default connect(state => ({
    chart: state.chart,
}),
dispatch => ({
    // pageActions: bindActionCreators(pageActions, dispatch),
    // userActions: bindActionCreators(userActions, dispatch)
})
)(EventPage)