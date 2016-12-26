import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {WebsocketModel} from '../models/Websocket';
// import Page from '../components/Page'
// import * as pageActions from '../actions/PageActions';
// import * as userActions from '../actions/UserActions';


class RApp extends React.Component
{
    constructor(props, context)
    {
        super(props, context);

        // set base for link urls
        if( location.host == 'localhost' ) ABpp.baseUrl = "/AltBet"   ;


        // activate websocket
        ABpp.Websocket = new WebsocketModel();
        ABpp.Websocket.connectSocketServer();

        // 0||console.debug( 'constr', ABpp.User );
        // globalData.theme
    }


    render() {
        // const {user, page} = this.props;
        // const { getPhotos } = this.props.pageActions;
        // const { handleLogin } = this.props.userActions;

        return <div></div>
    }
}


export default connect(state => ({
    // user: state.user,
    // page: state.page,
}),
dispatch => ({
    // pageActions: bindActionCreators(pageActions, dispatch),
    // userActions: bindActionCreators(userActions, dispatch)
})
)(RApp)