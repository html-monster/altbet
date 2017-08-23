import React from 'react' ;

import BaseController from './BaseController';
import Actions from '../actions/HeaderActions.ts';
import classnames from 'classnames';
import {Common} from "common/Common.ts";
// import {MainConfig} from '../../inc/MainConfig';
import {RadioBtns} from 'admin/component/RadioBtns.ts';
import {InfoMessages} from "common/InfoMessages.ts";


export class Header extends BaseController
{
    static connect = {
        state: state => ({
            data: state.HeaderData,
            AppData: state.AppData,
        }),
        actions: {
            // actions: bindActionCreators(Framework.initAction(Actions), dispatch),
            actions: Actions,
        }
    };


    constructor(props)
    {
        super(props);

        __DEV__&&console.log( 'Header props', props );
    }


    componentDidMount()
    {
        (new RadioBtns({
            activeClass: "btn-success",
            target: this.refs.testMode,
            defaultIndex: 1,
            callbacks: [() => {
                this.props.actions.actionChTestMode(true);
                (new InfoMessages).show({
                    title: '',
                    message: 'Test mode on',
                    color: InfoMessages.INFO,
                });
            }, () => {
                this.props.actions.actionChTestMode(false);
                (new InfoMessages).show({
                    title: '',
                    message: 'Test mode off',
                    color: InfoMessages.INFO,
                });
            }],
        })).apply();
    }


    render()
    {
        let { actions, data: {}, AppData: {TestMode, isAdmin, UserData: {logoUrl, logoutUrl, userName, }} } = this.props;


        return <header className="main-header">
            {/*<!-- Logo -->*/}
            <a href={globalData.Urls.Home} className="link-logo">
                <img src={logoUrl}/>
            </a>
            {/*<!-- Header Navbar: style can be found in header.less -->*/}
            <nav className="navbar navbar-static-top">
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
{/*
                            <li className="dropdown user user-menu">
                                <a href="@Url.Action("Logout", "Account")" className="dropdown-toggle">
                                    <i className="user-image fa fa-user"></i>
                                    <span className="hidden-xs"><!-- USER LOGIN-->@User.Identity.Name</span>
                                    <button type="button" className="btn btn-block btn-default btn-sm">Logout</button>
                                </a>
                            </li>
*/}

                        <li className="dropdown user user-menu ">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i className="glyphicon glyphicon-user"/>
                                <span className="hidden-xs">{userName}</span>
                            </a>
                            <ul className="dropdown-menu">
                                {/*<!-- User image -->*/}
                                <li className="user-header">
                                    {/*<img src="../../dist/img/user2-160x160.jpg" className="img-circle" alt="User Image"/>*/}

                                    <p>
                                        User: {userName}
                                        {/*<small>Member since Nov. 2012</small>*/}
                                    </p>
                                </li>
                                {/*<!-- Menu Body -->*/}
                                { isAdmin &&
                                    <li className="user-body">
                                        <div className="row">
                                            <div className="col-xs-12 ">{/*text-center*/}
                                                <div ref="testMode" class="btn-group">
                                                    <button type="button" class="btn btn-default" data-rval="1">On</button>
                                                    <input data-js="valueStor" type="hidden" value={TestMode ? 1 : 2} name="TypeEvent" />
                                                    <button type="button" class="btn btn-default" data-rval="2">Off</button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                }
                                {/*<!-- Menu Footer-->*/}
                                <li className="user-footer">
                                        {/*<div className="pull-left">
                                            <a href="#" className="btn btn-default btn-flat">Profile</a>
                                        </div>*/}
                                    <div className="pull-right">
                                        <a href={logoutUrl} className="btn btn-default btn-flat">Sign out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>;
    }
}