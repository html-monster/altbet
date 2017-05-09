/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import BaseController from './BaseController';
import Funds from '../components/userPage/Funds';
import Preferences from '../components/userPage/Preferences';
import Settings from '../components/userPage/Settings';


class UserPage extends BaseController
{
    constructor(props)
    {
        super(props);
        __DEV__ && console.log( 'UserPage props', props );
    }


    render()
    {
        const staticData = appData.pageAccountData;
        let $tabHeaderHtml = <div className="user_info">
				<div className="personal_info">
					<strong>{staticData.UserInfo.Email}</strong>
					<strong>{`${staticData.UserInfo.FirstName} ${staticData.UserInfo.LastName}`}</strong>
				</div>
			</div>;


        return <div className="wrapper_about wrapper_user_page">
            <ul className="tabs text_left">
                <li className={"tab " + (this.props.route.tab === "funds" ? "active" : "")}><Link to={`/funds`}>Funds</Link></li>
                <li className={"tab " + (this.props.route.tab === "pref" ? "active" : "")}><Link to={`/preferences`}>My Preferences</Link></li>
                <li className={"tab " + (this.props.route.tab === "sett" ? "active" : "")}><Link to={`/settings`}>Settings</Link></li>
            </ul>
            <div className="tab_content">
                <Funds data={{header: $tabHeaderHtml, active: this.props.route.tab === "funds", tab: this.props.params.tabname}}/>

                <Preferences data={{header: $tabHeaderHtml, active: this.props.route.tab === "pref"}}/>

                <Settings data={{header: $tabHeaderHtml, active: this.props.route.tab === "sett"}}/>
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
)(UserPage)