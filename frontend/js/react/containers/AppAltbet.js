// import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import User from '../components/User'
import Page from '../components/Page'
import * as pageActions from '../actions/PageActions';
import * as userActions from '../actions/UserActions';


class App extends Component {
    render() {
        const {user, page} = this.props;
        const { getPhotos } = this.props.pageActions;
        const { handleLogin } = this.props.userActions;

        return <div>
            <div className="row">
                <div className="col-xs-12 col-sm-6">
                    <Page data={page} actions={({getPhotos})} />
                    <User name={user.name} handleLogin={handleLogin} error={user.error} />
                </div>
                <div className="col-xs-12 col-sm-6">
                    {/*<FriendListApp />*/}
                    {/*{renderDevTools(store)}*/}
                </div>
            </div>
        </div>
    }
}


export default connect(state => ({
    user: state.user,
    page: state.page,
}),
dispatch => ({
    pageActions: bindActionCreators(pageActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
})
)(App)