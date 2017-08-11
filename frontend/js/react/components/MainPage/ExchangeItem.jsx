import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
import {LineupPage} from './LineupPage';
// import ChartOld from './ChartOld';
import ChartObj from '../../models/MainPage/Chart';
import Chart from '../MainPage/ChartEvent';
import DefaultOrdersLocal from '../DefaultOrdersLocal';
import classnames from 'classnames';
// import AnimateOnUpdate from '../Animation';
import CSSTransitionGroup from 'react-addons-css-transition-group';



// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
	constructor(props)
	{
		super(props);
		// __DEV__&&console.debug( 'ExchangeItem.props.data', this.props.data );

		// эмуляция времени игроков
		// this.data = gLineupPageData;

		this.state = {
			activeTab: [" active", ""],/* (this.data[props.data.Symbol.HomeName] && this.data[props.data.Symbol.AwayName] &&
			this.data[props.data.Symbol.HomeName].team && this.data[props.data.Symbol.AwayName].team) ?
				[" active", ""] : ["", " active"],*/
			chart    : null,
			isLPOpen : false,
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
		if (nextProps.data.currentExchange !== nextProps.data.Symbol.Exchange && this.state.isLPOpen && nextState.isLPOpen) {
			//chart socket unsubscribe
			if (nextProps.data.currentExchange !== nextProps.data.chartSubscribing) this._chartSubscribing(false);
			//close open lineup
			this._onLPOpenCloseClick(true);
		}
	}

	componentDidUpdate()
	{
		let currentProps = this.props;
		let currentState = this.state;

		if (currentProps.data.currentExchange === currentProps.data.Symbol.Exchange && currentState.activeTab[1] && currentState.isLPOpen) {
			// if(currentProps.chartData && !currentState.chart)
			// {
			// 	currentState.chart = new ChartOld(this.refs.chartContainer, currentProps.chartData);
			// 	this.setState(currentState);
			// 	// console.log('this.state.chart:', currentProps.data.Symbol.Exchange, currentState.chart);
			// }
			// else if(currentState.chart) currentState.chart.updateChart(currentProps.chartData);
			if (currentProps.chartData && !currentState.chart) {
				// currentState.chart = 1;
				currentState.chart = new ChartObj(this.refs.chartComponent.refs.ChartContainer, currentProps.chartData);
				this.setState(currentState);
				// console.log('this.state.chart:', currentProps.data.Symbol.Exchange, currentState.chart);
			}
			else if (currentState.chart) {
				// __DEV__&&console.warn( 'MainPage.Chart.setData listened', currentProps.chartData );
				currentState.chart.updateChart(currentProps.chartData);
			}
		}
		else if(currentState.chart) currentState.chart.stopGenerator()

	}


	render()
	{
		const {
			actions, disqusActions, chartData, data, data: {activeExchange, isBasicMode, isTraiderOn, Symbol, currentExchange, showOrder, orderPrice},
			mainContext, setCurrentExchangeFn, lineupsData, SymbolLimitData} = this.props;

		let {activeTab, chart, isLPOpen,} = this.state;
		// console.log('this.props:', this.props);
		// if(chart) console.log( 'chart', Symbol.Exchange, chart );
		const symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
		let $DateLocalization = new DateLocalization();
		let isExpertMode;
		let noTeamsClass, $homeTotal, $awayTotal, spreadTitle, spreadValue;//noTeamsWrappClass = "",

		// todo: check for no team hardcode
		// const $HomeTeamObj = this.data[Symbol.HomeName];
		// const $AwayTeamObj = this.data[Symbol.AwayName];
		// noTeamsClass = $HomeTeamObj && $AwayTeamObj && $HomeTeamObj.team && $AwayTeamObj.team ? "" : " hidden";
		if (noTeamsClass) {
			// noTeamsWrappClass = "no_lineups";
			activeTab = ['', " active"];
		}
		else if(lineupsData) {
			$homeTotal = lineupsData.HomeTotals.Score;
			$awayTotal = lineupsData.AwayTotals.Score;
			// 0||console.log( '$awayTotal', $awayTotal );
		} // endif

        //Game type
		let handicap = null;

		if(lineupsData) handicap = lineupsData.HomeTotals.EPPG - lineupsData.AwayTotals.EPPG;

		if (lineupsData && Symbol.OptionExchange === 2) {
			spreadTitle = 'Total Points';
			spreadValue = 'O/U ' + Math.round10(lineupsData.HomeTotals.EPPG + lineupsData.AwayTotals.EPPG, -2);
		}
		else if (lineupsData && Symbol.OptionExchange === 1) {
			let coefficient = Math.abs((Symbol.HomeHandicap || handicap) / lineupsData.HomeTotals.EPPG);
			spreadTitle = 'Moneyline';

			if (coefficient <= 0.05) spreadValue = `$0.70`;
			else if (coefficient <= 0.1) spreadValue = `$0.75`;
			else if (coefficient <= 0.15) spreadValue = `$0.80`;
			else if (coefficient <= 0.2) spreadValue = `$0.85`;
			else if (coefficient <= 0.25) spreadValue = `$0.90`;
			else spreadValue = `$0.95`;
		}
		else if(Symbol.OptionExchange === 0) {
			spreadTitle = 'Spread';
			spreadValue = Symbol.HomeHandicap || handicap;
		}


		// mode basic/expert ============== костыль на событии присустсвую 2 класс expert_mode basic_mode =============
		isExpertMode = currentExchange === data.Symbol.Exchange ||
			currentExchange === "" && isTraiderOn && activeExchange.name === data.Symbol.Exchange || !isBasicMode;
		const expModeClass = isExpertMode ? 'expert-mode' : '';


		// common props for button container
		let commProps = {
			orderPrice,
			showOrder,
			isTraiderOn: isTraiderOn,
			isBasicMode: isBasicMode,
			isExpertMode,
			symbolName : symbol,
			Orders     : data.Orders,
			exdata     : {
				HomeName      : data.Symbol.HomeName,
				AwayName      : data.Symbol.AwayName,
				Positions     : data.Positions,
				Exchange      : data.Symbol.Exchange,
				Name          : data.Symbol.Name,
				Currency      : data.Symbol.Currency,
				Bid           : data.Symbol.LastBid === 0 ? null : data.Symbol.LastBid,
				Ask           : data.Symbol.LastAsk === 1 ? null : data.Symbol.LastAsk,
				OptionExchange: Symbol.OptionExchange,
				StartDate     : Symbol.StartDate,
				EndDate       : Symbol.EndDate,
			}
		};

		const isEventClosed = Symbol.EndDate && moment().format('x') > (new DateLocalization).fromSharp(Symbol.EndDate, 1, {TZOffset: false}),//!!Symbol.EndDate && +moment().format('x') > (Symbol.EndDate).split('+')[0].slice(6);
			isEventStarted = +moment().format('x') > (new DateLocalization).fromSharp(Symbol.StartDate, 1, {TZOffset: false});

		//lineupContainer height
		let height;
		if (this.refs.lineupContainer) {
			height = $(this.refs.lineupContainer.refs.container).height();
			height = height > 495 ? height : 495;
		}
		else
		{
		    height = 495;
		}

		// activate current exchange global
		let $classActive = '', $classActiveNM = '', $classActiveM = '';
		if (data.activeExchange.name === data.Symbol.Exchange) {
			$classActive = 'active';
			// if( !data.activeExchange.isMirror ) $classActiveNM = ' active';
			// else $classActiveM = ' active';
		} // endif


		// activate local curr. exchange
		let $classActiveExch = "";
		// if( currentExchange === data.Symbol.Exchange ) $classActiveExch = ' active-exch'; // endif
		// console.log('currentExchange:', currentExchange);
		// console.log('data.Symbol.Exchange:', data.Symbol.Exchange);
		if (currentExchange === data.Symbol.Exchange || currentExchange === "" && isTraiderOn && activeExchange.name === data.Symbol.Exchange) $classActiveExch = 'active-exch'; // endif


		// exdata for lineup
		let date = $DateLocalization.fromSharp(Symbol.StartDate, 0, {TZOffset: false});

		const exdata = {
			HomeAlias: Symbol.HomeAlias,
			AwayAlias: Symbol.AwayAlias,
			StartDate: Symbol.StartDate ? date : null, // moment obj
		};

		let $lastPriceClass = data.Symbol.PriceChangeDirection === -1 ? ["down", "up"] : data.Symbol.PriceChangeDirection === 1 ? ["up", "down"] : ["", ""];

		//time and sales get data
		let ticks = [];
		if (chartData && chartData.Ticks.length)
		{
			let TSDate = null, TSCurrentDate = null, newTicks = chartData.Ticks.slice().reverse(), increment = 0;

			ticks = chartData.Ticks.slice().reverse();

			ticks.forEach((item, index) => {

				TSCurrentDate = (new DateLocalization()).unixToLocalDate({timestamp: item.Time, format: 'DD MMM Y', TZOffset: 1});

				if(TSCurrentDate !== TSDate)
				{
					newTicks.splice(index + increment, 0, {...item, virtual: true});
					TSDate = TSCurrentDate;
					increment += 1;
				}
			});

			ticks = newTicks;
		}


		/*
		 var exchangeSideClickFn = actions.exchangeSideClick.bind(null, {name: Symbol.Exchange,
		 isMirror: false,
		 title: [Symbol.HomeName, Symbol.AwayName],
		 symbol: symbol,
		 });
		 */
		// 0||console.log( 'exdata', this.data, Symbol.HomeName, thi7s.data[Symbol.HomeName] );

		return (
			<div className={classnames(`h-event categoryFilterJs animated fadeIn`, `${expModeClass}`, `${$classActive}`, `${$classActiveExch}`,
					{not_started: !isEventStarted}, {finished: isEventClosed}, {clickable: !!isTraiderOn}, {active_nearby: currentExchange && !expModeClass},
					{with_order: showOrder})} //+ (isBasicMode ? " basic_mode_js basic_mode" : "") ${noTeamsWrappClass}
				onClick={() => {
					// if(this.props.data.currentExchange !== this.props.data.Symbol.Exchange)
					// {
					setCurrentExchangeFn(Symbol.Exchange);

					disqusActions.getEventData({ url: data.CategoryUrl, identifier: data.Symbol.Exchange });
					//ABpp.config.tradeOn &&
					actions.exchangeSideClick({
						name     : Symbol.Exchange,
						isMirror : false,
						title    : [Symbol.HomeName, Symbol.AwayName],
						symbol   : symbol,
						startDate: Symbol.StartDate,
						endDate  : Symbol.EndDate,
					})

					// }
				}}
				id={symbol} data-js-hevent=""
			>
				{/*<input name={Symbol.Status} type="hidden" value="inprogress" />*/}

				<div className={"event-date " + data.CategoryIcon}>
                    <span className="date" title={'Start time of the game'}>
                        {date.unixToLocalDate({format: 'MM/DD/YYYY hh:mm A'}) ? date.unixToLocalDate({format: 'MM/DD/YYYY hh:mm A'}) : ''}
						{/*- {(date = $DateLocalization.fromSharp(Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'H:mm'})) ? date : ''}*/}
                    </span>
					{
						(!Symbol.EndDate || !isEventClosed)
						&& date.unixToLocalDate({format: 'x'}) < moment().format('x') &&
						<i className="live">Live</i>
					}
					{/*{ Symbol.StatusEvent === 'inprogress' && <i className="live">Live</i> }*/}
					{/*{ Symbol.StatusEvent === 'halftime' && <i className="halftime">Halftime</i> }*/}
				</div>

				<div className="event-symbols">
					<div className="h-symbol">
						<h3 className="l-title">{ do {
							let html = [
								<span key="0" data-js-title="" style={{paddingRight: 5}}><span className="score"
																							   style={{paddingRight: 5}}
																							   title="Score">
									<span className="title">Score</span>
                                    {/*{$homeTotal && $awayTotal &&  }*/}
                                    {$homeTotal !== undefined && $awayTotal !== undefined ?
                                        [<span key={1} className={spreadTitle === 'Spread' && +$homeTotal + spreadValue < $awayTotal ? 'low' : ''}>{$homeTotal}</span>,<span key={2}> : {$awayTotal}</span>]
                                        :
									    <span title="Not available">- : -</span>
                                    }
                                    </span>
									{/*{*/}
										{/*$classActiveExch ?*/}
											{/*<a href={ABpp.baseUrl + data.CategoryUrl + "0"} className="event_title"*/}
											   {/*title="See more">*/}
												{/*<span*/}
													{/*className="title">Market </span>{`${Symbol.HomeName} (vs. ${Symbol.AwayName})`}*/}
											{/*</a>*/}
											{/*:*/}
											<span className="event_title" title="Event title">
												<span
													className="title">Market </span>{`${Symbol.HomeName} (vs. ${Symbol.AwayName})`}
											</span>
									{/*}*/}
									</span>
								, (spreadValue !== null || (lineupsData && spreadTitle === 'Total Points')) ?
									<span key="1" className="handicap" style={{paddingRight: 5}} title={spreadTitle}>
										<span className="title">{spreadTitle}</span> {spreadValue}</span> : ''
								, data.Symbol.LastPrice && isEventStarted ?
									<span key="2" className={`last-price ${$lastPriceClass[0]}`}
										  title={'Last Price' + ($lastPriceClass[0] === 'up' ? ' increased' : 'decreased')}>
									<span className="title">Last Price </span><i>{}</i><span
										className="value">${data.Symbol.LastPrice.toFixed(2)}</span></span> : ''];

							<span className="seemore-lnk">{html}</span>
						}}
						</h3>

						<div className="l-buttons">
							<div className="inner animated dur4 mainButtonAnimate">
								{
									isEventClosed &&
									<div className="btn_locker animated dur4 fadeIn">Game is complete</div>
								}
								<ButtonContainer actions={actions} mainContext={mainContext} data={{
									type    : 'sell',
									side    : 0,
									ismirror: false,
									Orders  : data.Orders,
									...commProps
								}}/>
								<ButtonContainer actions={actions} mainContext={mainContext} data={{
									type      : 'buy',
									side      : 1,
									ismirror  : false,
									symbolName: symbol,
									Orders    : data.Orders,
									...commProps
								}}/>
							</div>
							<div className={`button-container opener`}>
								<div className={classnames(`button`, {order_open: showOrder})}>
									<button className={`event`} onClick={isEventStarted ? null : () => {
										this.props.actions.actionOnPosPriceClick(mainContext,
											{
												PosPrice: [],
												ismirror: false,
												price   : 0.5,
												quantity: 0,
												type    : 1,
												data    : {
													type      : 'buy',
													side      : 1,
													ismirror  : false,
													symbolName: symbol,
													Orders    : data.Orders,
													...commProps
												},
											});
									}}><i>{}</i><span>Enter</span></button>
								</div>
							</div>
						</div>
					</div>
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
						<strong style={data.Positions ? {transform: `translateY(0)`} : {}}>W/L:
							<span className={(data.GainLoss < 0 ? 'lose' : '') + (data.GainLoss > 0 ? 'win' : '')}>
                                        {data.GainLoss ?
											data.GainLoss < 0 ? ` ($${(Math.abs(data.GainLoss)).toFixed(2)})` : ' $' + (data.GainLoss).toFixed(2)
											:
											' $' + 0}
                                </span>
						</strong>
					</div>

					<div className={'pos mode_info_js' + (data.Positions ? ' active' : '')}>
						<strong style={data.Positions ? {transform: `translateY(0)`} : {}}>Units:
							<span>{data.Positions && data.Positions}</span></strong>
					</div>

					<div className={`lpnc_tabs ${isLPOpen ? "lpnc_tabs__opened" : ""}`}>
						<button className={`lpnc_tabs__tab lpnc_tabs__tab_1 ${noTeamsClass}` + activeTab[0]}
								title="Show teams info"
								onClick={this._onLPTabClick.bind(this, 0)}>Lineups
						</button>
						<button className={`lpnc_tabs__tab lpnc_tabs__tab_2 ${noTeamsClass}` + activeTab[1]}
								title="Show chart info"
								onClick={this._onLPTabClick.bind(this, 1)}>Chart
						</button>
					</div>
					<button ref="LPOpenBtn" className={'show-plnc' + (isLPOpen ? ' active' : '')} data-js-lineup=""
							title="Show chart"
							onClick={::this._onLPOpenCloseClick}>{}</button>
				</div>

				<div className="h-lup" data-js-hlup=""
					 style={isLPOpen ? {height: height, marginBottom: 10} : {height: 0}}>
					{/*
					 <div className={`tabs h-lup__tabs ${isLPOpen ? "h-lup__tabs__opened" : ""}`}>
					 <div className="h-lup__tab h-lup__tab_1 tab active" title="Show teams info" onClick={::this.onLPOpenClick}>Lineups</div>
					 <div className="h-lup__tab h-lup__tab_2 tab" title="Show chart info" onClick={::this.onLPOpenClick}>Chart</div>
					 </div>
					 */}
					<div className="h-lup__tab_content tab_content">
						{ !lineupsData ? <div className={"h-lup__tab_item h-lup__tab1_item tab_item empty" + activeTab[0]}><span>Lineups empty</span></div>
							: <LineupPage className={"h-lup__tab_item h-lup__tab1_item tab_item" + activeTab[0]}
										  exdata={exdata}
										  data={lineupsData} HomeName={Symbol.HomeName} AwayName={Symbol.AwayName}
										  ref="lineupContainer"/>
						}

						{/*<div className={"h-lup__tab_item tab_item highcharts-tab" + (chart ? '' : ' loading') + activeTab[1]}*/}
						{/*id={"container_" + symbol} data-js-highchart="" ref={'chartContainer'}>{}</div>*/}
						{/*<img src="~/Images/chart_white.svg" alt=""/>*/}
						<div className={"h-lup__tab_item tab_item" + (chart ? '' : ' loading') + activeTab[1]}>
							<div className="highcharts-tab">
								<Chart
									id={`${Symbol.Exchange}_${Symbol.Name}_${Symbol.Currency}`}
									chartData={this.state.chart}
									ref={'chartComponent'}
									chartTypeChange={::this.chartTypeChange}
								/>
								<div className="executed_orders">
									<table>
										<thead>
											<tr>
												<th>Time</th>
												<th>Price</th>
												<th>Unit</th>
											</tr>
										</thead>
									</table>
									{/*<h4>Time & Sales</h4>*/}
									<table className="body">
										<tbody>
										{
											chartData && ticks.length ?
												ticks.map((item, index) =>
												{
													let side = item.Side ? 'sell' : 'buy';

													return <CSSTransitionGroup
														component="tr"
														key={item.Time + index}//+ item.Open + item.Volume}
														transitionName={{
															enter : 'fadeColorOut',
															leave : 'fadeColorOut',
															appear: 'fadeColorOut'
														}}
														transitionAppear={true}
														transitionLeave={false}
														transitionAppearTimeout={600}
														transitionEnterTimeout={600}
														transitionLeaveTimeout={500}
													>
														<td>
															{
																item.virtual ?
																	<span>{(new DateLocalization()).unixToLocalDate({timestamp: item.Time, format: 'MMM DD Y', TZOffset: 1})}</span>
																	:
																	<span>{(new DateLocalization()).unixToLocalDate({timestamp: item.Time, format: 'hh:mm:ss A', TZOffset: 1})}</span>
															}
														</td>
														{!item.virtual && <td className={`price ${side} animated`}><span>${item.Open.toFixed(2)}</span></td>}
														{!item.virtual && <td className={`volume ${side} animated`}><span>{item.Volume}</span></td>}

													</CSSTransitionGroup>
												})
												:
												<tr><td className="center"><span>There are no data in this game</span></td></tr>
										}
										</tbody>
									</table>
								</div>
							</div>
						</div>

					</div>
				</div>

				{/* // BM: --------------------------------------------------- Default Orders Local ---*/}
				{
					$classActiveExch &&
					<DefaultOrdersLocal
						eventData={{
							ID             : `${Symbol.Exchange}_${Symbol.Name}_${Symbol.Currency}`,
							EventTitle     : Symbol.HomeName,
							Positions      : data.Positions,
							StartDate      : Symbol.StartDate,
							EndDate        : Symbol.EndDate,
							StartData      : Symbol.StartData,
							OptionExchange : Symbol.OptionExchange,
							minPrice       : spreadTitle === 'Moneyline' ? +(spreadValue.replace('$', '')) : 0.5,
							SymbolLimitData: SymbolLimitData,
							Symbol         : {
								Exchange: Symbol.Exchange,
								Name    : Symbol.Name,
								Currency: Symbol.Currency
							},
						}}
					/>
				}

				{/*<div className="bg" data-js-bg="" style={isLPOpen ? {bottom: -1 * (height + 40)} : {bottom: 0}}>{}</div>*/}

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

	chartTypeChange(event)
	{
		this.state.chart.setType(event.currentTarget.checked ? ChartObj.TYPE_AREASPLINE : ChartObj.TYPE_SPLINE);
		this.setState(this.state)
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
