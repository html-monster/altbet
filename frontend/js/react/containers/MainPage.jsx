import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import ExchangeItem from '../components/MainPage/ExchangeItem';
import mainPageActions from '../actions/MainPageActions.ts';
import * as defaultOrderActions from '../actions/Sidebar/tradeSlip/defaultOrderActions';

// class MainPage extends React.Component
class MainPage extends BaseController
{
    constructor(props)
    {
        super(props);
        var self = this;

        __DEV__&&console.debug( 'this.props', props );

        props.actions.actionOnLoad();

        this.state = {loaded: ""};
    }


    /**
     * activates last exchange left side
     * @public
     */
    lastExchangeActivate()
    {
        this.props.actions.lastExchangeActivate(this);
    }



    /**
     * activates exchange click action
     * @public
     */
    // exchangeSideClick(inProps)
    // {
    //     this.props.actions.exchangeSideClick(inProps);
    // }


    // /**
    //  * get current exchange
    //  * @public
    //  */
    // getExchange()
    // {
    //     0||console.log( 'getExchange this.props', this.props );
    // }


    componentDidMount()
    {
        var self = this;

        // register global action
        // ABpp.registerAction('MainPage.getExchange', () => this.getExchange());

        // subscribe on tader on/off
        /** @var ABpp ABpp */ ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_BASIC_MODE, function() {self.props.actions.OnOffBasicMode(ABpp.config.basicMode)});
        ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_TRADER_ON, function() {self.props.actions.actionOnTraiderOnChanged(ABpp.config.tradeOn, self)});
        ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, function(props) {self.props.actions.actionOnActiveSymbolChanged(props, self)});


        setTimeout(() => {
            this._itemsAnimation('.nav_items', '.content_bet');
            // $(this.refs.wrapper).addClass('loaded');
            this.setState({loaded: "loaded"});
        }, 1000);

        // Waves.init();
        // Waves.attach('.wave:not([disabled])', ['waves-button']);
    }


    render()
    {
        // let isBasicMode = ABpp.config.basicMode;
        const data = this.props.data;
        const { actions, data:{ activeExchange, isBasicMode, isTraiderOn } } = this.props;
        let $Pagination;
        if( appData.pageHomeData ) $Pagination = appData.pageHomeData.Pagination;
        let urlBase = appData.baseUrl.MainPage;
        // let nb = "&nbsp;";


        // sort tabs data
        const currSort = appData.urlQuery.sortType;
        const $tabs = {closingsoon: 'Closing soon', popular: 'Popular', new: 'New', movers: 'Movers'};


        return (
            <div ref="wrapper" className={`nav_items ${this.state.loaded}`}>
                <div className="wrapper" id="exchange">
                    <div className="stattabs">
                        {
                            Object.keys($tabs).map((val, key) => <a href={"?sort=" + val} key={val} className={"stab" + (val == currSort || !currSort && !key ? " active" : '')}><span data-content={$tabs[val]}>{}</span></a>)
                        }
                        {/*<span className="stab"><a href="?sort=closingsoon"><span data-content="Closing soon">{}</span></a></span>
                        <span className="stab"><a href="?sort=popular"><span data-content="Popular">{}</span></a></span>
                        <span className="stab"><span data-content="Trending"></span></span>
                        <span className="stab"><a href="?sort=new"><span data-content="New">{}</span></a></span>
                        <span className="stab"><a href="?sort=movers"><span data-content="Movers">{}</span></a></span>*/}
                        <div className="mode_wrapper">
                            <label className="mode_switch">
                                <input defaultChecked={!isBasicMode} id="Mode" name="Mode" type="checkbox" />
                                <input name="Mode" type="hidden" defaultValue={!isBasicMode} />
                                { isBasicMode ? <span>Basic Mode</span> : <span>Expert Mode</span> }
                            </label>
                        </div>
                    </div>
                    <div className="tab_content">
                        <div className="tab_item">
                            <div className="mp-exchanges">
                                {data.marketsData.map((item, key) =>
                                    <ExchangeItem key={key} data={{...item, activeExchange, isBasicMode, isTraiderOn}} mainContext={this} actions={actions}/>
                                )}
                            </div>
                            { $Pagination && $Pagination.LastPage > 1 &&
                                <div className="pagination">
                                    <ul className="pagination_list">
                                        {$Pagination.Pages.map((item, key) => {
                                            return <li key={key} className={(item.Disabled ? "disabled " : "") + (item.IsCurrenPage ? "active" : "")}>
                                                <a  href={urlBase + `/${item.RouteValues.action[0] == '/' ?
                                                        item.RouteValues.action.slice(1)
                                                        :
                                                        item.RouteValues.action}?page=${item.RouteValues.Page}` + (currSort ? "&sort=" + currSort : '')}
                                                    dangerouslySetInnerHTML={{__html: item.Caption}}>{}</a>
                                            </li>
                                        })}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
        // return <Chart data={this.props.MainPage} actions={this.props.chartActions} />
    }


    _itemsAnimation(inWrapper, inAnimatedRow)
    {
        let ii = 1;
        inWrapper = $(inWrapper);

        inWrapper.find(inAnimatedRow).css('display', 'none'); //'.content_bet'
        // items.hide().eq($(this).index()).show().find(animated_row).each(function(){
        inWrapper.show().find(inAnimatedRow).each(function(){
            $(this).addClass('list-animate2');
            setInterval(() => {
                $(this).addClass('animate2'); // /*.delay(100 * ii)*/.animate({}, 1500, function() { $(this).addClass('animate2') });
            }, 100 * ii);
            ii++;
            // .css({display: 'flex', opacity: 0, marginTop: '10px'}).animate({
            //     opacity: '1',
            //     marginTop: '2px'
            // }, 300);
        });
        ii = 1;
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(
    state => {
        return ({
        data: state.mainPage,
        // test: state.Ttest,
    })
    },
    dispatch => ({
		defaultOrderActions: bindActionCreators(defaultOrderActions, dispatch),
        actions: bindActionCreators(mainPageActions, dispatch),
    })
)(MainPage)