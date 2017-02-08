/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Funds from '../components/userPage/Funds';
import {Preferences} from '../components/userPage/Preferences';


class AccountPage extends BaseController
{
    constructor(props)
    {
        super(props);
        __DEV__ && console.log( 'AccountPage props', props );
    }


    render()
    {
        return <div className="wrapper_about wrapper_user_page">
            <ul className="tabs">
                <li className="tab active"><span>Funds</span></li>
                <li className="tab"><span>My Preferences</span></li>
                <li className="tab"><span>Settings</span></li>
            </ul>
            <div className="tab_content">
                <Funds/>

                <div className="tab_item preferences">
                    <h2>Preferences</h2>
                    <div className="user_info">
                        <div className="personal_info">
                            <h3 className="mail">test2@alt.bet</h3>
                            <strong>FirstName LastName</strong>
                        </div>
                    </div>
                </div>
                <div className="tab_item settings">
                    <h2>Settings</h2>
                    <div className="user_info">
                        <div className="logo"></div>
                        <div className="personal_info">
                            <h3 className="mail">test2@alt.bet</h3>
                            <strong>FirstName LastName</strong>
                        </div>
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
        // actions: bindActionCreators(actions, dispatch),
        // myPositionsActions: bindActionCreators(myPositionsActions, dispatch),
    })
)(AccountPage)