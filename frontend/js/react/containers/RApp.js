import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import Page from '../components/Page'
import Actions from '../actions/appActions.ts';
// import * as userActions from '../actions/UserActions';


class RApp extends React.Component
{
    constructor(props, context)
    {
        super(props, context);

        props.actions.setInstance(this);

        ABpp.ver = '[AIV]{version}[/AIV]';
        __DEV__&&console.info( '--------------------------------------------------' );
        __DEV__&&console.info( `version: ${ABpp.ver} (<<REPLACE VERSION>>)` );
        // 0||console.log( 'here', 4 );

        // set base for link urls
        // ABpp.baseUrl = location.host == 'localhost' ? "/AltBet" : "/";
        // ABpp.baseUrl = globalData.rootUrl;

        props.actions.actionOnLoad();
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
