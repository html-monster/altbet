import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from '../common/BaseController';
import ExchangeItem from '../components/MainPage/ExchangeItem';
// import * as mainPageActions from '../actions/mainPageActions';
import mainPageActions from '../actions/MainPageActions.ts';

class MainPage extends React.Component implements BaseController
{
    constructor(props)
    {
        super();

        // ABpp.controllers.MainPage

        0||console.debug( 'this.props'  , props );
        // this.state = {data: props.mainPageData};
        props.actions.actionOnLoad();
    }


    componentDidMount()
    {
        // register global action
        ABpp.registerAction('MainPage.firstExchangeActivate', () => this.firstExchangeActivate());

        Waves.init();
	    Waves.attach('.wave:not([disabled])', ['waves-button']);
    }



    /**
     * activates first exchange left side
     * @public
     */
    firstExchangeActivate()
    {
        // 0||console.debug( 'firstExchangeActivate', this );
        this.props.actions.firstExchangeActivate();
    }



    render()
    {
        let isBasicMode = ABpp.User.settings.basicMode;
        let data = this.props.data;


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
                            {data.marketsData.map((item, key) =>
                                <ExchangeItem key={key} data={{...item, activeExchange: this.props.data.activeExchange}} actions={this.props.actions} />
                            )}
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
    data: state.mainPage,
    // test: state.Ttest,
}),
dispatch => ({
    // actions: bindActionCreators(actions, dispatch),
    actions: bindActionCreators(mainPageActions, dispatch),
})
)(MainPage)