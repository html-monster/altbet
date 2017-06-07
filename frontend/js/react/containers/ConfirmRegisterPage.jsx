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
        const { confirmRegisterPage: { confirmPageData: data, }, } = this.props;
// appData.ConfirmPageData = JSON.parse('@Html.Raw(JsonConvert.SerializeObject(new System.Collections.Hashtable()
//             {
//                 {"isRegisterActivated", Model.Result},
//                 {"ErrorCode", Model.ErrorCode},
//                 {"ErrorMessage", Model.ErrorMessage},
//                 {"Generate", "GenerateNewConfirmationHash"},
// //                {"userName", Request.QueryString["userName"]},
// //                {"confirmationCode", this. Request.QueryString["confirmationCode"]},
//             }))')
        0||console.log( 'data', data, this.props );

        return (
            <div className="wrapper_event_page">
                <h1>Hello</h1>
            </div>
        );
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    confirmRegisterPage: state.confirmRegisterPage,
}),
dispatch => ({
	// actions: bindActionCreators(actions, dispatch),
})
)(ConfirmRegisterPage)