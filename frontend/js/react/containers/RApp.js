import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {WebsocketModel} from '../models/Websocket';
// import Page from '../components/Page'
import Actions from '../actions/appActions.ts';
// import * as userActions from '../actions/UserActions';


class RApp extends React.Component
{
    constructor(props, context)
    {
        super(props, context);

        props.actions.setInstance(this);

        // set base for link urls
        // ABpp.baseUrl = location.host == 'localhost' ? "/AltBet" : "/";
        // ABpp.baseUrl = globalData.rootUrl;


        // activate websocket
        ABpp.Websocket = new WebsocketModel();
        ABpp.Websocket.connectSocketServer();
        globalData.Websocket = ABpp.Websocket; // for debug

        // globalData.theme
    }


    addController(name, that)
    {
        this.props.actions.addController(name, that);
    }



    render() {
        // const {user, page} = this.props;
        // const { getPhotos } = this.props.pageActions;
        // const { handleLogin } = this.props.userActions;

        return <div></div>
    }
}


export default connect(state => ({
    // RApp: state.appState,
}),
dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})
)(RApp)