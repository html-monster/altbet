import React from 'react' ;
// import { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import User from '../components/User'
// import Page from '../components/Page'
// import * as pageActions from '../actions/PageActions';
// import * as userActions from '../actions/UserActions';


class RApp extends React.Component
{
    constructor(props, context)
    {
        super(props, context)

        0||console.debug( 'constr', ABpp.config );
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