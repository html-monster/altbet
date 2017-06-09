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

        __DEV__&&console.log( 'ConfirmRegisterPage props', props );

        this.state = {sendConfirmation: {isSending: false, ErrorMessage: props.data.sendConfirmation.ErrorMessage, Success: false}};
    }


    // shouldComponentUpdate(next)
    componentWillUpdate(next)
    {
        // 0||console.log( 'next, this.props', next, this.props );
        const { sendConfirmation: {ErrorMessage, sending, Success} } = next.data;

        //sendConfirmationErrorMessage
        if( sending !== this.props.data.sendConfirmation.sending)
        {
            this.setState({...this.state, sendConfirmation: {ErrorMessage, isSending: false, Success}});
        } // endif

        // return true;
    }


    render()
    {
        const { data: { confirmPageData: data, sendConfirmation}, } = this.props;
        const { ErrorMessage, Success, isSending } = this.state.sendConfirmation;
        // 0||console.log( 'ErrorMessage', this.state );

        return do {
            if( data.isRegisterActivated )
                <div>Your account has been activated, <a href={globalData.Urls.Home}>see exchanges</a> for playing</div>
            else if( data.ErrorCode === 102 )
                <div>{data.ErrorMessage}</div>
            else
                <div>
                    {data.ErrorMessage ? data.ErrorMessage + '.' : "Your account need to be activated, see the letter with activation link on your email."}
                    <br />
                    To ask activation link again click button below:&nbsp;
                    <br /><br />
                    <button className="btn btn-md btn_green" disabled={isSending} onClick={::this._onSendConfirmEmailClick}>{isSending ? "sending..." : "Send Letter"}</button>
                    {ErrorMessage ?
                        <span className={Success === false ? "-red" : ""}>&nbsp;&nbsp;{ErrorMessage}</span>
                        :
                        !Success || <span>&nbsp;&nbsp;Letter was sent, please, check your email</span>
                    }
                </div>
        }
        ;
    }


    _onSendConfirmEmailClick()
    {
        const { data: { confirmPageData: data, }, } = this.props;

        this.setState({...this.state, sendConfirmation: {ErrorMessage: '', isSending: true, Success: false}});
        this.props.actions.actionSendConfirmEmail(ABpp.User.login ? ABpp.User.login : data.UserName, data.confirmationCode, data.Generate)
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    data: state.confirmRegisterPage,
}),
dispatch => ({
	actions: bindActionCreators(actions, dispatch),
})
)(ConfirmRegisterPage)