import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
import {LineupPage} from './LineupPage';
// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    constructor(props)
    {
        super(props);
        // __DEV__&&console.debug( 'ExchangeItem.props.data', this.props.data );

        this.state = {isLPOpen: false};

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
        // let  = ABpp.config.basicMode;
        const { actions, data:{ activeExchange, isBasicMode, isTraiderOn }, mainContext  } = this.props;
        const data = this.props.data;
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
        // activate current exchange
        let $classActive = '', $classActiveNM = '', $classActiveM = '';
        if( data.activeExchange.name === data.Symbol.Exchange )
        {
            $classActive = ' active';
            if( !data.activeExchange.isMirror ) $classActiveNM = ' active';
            else $classActiveM = ' active';
        } // endif


        // exdata for lineup
        var date = $DateLocalization.fromSharp(data.Symbol.StartDate, 0, {TZOffset: false});
        const exdata = {HomeAlias: data.Symbol.HomeAlias,
            AwayAlias: data.Symbol.AwayAlias,
            StartDate: data.Symbol.StartDate ? date : null, // moment obj
        };


        return <div className={"content_bet not-sort categoryFilterJs" + (isBasicMode ? " basic_mode_js" : "") + $classActive + (isTraiderOn ? " clickable" : "")} id={symbol}>{/**/}{/*@(ViewBag.FilterId != null ? (Model.CategoryList.Contains(ViewBag.FilterId) ? 'display:flex;' : 'display:none;') : 'display:flex;')*/}
            <input name={data.Symbol.Status} type="hidden" value="inprogress" />

            <div className={"event_info " + data.CategoryIcon}>
                <span className="date">
                    {(date = date.unixToLocalDate({format: 'DD MMM Y'})) ? date : ''}
                    {/*- {(date = $DateLocalization.fromSharp(data.Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'H:mm'})) ? date : ''}*/}
                </span>
                {data.Symbol.Status === 2 ? <i className="half_time" title="Completed">ht<span>Completed</span></i> : ""}
            </div>
            <div className="content_title command">
                <h2>{data.Symbol.HomeName} {(data.Symbol.HomePoints !== null) ? <span>({data.Symbol.HomePoints})</span> : '' }</h2>
                <h2>{data.Symbol.AwayName} {(data.Symbol.AwayPoints !== null) ? <span>({data.Symbol.AwayPoints})</span> : ''}</h2>
                <span className="symbol_name hidden">{symbol}</span>
            </div>
            <div className="table not-sort wave waves-effect waves-button"> {/*id="exchange_table"*/}
                <div className={"event-content" + $classActiveNM} data-symbol={symbol} data-id={data.Symbol.Exchange} data-mirror="0"
                    onClick={() => {ABpp.config.tradeOn && actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: false,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                {/*<div className="event-content" data-symbol={symbol} onClick={this._onEventContentClick.bind(this, data)}>*/}
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.HomeName}</span>
                        <span>{(data.Symbol.HomeHandicap !== null ? (data.Symbol.HomeHandicap > 0 ? " +" + data.Symbol.HomeHandicap : " " + data.Symbol.HomeHandicap) : false)}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "0"}>see more</a>
                    </h3>

                    <div className="container">

                        <ButtonContainer actions={actions} mainContext={mainContext} data={{
                            type: 'sell',
                            side: 0,
                            ismirror: false,
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
                        <div className="pl mode_info_js">
                            {
                                function() {
                                    if( data.Positions )
                                    {
                                        let $class;
                                        if (data.GainLoss < 0) $class = 'lose';
                                        else if (data.GainLoss > 0) $class = 'win';

                                        return <strong style={{transform: `translateY(0)`}}>P/L: <span className={$class}>{data.GainLoss ?
											data.GainLoss < 0 ? `($${Math.abs(data.GainLoss)})` :  '$' + data.GainLoss
											:
                                            '$' + 0}</span></strong>;
                                    } // endif
                                }()
                            }
                        </div>
                    </div>
                </div>


                <div className={"event-content revers" + $classActiveM} data-symbol={symbol + "_mirror"} data-id={data.Symbol.Exchange} data-mirror="1"
                    onClick={() => {ABpp.config.tradeOn && actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: true,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.AwayName}</span>
                        <span>{(data.Symbol.AwayHandicap !== null ? (data.Symbol.AwayHandicap > 0 ? " +" + data.Symbol.AwayHandicap : " " + data.Symbol.AwayHandicap) : "")}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "1"}>see more</a>
                    </h3>

                    <div className="container">
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

                        <div className="pos mode_info_js">
                            <strong style={data.Positions ? {transform: `translateY(0)`} : {}}>Pos: <span>{data.Positions && data.Positions}</span></strong>
                        </div>
                    </div>
                </div>

                <button ref="LPOpenBtn" className="show-schedule" data-js-lineup="" title="Show chart" onClick={::this.onLPOpenCloseClick}>{}</button>
                <div className="h-lup schedule loader not-sort">
                    <div className={`tabs ${this.state.isLPOpen ? "h-lup__tabs__opened" : ""}`}>
                        <div className="h-lup__tab h-lup__tab_1 tab active" title="Show teams info" onClick={::this.onLPOpenClick}>Lineups</div>
                        <div className="h-lup__tab h-lup__tab_2 tab" title="Show chart info" onClick={::this.onLPOpenClick}>Chart</div>
                    </div>
                    <div className="h-lup__tab_content tab_content">
                        <LineupPage className="tab_item" exdata={exdata} data={this.data} />

                        <div className="tab_item highcharts-tab" id={"container_" + symbol} data-js-highchart="">{}</div>
                        {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                    </div>
                </div>
                <a href="#" className="add_favorite" title="Add to favorite">{}</a>
            </div>
        </div>;
    }


    /**
     * @private
     */
    onLPOpenClick()
    {
        this.state.isLPOpen||this.onLPOpenCloseClick();
    }


    /**
     * @private
     */
    onLPOpenCloseClick()
    {
        this.setState({...this.state, isLPOpen: !this.state.isLPOpen});

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

		$that.toggleClass('active')
					 .next().toggleClass('active');
		$that.closest('.table').toggleClass('active');

        var $contentTitle = $that.closest('.content_bet').find('.content_title');
		if ($that.hasClass('active'))
        {
            // set subscribe for chart data
            this.props.actions.actionSetChartsSymbol({exchange: this.props.data.Symbol.Exchange});


            let height = $that.next().find("[data-js-team]").height();
            height = height > 400 ? height : 400;

            $that.next().css('height', height + 40);
            $contentTitle.css('max-height', 'inherit');
        }
		else
		{
            // set unsubscribe from chart data if close btn click
            if (!isCLose) this.props.actions.actionSetChartsSymbol({exchange: ""});

            $that.next().removeAttr('style');
			setTimeout(() => { $contentTitle.removeAttr('style'); }, 400);
		}

		if($('[data-js-lineup]').hasClass('active'))
			globalData.MainCharOn = true;
		else
			globalData.MainCharOn = false;
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
