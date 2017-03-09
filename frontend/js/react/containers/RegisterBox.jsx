/**
 * Created by Vlasakh on 01.03.2017.
 */

/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import {RegisterForm} from '../components/RegisterForm.jsx';
import actions from '../actions/registerActions.ts';


class RegisterBox extends BaseController
{
    constructor(props)
    {
        super(props);
        __DEV__ && console.log( 'RegisterBox props', props );
    }


    render()
    {
        return <div className="pop_up_container">
            <div className="sign_up_content pop_up_content">
                <div className="header">
                    <span className="close"><span></span></span>
                    <div className="logo_container">
                        <a href="/" className="logo"><strong>alt.bet</strong></a>
                    </div>
                    <div className="warning_container">
                        <span>Over 18 only</span>
                    </div>
                </div>
                <div className="top_reg">
                    <div className="wrapper_reg">
                        <div className="tabs">
                            {/*<span className="tab">real</span>*/}
                            {/*<!--<span className="tab">Demo</span>-->*/}
                            {/*<span className="tab market-make">Market maker</span>*/}
                        </div>
                        <div className="tab_content">
                            <div className="tab_item real">
                                <RegisterForm onSubmit={this.props.actions.actionFormSubmit.bind(null, this)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="confirm pop_up">
                    <div className="pop_up_container">
                        <span className="pop_up_content">
                            A letter of confirmation of registration has been sent to you by email. Follow the link in the email to activate your Account.
                            <button className="btn">Ok</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>;
    }
}


export default connect(
    state => ({
        // data: state.myPosReduce,
        // test: state.Ttest,
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
    })
)(RegisterBox)