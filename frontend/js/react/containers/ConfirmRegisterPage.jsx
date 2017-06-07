import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from './BaseController';
import actions from '../actions/registerActions.ts';


class ConfirmRegisterPage extends BaseController
{
    constructor(props)
    {
        super(props);

        // this.state = {data: props.data};
        __DEV__&&console.debug( 'this.props', props );

        // this.actions = props.eventPageActions;
    }


    render()
    {
        


        return (
            <div className="wrapper_event_page">
                <h1>Hello</h1>
            </div>
        );
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    // confirmRegisterPage: state.confirmRegisterPage,
}),
dispatch => ({
	// actions: bindActionCreators(actions, dispatch),
})
)(ConfirmRegisterPage)