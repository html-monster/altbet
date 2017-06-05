import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
import {LineupPage} from './LineupPage';
import Chart from './Chart';
// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    constructor(props)
    {
        super(props);
        // __DEV__&&console.debug( 'ExchangeItem.props.data', this.props.data );

        // эмуляция времени игроков
        this.data = gLineupPageData;

        this.state = {
            activeTab: (this.data[props.data.Symbol.HomeName] && this.data[props.data.Symbol.AwayName] &&
                        this.data[props.data.Symbol.HomeName].team && this.data[props.data.Symbol.AwayName].team) ?
                [" active", ""] : ["", " active"],
			chart: null,
            isLPOpen: false,
        };
    }

    componentWillUpdate(nextProps, nextState)
    {
		// if(nextProps.data.currentExchange === nextProps.data.Symbol.Exchange && nextState.activeTab[1] && nextState.isLPOpen)
		// {
		// 	if(nextProps.chartData && !nextState.chart)
		// 	{
		// 		nextState.chart = new Chart(this.refs.chartContainer, nextProps.chartData);
		// 		console.log('this.state.chart:', nextProps.data.Symbol.Exchange, nextState.chart);
		// 	}
		// 	else if(nextState.chart) nextState.chart.updateChart(nextProps.chartData);
		// 	nextState.olol = 'ollol';
		// }

        // if not active -> close
        if(nextProps.data.currentExchange !== nextProps.data.Symbol.Exchange && this.state.isLPOpen && nextState.isLPOpen)
        {
            //chart socket unsubscribe
            if(nextProps.data.currentExchange !== nextProps.data.chartSubscribing) this._chartSubscribing(false);
            //close open lineup
            this._onLPOpenCloseClick(true);
        }
    }

    componentDidUpdate()
	{
		let currentProps = this.props;
		let currentState = this.state;

		if(currentProps.data.currentExchange === currentProps.data.Symbol.Exchange && currentState.activeTab[1] && currentState.isLPOpen)
		{
			if(currentProps.chartData && !currentState.chart)
			{
				currentState.chart = new Chart(this.refs.chartContainer, currentProps.chartData);
				this.setState(currentState);
				// console.log('this.state.chart:', currentProps.data.Symbol.Exchange, currentState.chart);
			}
			else if(currentState.chart) currentState.chart.updateChart(currentProps.chartData);
		}
	}


    render()
    {
        const { actions, chartData, data, data:{ activeExchange, isBasicMode, isTraiderOn, Symbol, currentExchange }, mainContext, setCurrentExchangeFn } = this.props;
        let { activeTab, chart, isLPOpen,  } = this.state;
        // console.log('this.props:', this.props);
        // if(chart) console.log( 'chart', Symbol.Exchange, chart );
        const symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
        let $DateLocalization = new DateLocalization();
        let isExpertMode;
        let noTeamsClass, $homeTotal, $awayTotal, spreadTitle, spreadValue ;//noTeamsWrappClass = "",

        // todo: check for no team hardcode
        const $HomeTeamObj = this.data[Symbol.HomeName];
        const $AwayTeamObj = this.data[Symbol.AwayName];
        noTeamsClass = $HomeTeamObj && $AwayTeamObj && $HomeTeamObj.team && $AwayTeamObj.team ? "" : " hidden";
        if( noTeamsClass )
        {
            // noTeamsWrappClass = "no_lineups";
            activeTab = ['', " active"];
        }
        else {
            $homeTotal = $HomeTeamObj.Totals.score;
            $awayTotal = $AwayTeamObj.Totals.score;
            // 0||console.log( '$awayTotal', $awayTotal );
        } // endif

		if(Symbol.ResultExchange === 'OU')
		{
			spreadTitle = 'Total Points';
			spreadValue = 'O/U ' + Math.round10(+$HomeTeamObj.Totals.eppg + +$AwayTeamObj.Totals.eppg, -2);
		}
		else if(Symbol.ResultExchange === 'ML')
		{
			let coefficient = Math.abs(Symbol.HomeHandicap / $HomeTeamObj.Totals.eppg);
			spreadTitle = 'Moneyline';

			if(coefficient <= 0.1) spreadValue = `$0.55/$0.45`;
			else if(coefficient <= 0.15) spreadValue = `$0.65/$0.35`;
			else if(coefficient <= 0.2) spreadValue = `$0.75/$0.25`;
			else if(coefficient <= 0.25) spreadValue = `$0.80/$0.20`;
			else spreadValue = `$0.90/$0.10`;
		}
		else {
        	spreadTitle = 'Spread';
        	spreadValue = Symbol.HomeHandicap;
		}


        // mode basic/expert ============== костыль на событии присустсвую 2 класс expert_mode basic_mode =============
        isExpertMode = currentExchange === data.Symbol.Exchange ||
            currentExchange === "" && isTraiderOn && activeExchange.name === data.Symbol.Exchange || !isBasicMode;
        const expModeClass = isExpertMode ? 'expert-mode' : '';


        // common props for button container
        let commProps = {
            isTraiderOn: isTraiderOn,
            isBasicMode: isBasicMode,
            isExpertMode,
            symbolName: symbol,
            Orders: data.Orders,
            exdata: {
                HomeName : data.Symbol.HomeName,
                AwayName : data.Symbol.AwayName,
                Positions : data.Positions,
                Exchange : data.Symbol.Exchange,
                Name : data.Symbol.Name,
                Currency : data.Symbol.Currency,
				Bid : data.Symbol.LastBid === 0 ? null : data.Symbol.LastBid,
				Ask : data.Symbol.LastAsk === 1 ? null : data.Symbol.LastAsk ,
            }
        };

        //lineupContainer height
		let height;
		if(this.refs.lineupContainer)
        {
			height = $(this.refs.lineupContainer.refs.container).height();
			height = height > 400 ? height : 400;
        }
        else
        {
            height = 400;
        }

        // activate current exchange global
        let $classActive = '', $classActiveNM = '', $classActiveM = '';
        if( data.activeExchange.name === data.Symbol.Exchange )
        {
            $classActive = ' active';
            // if( !data.activeExchange.isMirror ) $classActiveNM = ' active';
            // else $classActiveM = ' active';
        } // endif


        // activate local curr. exchange
        let $classActiveExch = "";
        // if( currentExchange === data.Symbol.Exchange ) $classActiveExch = ' active-exch'; // endif
        // console.log('currentExchange:', currentExchange);
        // console.log('data.Symbol.Exchange:', data.Symbol.Exchange);
        if( currentExchange === data.Symbol.Exchange || currentExchange === "" && isTraiderOn && activeExchange.name === data.Symbol.Exchange ) $classActiveExch = ' active-exch'; // endif


        // exdata for lineup
        let date = $DateLocalization.fromSharp(Symbol.StartDate, 0, {TZOffset: false});
        const exdata = {HomeAlias: Symbol.HomeAlias,
            AwayAlias: Symbol.AwayAlias,
            StartDate: Symbol.StartDate ? date : null, // moment obj
        };


        let $lastPriceClass = data.Symbol.PriceChangeDirection === -1 ? ["down", "up"] : data.Symbol.PriceChangeDirection === 1 ? ["up", "down"] : ["", ""];
/*
        var exchangeSideClickFn = actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
                        isMirror: false,
                        title: [Symbol.HomeName, Symbol.AwayName],
                        symbol: symbol,
                    });
*/
        // 0||console.log( 'exdata', this.data, Symbol.HomeName, this.data[Symbol.HomeName] );

        return (
            <div className={`h-event categoryFilterJs animated fadeIn ${expModeClass}` + $classActive + $classActiveExch + (isTraiderOn ? " clickable" : "") +
			(currentExchange && !expModeClass ? ' active_nearby' : '')} //+ (isBasicMode ? " basic_mode_js basic_mode" : "") ${noTeamsWrappClass}
                onClick={() =>
                {
                	// if(this.props.data.currentExchange !== this.props.data.Symbol.Exchange)
					// {
						setCurrentExchangeFn(Symbol.Exchange);

						//ABpp.config.tradeOn &&
						actions.exchangeSideClick({name: Symbol.Exchange,
							isMirror: false,
							title: [Symbol.HomeName, Symbol.AwayName],
							symbol: symbol,
						})

					// }
                }}
                id={symbol} data-js-hevent="" style={$homeTotal ? {} : {display: 'none'}}
            >
            {/*<input name={Symbol.Status} type="hidden" value="inprogress" />*/}

                <div className={"event-date " + data.CategoryIcon}>
                    <span className="date" title={Symbol.Exchange}>
                        {(date = date.unixToLocalDate({format: 'DD MMM Y h:mm A'})) ? date : ''}
                        {/*- {(date = $DateLocalization.fromSharp(Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'H:mm'})) ? date : ''}*/}
                    </span>
                </div>

                <div className="event-symbols">
                <div className="h-symbol">
                        <h3 className="l-title">{ do {

                            let html = [
									<span key="0" data-js-title="" style={{paddingRight: 5}}><span className="score" style={{paddingRight: 5}} title="Score">
									<span className="title">Score</span>{$homeTotal} : {$awayTotal} </span>
									{
										$classActiveExch ?
											<a href={ABpp.baseUrl + data.CategoryUrl + "0"}  className="event_title" title="See more">
												<span className="title">Market </span>{`${Symbol.HomeName} (vs. ${Symbol.AwayName})`}
											</a>
											:
											<span className="event_title" title="Event title">
												<span className="title">Market </span>{`${Symbol.HomeName} (vs. ${Symbol.AwayName})`}
											</span>
									}
									</span>
                                    , (Symbol.HomeHandicap !== null) ? <span key="1" className="handicap" style={{paddingRight: 5}} title={spreadTitle}>
										<span className="title">{spreadTitle}</span> {spreadValue}</span> : ''
                                    , data.Symbol.LastPrice ? <span key="2" className={`last-price ${$lastPriceClass[0]}`}
																	title={'Last Price' + ($lastPriceClass[0] === 'up' ? ' increased' : 'decreased')}>
									<span className="title">Last price </span><i>{}</i><span className="value">${data.Symbol.LastPrice.toFixed(2)}</span></span> : ''];

                            	<span className="seemore-lnk">{html}</span>
                            }}
                        </h3>

                        <div className="l-buttons">
                                <div className="inner animated dur4 mainButtonAnimate">
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
                                <div className={`button-container opener`}>
                                    <div className="button">
                                        <button className={`event`}><i>{}</i>Enter</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                    {/*<div className="h-symbol">*/}
                        {/*<h3 className="l-title">{ do {*/}
                                {/*let html = [<span key="0" data-js-title><span className="score">{$awayTotal}&nbsp;&nbsp;</span> {Symbol.AwayName}</span>*/}
                                    {/*, (Symbol.AwayHandicap !== null) ? <span key="1">&nbsp;&nbsp;{(Symbol.AwayHandicap > 0 ? " +" : " ") + Symbol.AwayHandicap}</span> : ''*/}
                                    {/*, data.Symbol.LastPrice ? <span key="2" className={`last-price ${$lastPriceClass[1]}`}>&nbsp;&nbsp;<i>{}</i>${(1 - data.Symbol.LastPrice).toFixed(2)}</span> : ""];*/}
							{/*$classActiveExch ? <a href={ABpp.baseUrl + data.CategoryUrl + "1"} className="seemore-lnk" title="see more">{html}</a>*/}
                                {/*: <span className="seemore-lnk">{html}</span>*/}
                            {/*}}*/}
                        {/*</h3>*/}

                        {/*<div className="l-buttons">*/}
                            {/*<div className="inner">*/}
                                {/*<ButtonContainer actions={actions} mainContext={mainContext} data={{*/}
                                    {/*type: 'sell',*/}
                                    {/*side: 1,*/}
                                    {/*ismirror: true,*/}
                                    {/*symbolName: symbol,*/}
                                    {/*Orders: data.Orders,*/}
                                    {/*...commProps*/}
                                {/*}}/>*/}

                                {/*<ButtonContainer actions={actions} mainContext={mainContext} data={{*/}
                                    {/*type: 'buy',*/}
                                    {/*side: 0,*/}
                                    {/*ismirror: true,*/}
                                    {/*symbolName: symbol,*/}
                                    {/*Orders: data.Orders,*/}
                                    {/*...commProps*/}
                                {/*}}/>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className={"event-content" + $classActiveNM} data-symbol={symbol} data-id={Symbol.Exchange} data-mirror="0"
                        onClick={ABpp.config.tradeOn && actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
                            isMirror: false,
                            title: [Symbol.HomeName, Symbol.AwayName],
                            symbol: symbol,
                        })}
                    ></div>*/}
                </div>
                        { Symbol.StatusEvent &&
                            <div className="event_info_bottom">
                                <span title="Event status">{Symbol.StatusEvent}</span>
                            </div>
                        }

                        <div className={`lpnc-loc ${isLPOpen ? "opened" : ""}`}>
                            {/*<div className="loc1">{}</div>*/}
                            {/*<div className="loc2">{}</div>*/}
							<div className={'pl mode_info_js' + (data.Positions ? ' active' : '')}>
								<strong style={data.Positions ? {transform: `translateY(0)`} : {}}>P/L:
									<span className={(data.GainLoss < 0 ? 'lose' : '') + (data.GainLoss > 0 ? 'win' : '')}>
                                        {data.GainLoss ?
											data.GainLoss < 0 ? ` ($${(Math.abs(data.GainLoss)).toFixed(2)})` :  ' $' + (data.GainLoss).toFixed(2)
											:
											' $' + 0}
                                </span>
								</strong>
							</div>

							<div className={'pos mode_info_js' + (data.Positions ? ' active' : '')}>
								<strong style={data.Positions ? {transform: `translateY(0)`} : {}}>Pos: <span>{data.Positions && data.Positions}</span></strong>
							</div>

                            <div className={`lpnc_tabs ${isLPOpen ? "lpnc_tabs__opened" : ""}`}>
                                <button className={`lpnc_tabs__tab lpnc_tabs__tab_1 ${noTeamsClass}` + activeTab[0]} title="Show teams info"
                                     onClick={this._onLPTabClick.bind(this, 0)}>Lineups</button>
                                <button className={`lpnc_tabs__tab lpnc_tabs__tab_2 ${noTeamsClass}` + activeTab[1]} title="Show chart info"
                                     onClick={this._onLPTabClick.bind(this, 1)}>Chart</button>
                            </div>
                            <button ref="LPOpenBtn" className={'show-plnc' + (isLPOpen ? ' active' : '')} data-js-lineup="" title="Show chart"
                                    onClick={::this._onLPOpenCloseClick}>{}</button>
                        </div>

                        <div className="h-lup" data-js-hlup="" style={isLPOpen ? {height: height + 30} : {height: 0}}>
{/*
                            <div className={`tabs h-lup__tabs ${isLPOpen ? "h-lup__tabs__opened" : ""}`}>
                                <div className="h-lup__tab h-lup__tab_1 tab active" title="Show teams info" onClick={::this.onLPOpenClick}>Lineups</div>
                                <div className="h-lup__tab h-lup__tab_2 tab" title="Show chart info" onClick={::this.onLPOpenClick}>Chart</div>
                            </div>
*/}
                            <div className="h-lup__tab_content tab_content">
                                { noTeamsClass ? <div className="h-lup__tab_item tab_item">{}</div>
                                    : <LineupPage className={"h-lup__tab_item h-lup__tab1_item tab_item" + activeTab[0]} exdata={exdata}
                                                  data={this.data} HomeName={Symbol.HomeName} AwayName={Symbol.AwayName}
                                                  ref="lineupContainer"/>
                                }

                                <div className={"h-lup__tab_item tab_item highcharts-tab" + (chart ? '' : ' loading') + activeTab[1]}
									 id={"container_" + symbol} data-js-highchart="" ref={'chartContainer'}>{}</div>
                                {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                            </div>
                        </div>
                        <div className="bg" data-js-bg="" style={isLPOpen ? {bottom: -1 * (height + 40)} : {bottom: 0}}>{}</div>

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
     * On lineup or chart tab click
	 * @param index number - index of active tab
	 * @private
	 */
	_onLPTabClick(index)
    {
        let activeTab = ["", ""];

        activeTab[index] = " active";

        let newStates = {...this.state, isLPOpen: true, activeTab};
        this.setState(newStates);

        this._chartSubscribing(index);
        // this.state.isLPOpen||this._onLPOpenCloseClick({newStates});
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
     * On open/close lineup btn click
	 * @param close boolean - use if you need close the tab
	 * @private
	 */
	_onLPOpenCloseClick(close)
    {
		const { data:{ chartSubscribing } } = this.props;

		close = typeof close === 'boolean' && close;

        let isLPOpen = this.state.isLPOpen;
        this.setState({...this.state, isLPOpen: close ? false : !isLPOpen});

		if(!close)
        {
            if(isLPOpen || this.state.activeTab[0])
            {
				if(chartSubscribing) this._chartSubscribing(false);
            }
            else
            {
				this._chartSubscribing(true);
            }
        }

        // let target = this.refs.LPOpenBtn;
        // if (!$(target).hasClass('active') && $('[data-js-lineup].active').length) this._lineupOpen('[data-js-lineup].active', 1);
        // this._lineupOpen(target);
    }

	/**
     * chart socket subscribing
	 * @param subscribe boolean
	 * @private
	 */
	_chartSubscribing(subscribe)
    {
		if(subscribe)
		{
			this.props.actions.actionSetChartsSymbol({exchange: this.props.data.Symbol.Exchange});

			// for( let val of mainChartController.charts  )
			// {
			// 	if(val.renderTo.id === this.refs.chartContainer.id)
			// 	{
			// 		let containerWidth = $(this.refs.chartContainer).width();
			// 		let chart = $(val.container);
			//
			// 		if(chart.width() > containerWidth) setTimeout(() => val.reflow(), 400);
			//
			//
			// 		// 0||console.log( 'val.renderTo.id', val.renderTo.id );
			// 		// setTimeout(() => val.reflow(), 2000);
			// 	}
			// } // endfor
		}
		else
		{
			this.props.actions.actionSetChartsSymbol({exchange: ""})
		}
    }


    /**
     * Just close lineup
     * @private
     */
    _lupClose()
    {
        // this.setState({...this.state, isLPOpen: false});
		//
        // let target = this.refs.LPOpenBtn;
        // this._lineupOpen(target, 1);
    }


    /**
     * show chart on the main page
     * @private
     * @param that - opener
     * @param isCLose Boolean - need if just close
     */
    _lineupOpen(that, isCLose)
    {
        // console.log('that:', that);
        let $that = $(that);
        if (!$that.length) return;

        let $wrapper = $that.closest('[data-js-hevent]');
        let $lpnc = $wrapper.find('[data-js-hlup]');
        let $lpncBg = $wrapper.find('[data-js-bg]');
        // let $chartWrp = $wrapper.find('[data-js-highchart]');

		$that.toggleClass('active');
        $lpnc.toggleClass('active');

        if( isCLose )
        {
            $that.removeClass('active');
            $lpnc.removeClass('active');
        } // endif


        // var $contentTitle = $that.closest('.h-event').find('.content_title');
		if (!isCLose && $that.hasClass('active'))
        {
            // set subscribe for chart data
            this.props.actions.actionSetChartsSymbol({exchange: this.props.data.Symbol.Exchange});
            globalData.MainCharOn = true;


            let height = $wrapper.find("[data-js-team]").height();
            height = height > 400 ? height : 400;

            $lpncBg.css('bottom', -1 * (height + 40));
            $lpnc.css('height', height + 30);
            // $contentTitle.css('max-height', 'inherit');
            // console.log('55:', 55);
        }
		else
		{
		    // console.log('666:', 666);
            // set unsubscribe from chart data if close btn click
            if (!isCLose) this.props.actions.actionSetChartsSymbol({exchange: ""});
			globalData.MainCharOn = false;

            $lpnc.removeAttr('style');
            $lpncBg.removeAttr('style');
			// setTimeout(() => { $contentTitle.removeAttr('style'); }, 400);

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
