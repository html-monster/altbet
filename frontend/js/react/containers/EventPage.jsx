import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from '../common/BaseController';
import Chart from '../components/EventPage/Chart';
import * as chartActions from '../actions/EventPage/chartActions.ts';
import eventPageActions from '../actions/eventPageActions.ts';

class EventPage extends React.Component implements BaseController
{
    constructor(props)
    {
        super();

        // ABpp.controllers.EventPage

        // this.state = {data: props.data};
        0||console.debug( 'this.props', props );

        props.eventPageActions.actionOnLoad({exchange: appData.pageEventData.SymbolsAndOrders.Symbol.Exchange});
    }

    render()
    {
        let data = this.props.eventPage.pageEventData;
        let symbol = `${data.SymbolsAndOrders.Symbol.Exchange}_${data.SymbolsAndOrders.Symbol.Name}_${data.SymbolsAndOrders.Symbol.Currency}`;

0||console.debug( 'this.props', this.props );

        return <div className="wrapper_event_page" data-id={symbol}>
            <h1>{data.SymbolsAndOrders.Symbol.HomeName} VS {data.SymbolsAndOrders.Symbol.AwayName}</h1>
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
                                <span className="value">{/*@string.Format("{0:0.0#}",Model.SymbolsAndOrders.Symbol.LastPrice)*/}</span>
                            </div>
                        </div>
                        <div className="price_scope">
                            <div className="high container">
                                <span className="title">High</span>
                                <span className="current"></span>
                            </div>
                            <div className="low container">
                                <span className="title">Low</span>
                                <span className="current"></span>
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
                        <button className="btn buy price event">Buy</button>
                        <button className="btn sell price event">Sell</button>
                    </div>
                </div>
            </div>
            <div id="mainController" className="executed">
                <div className="executed_orders sell order_create event-content" data-symbol={symbol}>
                    <table>
                        <thead>
                            <tr>
                                <th><span>ID</span></th>
                                <th><span>Bid</span></th>
                                <th><span>Quantity</span></th>
                            </tr>
                        </thead>
                        <tbody>
                           <tr class=""><td><span>alt.bet</span></td><td class="price buy animated"><span>$0.46</span></td><td class="volume buy animated"><span>12</span></td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="executed_orders buy order_create event-content" data-symbol={symbol}>
                    <table>
                        <thead>
                            <tr>
                                <th><span>ID</span></th>
                                <th><span>Ask</span></th>
                                <th><span>Quantity</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <div className="executed_orders">
                    <table>
                        <thead>
                            <tr>
                                <th><span>Time & Sales</span></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="comparison">
                <div className="table_wrap">
                    <table className="comparison_table">
                        <thead>
                            <tr>
                                <th><strong>For comparison</strong></th>
                                <th></th>
                                <th></th>
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
                                <th></th>
                                <th></th>
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
              <div className="table_wrap">
              </div>
            </div>
            <div className="information">
            </div>
        </div>
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(state => ({
    eventPage: state.eventPage,
    // test: state.Ttest,
}),
dispatch => ({
    eventPageActions: bindActionCreators(eventPageActions, dispatch),
    chartActions: bindActionCreators(chartActions, dispatch),
})
)(EventPage)