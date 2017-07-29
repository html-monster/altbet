/**
 * Created by Vlasakh on 01.03.2017.
 */

/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import BaseController from './BaseController';
import {RegisterForm} from '../components/RegisterForm.jsx';
import actions from '../actions/registerActions.ts';


class RegisterBox extends BaseController
{
    /**@private*/ closeForm;


    constructor(props) {
        super(props);
        // __DEV__ && console.log( 'RegisterBox props', props );
    }


    render() {
        return (
            <div className="sign_up_form pop_up">
                <div className="pop_up_container">
                    <div className="sign_up_content pop_up_content">
                        <div className="top_reg">
                            <div className="wrapper_reg">
                                <div className="tab_content">
                                    <div className="header">
                                        <div className="logo_container">
                                            <a href={ABpp.baseUrl + '/eng/home/index'}
                                               className="logo"><strong>alt.bet</strong></a>
                                        </div>
                                        <div className="warning_container">
                                            <span>Over 18 only</span>
                                        </div>
                                    </div>
                                    <div className="tab_item real">
                                        <span ref={(val) => this.closeForm = val} className="close"><span>{}</span></span>

                                        <RegisterForm onSubmit={this.props.actions.actionFormSubmit.bind(null, this, {closeFunc: ::this._onCloseClick})}/>
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
                </div>
            </div>
        );
    }


    /**
     * On close click
     * @private
     */
    _onCloseClick()
    {
        $(this.closeForm).click();
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