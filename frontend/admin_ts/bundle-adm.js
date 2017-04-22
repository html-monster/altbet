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
import NewFeedExchange from "./react/containers/NewFeedExchange.jsx";


var ADpp = new App();

$(document).ready(function()
{
    ADpp.ready();
});



const store = configureStore();

// BM: Mount points
if( true ) {
    ReactDOM.render(
        <Provider store={store}>
            <NewFeedExchange />
        </Provider>,
      document.getElementById('DiNewFeedExchange')
    );
}