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


let store;
let ADpp = new App();


$(document).ready(function()
{
    ADpp.ready();
});


// BM: Mount points
// Feed events table
mountById('DiFeedEvents', <FeedEvents />);

// Apply feed event
mountById('DiNewFeedExchange', <NewFeedExchange />);



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
    }
}