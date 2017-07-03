/**
 * Created by Vlasakh on 27.12.2016.
 */

/// <reference path="./../js/.d/common.d.ts" />
/// <reference path="./../js/.d/jquery.d.ts" />

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Router, Route, IndexRedirect, hashHistory } from 'react-router'

import configureStore from './react/store/configureStore';
import App from "./ADpp";
import FeedEvents from "./react/containers/FeedEvents";
import NewFeedExchange from "./react/containers/NewFeedExchange";


const store = configureStore();
let mp;
let ADpp = new App();
ADpp.Store = store;


$(document).ready(function()
{
    ADpp.ready();
});



// BM: Mount points
// Feed events table
if( mp = document.getElementById('DiFeedEvents') )
{
    ReactDOM.render(
        <Provider store={store}>
            <FeedEvents />
        </Provider>,
      mp
    );
}


// Apply feed event
if( mp = document.getElementById('DiNewFeedExchange') )
{
    ReactDOM.render(
        <Provider store={store}>
            <NewFeedExchange />
        </Provider>,
      mp
    );
}
