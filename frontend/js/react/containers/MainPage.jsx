import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import ExchangeItem from '../components/MainPage/ExchangeItem';
import mainPageActions from '../actions/MainPageActions.ts';


// class MainPage extends React.Component
class MainPage extends BaseController
{
    constructor(props)
    {
        super(props);
        var self = this;

        __DEV__&&console.debug( 'this.props', props );

        props.actions.actionOnLoad();
    }


    /**
     * activates first exchange left side
     * @public
     */
    firstExchangeActivate()
    {
        this.props.actions.firstExchangeActivate(this);
    }



    /**
     * activates exchange click action
     * @public
     */
    exchangeSideClick(inProps)
    {
        this.props.actions.exchangeSideClick(inProps);
    }


    componentDidMount()
    {
        var self = this;

        // register global action
        ABpp.registerAction('MainPage.firstExchangeActivate', () => this.firstExchangeActivate());

        // subscribe on basic mode on/off
        /** @var ABpp ABpp */ ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_BASIC_MODE, function() {self.props.actions.OnOffBasicMode(ABpp.config.basicMode)});
        // subscribe on tader on/off
        ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_TRADER_ON, function() {self.props.actions.OnOffTraider(ABpp.config.tradeOn)});


        // Waves.init()
        // Waves.attach('.wave:not([disabled])', ['waves-button']);
    }


    render()
    {
        // let isBasicMode = ABpp.config.basicMode;
        let data = this.props.data;
        let {activeExchange, isBasicMode, isTraiderOn} = this.props.data;


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
                                <ExchangeItem key={key} data={{...item, activeExchange, isBasicMode, isTraiderOn}} actions={this.props.actions} />
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

export default connect(
    state => ({
        data: state.mainPage,
        // test: state.Ttest,
    }),
    dispatch => ({
        // actions: bindActionCreators(actions, dispatch),
        actions: bindActionCreators(mainPageActions, dispatch),
    })
)(MainPage)