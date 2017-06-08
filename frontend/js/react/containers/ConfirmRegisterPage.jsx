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

        __DEV__&&console.debug( 'this.props', props );

        this.state = {isSending: false, sendCodeMessage: ''};
    }


    // shouldComponentUpdate(next)
    componentWillUpdate(next)
    {
        // 0||console.log( 'next, this.props', next, this.props );
        const { sendConfirmationErrorMessage, sendConfirmation } = next.confirmRegisterPage;

        //sendConfirmationErrorMessage
        if( sendConfirmation !== this.props.confirmRegisterPage.sendConfirmation)
        {
            this.setState({...this.state, sendCodeMessage: sendConfirmationErrorMessage, isSending: false})
        } // endif

        // return true;
    }


    render()
    {
        const { confirmRegisterPage: { confirmPageData: data, sendConfirmationSuccess}, } = this.props;
        const { sendCodeMessage } = this.state;
// appData.ConfirmPageData = JSON.parse('@Html.Raw(JsonConvert.SerializeObject(new System.Collections.Hashtable()
//             {
//                 {"isRegisterActivated", Model.Result},
//                 {"ErrorCode", Model.ErrorCode},
//                 {"ErrorMessage", Model.ErrorMessage},
//                 {"Generate", "GenerateNewConfirmationHash"},
// //                {"userName", Request.QueryString["userName"]},
// //                {"confirmationCode", this. Request.QueryString["confirmationCode"]},
//             }))')
        0||console.log( 'sendCodeMessage', sendConfirmationSuccess );

        return data.isRegisterActivated ?
            <div className="wrapper_event_page">Your account has been activated, <a href={globalData.Urls.Home}>see exchanges</a> for playing</div>
            :
            <div>
                Your account need to be activated, see the letter with activation link on your email.
                <br />
                To ask activation link again click button below:&nbsp;
                <br /><br />
                <button className="btn btn-md btn_green" disabled={this.state.isSending} onClick={this._onSendConfirmEmailClick.bind(this, data.confirmationCode, data.Generate)}>{this.state.isSending ? "sending..." : "Send Letter"}</button>
                {!sendCodeMessage ||
                    <span className={sendConfirmationSuccess === false ? "-red" : ""}>&nbsp;&nbsp;{sendCodeMessage}</span>
                }
            </div>

        ;
    }


    _onSendConfirmEmailClick(confirmationCode, generateUrl)
    {
        this.setState({...this.state, isSending: true, sendCodeMessage: ''});
        this.props.actions.actionSendConfirmEmail(ABpp.User.login, confirmationCode, generateUrl)
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    confirmRegisterPage: state.confirmRegisterPage,
}),
dispatch => ({
	actions: bindActionCreators(actions, dispatch),
})
)(ConfirmRegisterPage)