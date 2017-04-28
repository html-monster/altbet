import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from './BaseController';
import Chart from '../components/EventPage/Chart';
import {BetsTable} from '../components/EventPage/BetsTable';
import * as chartActions from '../actions/EventPage/chartActions.ts';
import * as defaultOrderActions from '../actions/Sidebar/tradeSlip/defaultOrderActions';
import traderActions from '../actions/Sidebar/tradeSlip/traderActions';
import eventPageActions from '../actions/eventPageActions.ts';


class EventPage extends BaseController
{
    constructor(props)
    {
        super(props);

        // ABpp.controllers.EventPage

        // this.state = {data: props.data};
        __DEV__&&console.debug( 'this.props', props );

        this.actions = props.eventPageActions;
    }


    componentWillMount()
    {
        let symbol = appData.pageEventData.SymbolsAndOrders.Symbol;
        let exchange = symbol.Exchange;
        symbol = `${symbol.Exchange}_${symbol.Name}_${symbol.Currency}`;
        this.actions.actionOnLoad({exchange, symbol});
    }



    componentDidMount()
    {
        // register global action
        // ABpp.registerAction('EventPage.activeTraiderActivate', () => this.activeTraiderActivate());

        // subscribe on tader on/off
        /** @var ABpp ABpp */ ABpp.SysEvents.subscribe(this, ABpp.SysEvents.EVENT_TURN_TRADER_ON, () => this._activeTraiderActivate());
        let data = ABpp.SysEvents.getLastNotifyData(ABpp.SysEvents.EVENT_TURN_TRADER_ON);
        data && this._activeTraiderActivate();


		// BetsTable tabularMarking
        let executedOrders = $('.wrapper_event_page .executed_orders');

        executedOrders.on('mouseenter', 'td.volume.clickable', function () {
            $(this).parents('.executed_orders').find('tr').removeClass('active');
            for(let ii = 0; ii <= $(this).parent().index(); ii++){
                $(this).parents('.executed_orders').find('tr').eq(ii).addClass('active');
            }
        });
        executedOrders.on('mouseleave', 'td.clickable', function () {
            $(this).parents('.executed_orders').find('tr').removeClass('active');
        });


        /**
        *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
        *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
        (function() { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = '//altbet.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    }



    /**
     * activates first exchange left side
     * @private
     */
    _activeTraiderActivate()
    {
        // 0||console.debug( 'firstExchangeActivate', this );
        this.props.eventPageActions.activeTraiderActivate(this.props.eventPage.pageEventData);
    }



    render()
    {
        const { defaultOrderActions, eventPage: { pageEventData: data, socket, isTraiderOn }, traderActions } = this.props;
		const symbol = `${data.SymbolsAndOrders.Symbol.Exchange}_${data.SymbolsAndOrders.Symbol.Name}_${data.SymbolsAndOrders.Symbol.Currency}`;
        let isMirror = data.IsMirror;

        let buyIndex = 0;
        let sellIndex = 1;
        let bidData = [];
        let askData = [];
        let ticks = [];
        let StatusEvent = data.SymbolsAndOrders.Symbol.StatusEvent;

        // form ask and bid orders
// 0||console.debug( 'socket', socket );
        if( socket.activeOrders && socket.activeOrders.Orders )
        {
            if( socket.activeOrders.Orders[0].Side === 1 )
            {
                buyIndex = 1;
                sellIndex = 0;
            } // endif
            if (socket.activeOrders.Orders[buyIndex]) bidData = socket.activeOrders.Orders[buyIndex].SummaryPositionPrice;
            if (socket.activeOrders.Orders[sellIndex]) askData = socket.activeOrders.Orders[sellIndex].SummaryPositionPrice;
            StatusEvent = socket.activeOrders.Symbol.StatusEvent;
        } // endif
            // if (appData.pageEventData.IsMirror && side == 'sell') data.SummaryPositionPrice.reverse();
            // if (!appData.pageEventData.IsMirror && side == 'buy') data.SummaryPositionPrice.reverse();

// 0||console.debug( 'socket', socket, bidData, askData, ticks );

        // form tick html and High/Low prices
        let maxPrice = 0, minPrice = 100, lastPrice;
        if (socket.bars && socket.bars.Ticks.length)
        {
            ticks = socket.bars.Ticks.slice().reverse();
            lastPrice = " " + ticks[0].Open;
        }
        let ticksHmtl = ticks.map((item, key) => {
                let date = new Date(item.Time.replace('/Date(', '').replace(')/', '') * 1);
                date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() +
                    ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
                    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

                let side = isMirror ? !item.Side : item.Side;
                side = side ? 'sell' : 'buy';

                let price = ((isMirror) ? (1 - item.Open).toFixed(2) : item.Open.toFixed(2));

                if (price > maxPrice) maxPrice = price;
                if (price < minPrice) minPrice = price;
                // 0||console.debug( 'price, minPrice', price, minPrice );

                return <tr key={key}><td><span>{date}</span></td><td className={`price ${side}`}><span>${price}</span></td><td className={`volume ${side}`}><span>{item.Volume}</span></td></tr>
            });


        let commProps = {
            isMirror: data.IsMirror,
            // symbolName: symbol,
            // Orders: data.Orders,
            HomeName : data.SymbolsAndOrders.Symbol.HomeName,
            AwayName : data.SymbolsAndOrders.Symbol.AwayName,
            Positions : data.SymbolsAndOrders.Positions,
            Exchange : data.SymbolsAndOrders.Symbol.Exchange,
            Name : data.SymbolsAndOrders.Symbol.Name,
            Currency : data.SymbolsAndOrders.Symbol.Currency,
        };


        // mirror link
        var $msclass, $fsclass;
        var $titleFside = "Current side";
        var $titleMirror = "Go another side";
        if( isMirror )
        {
            $msclass = $titleFside;
            $titleFside = $titleMirror;
            $titleMirror = $msclass;
            $msclass = "active";
        }
        else
        {
            $fsclass = "active";
        } // endif

        return <div className="wrapper_event_page" data-id={symbol} id={symbol}>
            <h1>
                <a href={appData.pageEventData.fsideLink} className={$fsclass} title={$titleFside}>{data.SymbolsAndOrders.Symbol.HomeName}</a>
                <span className="lower"> vs </span>
                <a href={appData.pageEventData.mirrorLink} className={$msclass} title={$titleMirror}>{data.SymbolsAndOrders.Symbol.AwayName}</a>
            </h1>
            <div className="container">
                <div className="chart_container">
                    <Chart data={this.props.eventPage} actions={this.props.chartActions} />
                </div>
                <div className="event_info">
                    <div className="current_price">
                        <div className="wrapper">
                            <h2>{data.IsMirrorName}</h2>
                            <div className="current_price">
                                <span className="title">Last Price:</span>
                                <span className="value">{lastPrice}</span>
                                { StatusEvent &&
                                    [ <br />,
                                    <span className="title">Event status: </span>,
                                    <span className="value">{StatusEvent}</span>]
                                }
                            </div>
                        </div>
                        <div className="price_scope">
                            <div className="high container">
                                <span className="title">High</span>
                                <span className="current">{maxPrice > 0 && maxPrice}</span>
                            </div>
                            <div className="low container">
                                <span className="title">Low</span>
                                <span className="current">{minPrice !== 100 && minPrice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="specification">
                        <h2>Specifications</h2>
                        <table className="specification_table">
                            <tbody>
                                <tr>
                                    <td><strong>Trade volume:</strong></td>
                                    <td><span>7/006</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Volume today:</strong></td>
                                    <td>
                                        <span>{data.SumVolume}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>All positions:</strong></td>
                                    <td><span>3.717</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="ord_crt_cont event-content" data-symbol={symbol}>
                        <button className="btn buy price event wave" type="button" //disabled={isTraiderOn}
                            onClick={() => this.actions.onSellBuyClick({
                                   type: 0,
                                   //data: data, // orders
                                   exdata: commProps, // for trader object
                        }, (ABpp.config.tradeOn ? traderActions : defaultOrderActions))}>Buy</button>
                        <button className="btn sell price event wave" type="button" //disabled={isTraiderOn}
                            onClick={() => this.actions.onSellBuyClick({
                                   type: 1,
                                   //data: data, // orders
                                   exdata: commProps, // for trader object
                        }, (ABpp.config.tradeOn ? traderActions : defaultOrderActions))}>Sell </button>
                    </div>
                </div>
            </div>
            <div id="mainController" className="executed">
                <div className="executed_orders sell order_create event-content" data-symbol={symbol}>
                    <BetsTable data={{data: data.IsMirror ? askData : bidData, typeb: BetsTable.TYPE_BID, isTraiderOn, exdata: data, socket}}
                               defaultOrderActions={defaultOrderActions}
                               traderActions={traderActions}
                               actions={this.actions} />
                </div>
                <div className="executed_orders buy order_create event-content" data-symbol={symbol}>
                    <BetsTable data={{data: data.IsMirror ? bidData : askData, typeb: BetsTable.TYPE_ASK, isTraiderOn, exdata: data, socket}}
                               defaultOrderActions={defaultOrderActions}
                               traderActions={traderActions}
                               actions={this.actions} />
                </div>
                <div className="executed_orders">
                    <table>
                        <thead>
                            <tr>
                                <th><span>Time & Sales</span></th>
                                <th>{}</th>
                                <th>{}</th>
                            </tr>
                        </thead>
                        <tbody>{ticksHmtl}</tbody>
                    </table>
                </div>
            </div>
            <div className="comparison">
                <div className="table_wrap">
                    <table className="comparison_table">
                        <thead>
                            <tr>
                                <th><strong>For comparison</strong></th>
                                <th>{}</th>
                                <th>{}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span>Smarkets</span></td>
                                <td className="buy"><span>$0.61</span></td>
                                <td className="buy"><span>1.63</span></td>
                            </tr>
                            <tr>
                                <td><span>Betfair</span></td>
                                <td className="buy"><span>$0.59</span></td>
                                <td className="buy"><span>1.69</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table_wrap">
                    <table className="comparison_table">
                        <thead>
                            <tr>
                                <th><strong>For comparison</strong></th>
                                <th>{}</th>
                                <th>{}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span>Smarkets</span></td>
                                <td className="sell"><span>$0.69</span></td>
                                <td className="sell"><span>1.45</span></td>
                            </tr>
                            <tr>
                                <td><span>Betfair</span></td>
                                <td className="sell"><span>$0.63</span></td>
                                <td className="sell"><span>1.58</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table_wrap">{}</div>
            </div>
            <div className="information">{}</div>

            <div id="disqus_thread">{}</div>
            <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
        </div>
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    eventPage: state.eventPage,
    // test: state.Ttest,
}),
dispatch => ({
	defaultOrderActions: bindActionCreators(defaultOrderActions, dispatch),
    eventPageActions: bindActionCreators(eventPageActions, dispatch),
    chartActions: bindActionCreators(chartActions, dispatch),
	traderActions: bindActionCreators(traderActions, dispatch),
})
)(EventPage)