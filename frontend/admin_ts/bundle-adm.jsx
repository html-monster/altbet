/**
 * Created by Vlasakh on 27.12.2016.
 */

/// <reference path="./../js/.d/common.d.ts" />
/// <reference path="./../js/.d/jquery.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {Framework} from 'common/Framework.ts';


// import { Router, Route, IndexRedirect, hashHistory } from 'react-router'

import configureStore from './react/store/configureStore.js';
import App from "./ADpp";
import {Header} from "./react/containers/Header";
import HomeEvents from "./react/containers/HomeEvents";
import FeedEvents from "./react/containers/FeedEvents";
import NewFeedExchange from "./react/containers/NewFeedExchange";
import Users from "./react/containers/Users";


let store;
let ADpp = new App();


$(document).ready(function()
{
    ADpp.ready();
});


// BM: Mount points
// Header
mountById2('DiHeaderMP', Header);

// Home events table
mountById('DiMPHomeEvents', <HomeEvents />);

// Feed events table
mountById('DiFeedEvents', <FeedEvents />);

// Apply feed event
mountById('DiNewFeedExchange', <NewFeedExchange />);

// Users
mountById('DiUserMP', <Users />);



function mountById(inId, inComponent)
{
    let mp;
    if( mp = document.getElementById(inId) )
    {
        if (!store) {
            store = configureStore();
            ADpp.Store = store;
        }

        ReactDOM.render(
            <Provider store={store}>
                {inComponent}
            </Provider>,
          mp
        );

        return true;
    }
    return;
}

function mountById2(inId, inClass)
{
    let mp;
    if( mp = document.getElementById(inId) )
    {
        if (!store) {
            store = configureStore();
            ADpp.Store = store;
        }



        let $Component = connect(
            state => inClass.connect.state(state),
            dispatch => {
                let actions = {};
                Object.keys(inClass.connect.actions).forEach(val => actions[val] = bindActionCreators(Framework.initAction(inClass.connect.actions[val]), dispatch));
                return actions;
            }
            // actions: bindActionCreators(Framework.initAction(Actions), dispatch),
        )(inClass);

        ReactDOM.render(
            <Provider store={store}>
                <$Component/>
            </Provider>,
          mp
        );

        return true;
    }
    return;
}