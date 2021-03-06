/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import BaseController from './BaseController';
import Funds from '../components/userPage/Funds';
import Preferences from '../components/userPage/Preferences';
import Settings from '../components/userPage/Settings';
import ChangePassword from '../components/userPage/settings/ChangePassword.jsx';
import SelfExclusion from '../components/userPage/SelfExclusion.jsx';
import Actions from '../actions/UserPageAction.ts';
import {Framework} from '../common/Framework.ts';

// import ChangePassword from '../components/userPage/settings/ChangePassword';


class UserPage extends BaseController
{
    constructor(props)
    {
        super(props);
        __DEV__ && console.log( 'UserPage props', props );

        props.actions.actionOnLoad();

    }


    render()
    {
        const staticData = appData.pageAccountData;
        let $tabHeaderHtml = <div className="user_info">
				<div className="personal_info">
					<strong>{staticData.UserInfo.Email}</strong>
					<strong>{staticData.UserInfo.FirstName} {staticData.UserInfo.LastName}</strong>
				</div>
			</div>;

        return <div className="wrapper_about wrapper_user_page">
            <ul className="tabs tabs_left">
                <li className={"tab custom fund_b " + (this.props.route.tab === "funds" ? "active" : "")}><Link to={`/funds`}>Funds</Link></li>
                <li className={"tab custom pref_b " + (this.props.route.tab === "pref" ? "active" : "")}><Link to={`/preferences`}>My Preferences</Link></li>
                <li className={"tab custom sett_b " + (this.props.route.tab === "sett" ? "active" : "")}><Link to={`/settings`}>User info</Link></li>
                <li className={"tab custom pass_b " + (this.props.route.tab === "pass" ? "active" : "")}><Link to={`/change_password`}>Change Password</Link></li>
                <li className={"tab custom self_sett_b " + (this.props.route.tab === "self_sett" ? "active" : "")}><Link to={`/self_exclusion`}>Self Exclusion</Link></li>
            </ul>
            <div className="tab_content">
                <Funds data={{header: $tabHeaderHtml, active: this.props.route.tab === "funds", tab: this.props.params.tabname}}/>

                <Preferences data={{header: $tabHeaderHtml, active: this.props.route.tab === "pref"}}/>

                <Settings data={{header: $tabHeaderHtml, active: this.props.route.tab === "sett"}}/>

                <ChangePassword data={{header: $tabHeaderHtml, active: this.props.route.tab === "pass"}}/>

                <SelfExclusion data={{header: $tabHeaderHtml, active: this.props.route.tab === "self_sett"}}/>
            </div>
        </div>;
    }
}


export default connect(
    state => ({
        data: state.userPage,
    }),
    dispatch => ({
        actions: bindActionCreators(Framework.initAction(Actions), dispatch)
    })
)(UserPage)