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


const store = configureStore();
var ADpp = new App();
ADpp.Store = store;


$(document).ready(function()
{
    ADpp.ready();
});



// BM: Mount points
0||console.log( 'aaa', document.getElementById('DiNewFeedExchange') );
0||console.log( 'bbb', document.getElementById('DiNewFeedExchange') );
if( document.getElementById('DiNewFeedExchange') )
{
    ReactDOM.render(
        <Provider store={store}>
            <NewFeedExchange />
        </Provider>,
      document.getElementById('DiNewFeedExchange')
    );
}