import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from '../common/BaseController';
// import Chart from '../components/MainPage/Chart';
import * as mainPageActions from '../actions/mainPageActions';
// import * as MainPageActions from '../actions/MainPageActions.ts';

class MainPage extends React.Component implements BaseController
{
    constructor(props)
    {
        super();

        // ABpp.controllers.MainPage

        // this.state = {data: props.data};
        // 0||console.debug( 'this.props', this.props, props );
    }

    render()
    {
        let isBasicMode = ABpp.User.settings.basicMode;
        return (
            <div className="nav_items">
                <div className="wrapper" id="exchange">
                    <div className="tabs">
                        <span className="tab"><span data-content="Closing soon"></span></span>
                        <span className="tab"><span data-content="Popular"></span></span>
                        <span className="tab"><span data-content="Trending"></span></span>
                        <span className="tab"><span data-content="New"></span></span>
                        <span className="tab"><span data-content="Movers"></span></span>
                        <div className="mode_wrapper">
                            <label className="mode_switch">
                                <input defaultChecked={!isBasicMode} id="Mode" name="Mode" type="checkbox" />
                                <input name="Mode" type="hidden" defaultValue={!isBasicMode} />
                                { isBasicMode ? <span>Basic Mode</span> : <span>Expert Mode</span> }
                            </label>
                        </div>
                    </div>
                    <div className="tab_content">
                        <div className="tab_item ui-sort">
                            {/*@Html.Action("GetExchanges")*/}
                        </div>
                    </div>
                </div>
            </div>
        );
        // return <Chart data={this.props.MainPage} actions={this.props.chartActions} />
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    mainPage: state.mainPage,
    // test: state.Ttest,
}),
dispatch => ({
    // MainPageActions: bindActionCreators(MainPageActions, dispatch),
    // chartActions: bindActionCreators(mainPageActions, dispatch),
})
)(MainPage)