import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
import {LineupPage} from './LineupPage';
import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    constructor(props)
    {
        super(props);
        // __DEV__&&console.debug( 'ExchangeItem.props.data', this.props.data );

        this.state = {isLPOpen: false, activeTab: [" active", ""]};

        // эмуляция времени игроков
        this.data = gLineupPageData;
    }


/*
    componentDidMount()
    {
        0||console.log( 'this.props.data.Symbol.Exchange', this.props.data.Symbol.Exchange );
        // var self = this;
        //
	    // $('[data-js-lineup]:not(.has-click)').click((ee) =>
	    // {
         //    // 0||console.log( 'this.props.data.Symbol.Exchange', this.props.data.Symbol.Exchange );
         //    if (!$(ee.target).hasClass('active') && $('[data-js-lineup].active').length) this.lineupOpen('[data-js-lineup].active', 1).bind(self);
         //    this.lineupOpen(ee.target);
	    // }).addClass('has-click');
    }
*/


    render()
    {
        const { actions, data, data:{ activeExchange, isBasicMode, isTraiderOn, Symbol, currentExchange }, mainContext, setCurrentExchangeFn } = this.props;
        const { isLPOpen, activeTab } = this.state;
        const symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
        let $DateLocalization = new DateLocalization();

        // common props for button container
        let commProps = {
            isTraiderOn: isTraiderOn,
            isBasicMode: isBasicMode,
            symbolName: symbol,
            Orders: data.Orders,
            exdata: {
                HomeName : data.Symbol.HomeName,
                AwayName : data.Symbol.AwayName,
                Positions : data.Positions,
                Exchange : data.Symbol.Exchange,
                Name : data.Symbol.Name,
                Currency : data.Symbol.Currency,
            }
        };

        // data.activeExchange.name == data.Symbol.Exchange&&console.debug( 'data.Symbol', data.activeExchange, data.Symbol.Exchange, data.activeExchange.name == data.Symbol.Exchange );
        // activate current exchange global
        let $classActive = '', $classActiveNM = '', $classActiveM = '', $classActiveExch;
        if( data.activeExchange.name === data.Symbol.Exchange )
        {
            $classActive = ' active';
            if( !data.activeExchange.isMirror ) $classActiveNM = ' active';
            else $classActiveM = ' active';
        } // endif


        // activate local curr. exchange
        if( currentExchange === data.Symbol.Exchange ) $classActiveExch = ' active-exch'; // endif


        // exdata for lineup
        var date = $DateLocalization.fromSharp(Symbol.StartDate, 0, {TZOffset: false});
        const exdata = {HomeAlias: Symbol.HomeAlias,
            AwayAlias: Symbol.AwayAlias,
            StartDate: Symbol.StartDate ? date : null, // moment obj
        };


        var exchangeSideClickFn = actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
                        isMirror: false,
                        title: [Symbol.HomeName, Symbol.AwayName],
                        symbol: symbol,
                    });


        return (
            <div className={"h-event categoryFilterJs" + (isBasicMode ? " basic_mode_js basic_mode" : "") + $classActive + $classActiveExch + (isTraiderOn ? " clickable" : "")} id={symbol} data-js-hevent="" onClick={() => setCurrentExchangeFn(Symbol.Exchange)}>
            {/*<input name={Symbol.Status} type="hidden" value="inprogress" />*/}

                <div className={"event-date " + data.CategoryIcon}>
                    <span className="date">
                        {(date = date.unixToLocalDate({format: 'DD MMM Y'})) ? date : ''}
                        {/*- {(date = $DateLocalization.fromSharp(Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'H:mm'})) ? date : ''}*/}
                    </span>
                </div>

                <div className="event-symbols">
                <div className="h-symbol">
                        <div className="l-title">
                            <a href={ABpp.baseUrl + data.CategoryUrl + "0"} title="see more">{Symbol.HomeName} {(Symbol.HomeHandicap !== null) ? <span>({(Symbol.HomeHandicap > 0 ? " +" : " ") + Symbol.HomeHandicap})</span> : '' }</a>
                        </div>

                        <div className="l-buttons">
                            <div className="inner">
                                <ButtonContainer actions={actions} mainContext={mainContext} data={{
                                    type: 'sell',
                                    side: 0,
                                    ismirror: false,
                                    Orders: data.Orders,
                                    ...commProps
                                }}/>
                                <ButtonContainer actions={actions} mainContext={mainContext} data={{
                                    type: 'buy',
                                    side: 1,
                                    ismirror: false,
                                    symbolName: symbol,
                                    Orders: data.Orders,
                                    ...commProps
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="h-symbol">
                        <div className="l-title">
                            <a href={ABpp.baseUrl + data.CategoryUrl + "1"} title="see more">{Symbol.AwayName} {(Symbol.AwayHandicap !== null) ? <span>({(Symbol.AwayHandicap > 0 ? " +" : " ") + Symbol.AwayHandicap})</span> : '' }</a>
                        </div>

                        <div className="l-buttons">
                            <div className="inner">
                                <ButtonContainer actions={actions} mainContext={mainContext} data={{
                                    type: 'sell',
                                    side: 1,
                                    ismirror: true,
                                    symbolName: symbol,
                                    Orders: data.Orders,
                                    ...commProps
                                }}/>

                                <ButtonContainer actions={actions} mainContext={mainContext} data={{
                                    type: 'buy',
                                    side: 0,
                                    ismirror: true,
                                    symbolName: symbol,
                                    Orders: data.Orders,
                                    ...commProps
                                }}/>
                            </div>
                        </div>
                    </div>

                    {/*<div className={"event-content" + $classActiveNM} data-symbol={symbol} data-id={Symbol.Exchange} data-mirror="0"
                        onClick={ABpp.config.tradeOn && actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
                            isMirror: false,
                            title: [Symbol.HomeName, Symbol.AwayName],
                            symbol: symbol,
                        })}
                    ></div>*/}
                </div>
                        <div className={'pl mode_info_js' + (data.Positions ? ' active' : '')}>
                            <strong style={data.Positions ? {transform: `translateY(0)`} : {}}>P/L:
                                <span className={(data.GainLoss < 0 ? 'lose' : '') + (data.GainLoss > 0 ? 'win' : '')}>
                                        {data.GainLoss ?
                                            data.GainLoss < 0 ? ` ($${Math.abs(data.GainLoss)})` :  ' $' + data.GainLoss
                                            :
                                            ' $' + 0}
                                </span>
                            </strong>
                        </div>

                        <div className={'pos mode_info_js' + (data.Positions ? ' active' : '')}>
                            <strong style={data.Positions ? {transform: `translateY(0)`} : {}}>Pos: <span>{data.Positions && data.Positions}</span></strong>
                        </div>

                        { Symbol.StatusEvent &&
                            <div className="event_info_bottom">
                                <span title="Event status">{Symbol.StatusEvent}</span>
                            </div>
                        }

                        <div className={`lpnc-loc ${isLPOpen ? "opened" : ""}`}>
                            <div className="loc1"></div>
                            <div className="loc2"></div>
                            <div className={`lpnc_tabs ${isLPOpen ? "lpnc_tabs__opened" : ""}`}>
                                <div className="lpnc_tabs__tab lpnc_tabs__tab_1 " title="Show teams info" onClick={this.onLPOpenClick.bind(this, 0)}>Lineups</div>
                                <div className="lpnc_tabs__tab lpnc_tabs__tab_2 " title="Show chart info" onClick={this.onLPOpenClick.bind(this, 1)}>Chart</div>
                            </div>
                            <button ref="LPOpenBtn" className="show-plnc" data-js-lineup="" title="Show chart" onClick={::this.onLPOpenCloseClick}>{}</button>
                        </div>

                        <div className="h-lup loader" data-js-hlup="">
{/*
                            <div className={`tabs h-lup__tabs ${isLPOpen ? "h-lup__tabs__opened" : ""}`}>
                                <div className="h-lup__tab h-lup__tab_1 tab active" title="Show teams info" onClick={::this.onLPOpenClick}>Lineups</div>
                                <div className="h-lup__tab h-lup__tab_2 tab" title="Show chart info" onClick={::this.onLPOpenClick}>Chart</div>
                            </div>
*/}
                            <div className="h-lup__tab_content tab_content">
                                <LineupPage className={"h-lup__tab_item tab_item" + activeTab[0]} exdata={exdata} data={this.data} />

                                <div className={"h-lup__tab_item tab_item highcharts-tab" + activeTab[1]} id={"container_" + symbol} data-js-highchart="">{}</div>
                                {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                            </div>
                        </div>
                        <div className="bg" data-js-bg="">{}</div>

                {/*
                 <div className="table not-sort wave waves-effect waves-button"> id="exchange_table"
                <div className={"event-content revers" + $classActiveM} data-symbol={symbol + "_mirror"} data-id={Symbol.Exchange} data-mirror="1"
                    onClick={ABpp.config.tradeOn && actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
                        isMirror: true,
                        title: [Symbol.HomeName, Symbol.AwayName],
                        symbol: symbol,
                    })}
                >
                    <h3 className="event-title">
                        <span className="title">{Symbol.AwayName}</span>
                        <span>{(Symbol.AwayHandicap !== null ? (Symbol.AwayHandicap > 0 ? " +" + Symbol.AwayHandicap : " " + Symbol.AwayHandicap) : "")}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "1"}>see more</a>
                    </h3>

                    <div className="container">

                    </div>
                </div>


            </div>
*/}
            </div>
        );
    }


    /**
     * @private
     */
    onLPOpenClick(index)
    {
        var activeTab = ["", ""];

        activeTab[index] = " active";

        var newStates = {...this.state, activeTab};
        this.setState(newStates);

        this.state.isLPOpen||this.onLPOpenCloseClick({newStates});
/*
        $(container).find('.wrapper .tab').click(function ()
        {
			let items = $(container).find('.tab_item');

			$(container).find('.wrapper .tab').removeClass("active").eq($(this).index()).addClass("active");

			itemsAnimation(items);
        }).eq(0).addClass("active");
*/
    }


    /**
     * @private
     */
    onLPOpenCloseClick({newStates})
    {
        this.setState({...this.state, ...newStates, isLPOpen: !this.state.isLPOpen});

        let target = this.refs.LPOpenBtn;
        if (!$(target).hasClass('active') && $('[data-js-lineup].active').length) this.lineupOpen('[data-js-lineup].active', 1);
        this.lineupOpen(target);
    }


    /**
     * show chart on the main page
     * @private
     * @param that - opener
     * @param isCLose Boolean - need if just close
     */
    lineupOpen(that, isCLose)
    {
        var $that = $(that);
        var $wrapper = $that.closest('[data-js-hevent]');
        var $lpnc = $wrapper.find('[data-js-hlup]');
        var $lpncBg = $wrapper.find('[data-js-bg]');

		$that.toggleClass('active');
					 // .next().toggleClass('active');
        $lpnc.toggleClass('active');
        // $lpncBg.toggleClass('active');

        // var $contentTitle = $that.closest('.h-event').find('.content_title');
		if ($that.hasClass('active'))
        {
            // set subscribe for chart data
            this.props.actions.actionSetChartsSymbol({exchange: this.props.data.Symbol.Exchange});


            let height = $wrapper.find("[data-js-team]").height();
            height = height > 400 ? height : 400;

            $lpncBg.css('bottom', -1 * (height + 40));
            $lpnc.css('height', height + 40);
            // $contentTitle.css('max-height', 'inherit');

            globalData.MainCharOn = true;
        }
		else
		{
            // set unsubscribe from chart data if close btn click
            if (!isCLose) this.props.actions.actionSetChartsSymbol({exchange: ""});

            $lpnc.removeAttr('style');
            $lpncBg.removeAttr('style');
			// setTimeout(() => { $contentTitle.removeAttr('style'); }, 400);

			globalData.MainCharOn = false;
		}

		// if($('[data-js-lineup]').hasClass('active'))
		// 	globalData.MainCharOn = true;
		// else
		// 	globalData.MainCharOn = false;
    }
}

// if( __DEV__ )
// {
//     ExchangeItem.propTypes = {
//         data: PropTypes.array.isRequired,
//         // actions: React.PropTypes.shape({
//         //     getPhotos: PropTypes.func.isRequired,
//         // }),
//     };
// } // endif
