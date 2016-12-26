import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    render()
    {
        let isBasicMode = ABpp.User.settings.basicMode;
        let $DateLocalization = new DateLocalization();
        let data = this.props.data;
        let symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
        let commProps = {
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
        // 0||console.debug( 'data', data );


        return <div className={"content_bet " + (isBasicMode ? " basic_mode_js" : "") + " categoryFilterJs"} id={symbol} style={{}}>{/**/}{/*@(ViewBag.FilterId != null ? (Model.CategoryList.Contains(ViewBag.FilterId) ? 'display:flex;' : 'display:none;') : 'display:flex;')*/}
            <input name={data.Symbol.Status} type="hidden" value="inprogress" />

            <div className={"event_info " + appData.pageHomeDataIcons[data.CategoryList.split('/')[1].toUpperCase()]}> {/*@(eventClass.TryGetValue(new Guid(Model.CategoryList.Split('/')[1]), out value) ? value : "")*/}
                <span className="date help">
                    {$DateLocalization.fromSharp(data.Symbol.StartDate, 0).unixToLocalDate()}
                    <span className="help_message"><span>MM/DD/YYYY</span></span>
                </span>
                {/*@*<i className="half_time">ht<span>half-time</span></i>*@*/}
            </div>
            <div className="content_title command">
                <h2>{data.Symbol.HomeName} {(data.Symbol.HomePoints != null) ? <span>{data.Symbol.HomePoints}</span> : '' }</h2>
                <h2>{data.Symbol.AwayName} {(data.Symbol.AwayPoints != null) ? <span>{data.Symbol.AwayPoints}</span> : ''}</h2>
                <span className="symbol_name hidden">{symbol}</span>
            </div>
            <div className="table not-sort wave"> {/*id="exchange_table"*/}
                <div className="event-content" data-symbol={symbol}>
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.HomeName}</span>
                        <span>{(data.Symbol.HomeHandicap != null ? (data.Symbol.HomeHandicap > 0 ? " +" + data.Symbol.HomeHandicap : " " + data.Symbol.HomeHandicap) : false)}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "/0"}>see more</a>
                    </h3>

                    <div className="container">
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'sell',
                            side: 0,
                            ismirror: false,
                            ...commProps
                        }}/>
{/*
                        <div className="sell button-container">
                            {
                                (data.Orders.length && data.Orders.some((item) => item.Side == 0) ?
                                        data.Orders.map((item) =>
                                            (item.Side == 0 ?
                                                    item.SummaryPositionPrice.map((item) =>
                                                        <button className="event animated sell real not-sort">
                                                            <span className="price">{Common.toFixed(ABpp.User.settings.basicMode ? item.Price : item.Price, 2)}</span>
                                                            <span className="volume">{item.Quantity}</span>
                                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                                        </button>
                                                    )
                                                : ""
                                            )
                                        )
                                    :   <button className="event animated empty sell real not-sort">
                                            <span className="price empty">OFFER</span>
                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                        </button>
                                )
                            }
/!*                                @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Buy && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
                            {
                                foreach (var spsItem in Model.Orders.Single(x => x.Side == AltBet.Exchange.Side.Buy).SummaryPositionPrice.Where(x => x.Quantity != 0).ToList())
                                {
                                    <button className="event animated sell real not-sort">
                                        <span className="price">@((Session["Mode"] != null) ? ((bool)Session["Mode"]) ? string.Format("${0}", spsItem.Price.ToString("0.00")) : spsItem.Price.ToString("0.00") : string.Format("${0}", spsItem.Price.ToString("0.00")))</span>
                                        <span className="volume">@spsItem.Quantity</span>
                                        <div className="symbolName" style="display: none">data.Symbol</div>
                                    </button>
                                }
                            }
                            else
                            {
                                <button className="event animated empty sell real not-sort">
                                    <span className="price empty">OFFER</span>
                                    <div className="symbolName" style="display: none">data.Symbol</div>
                                </button>
                            }*!/
                        </div>
*/}
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'buy',
                            side: 1,
                            ismirror: false,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>
{/*
                        <div className="buy button-container">
                            {
                                (data.Orders.length && data.Orders.some((item) => item.Side == 1) ?
                                        data.Orders.map((item) =>
                                            (item.Side == 1 ?
                                                    item.SummaryPositionPrice.map((item) =>
                                                        <button className="event animated buy real not-sort">
                                                            <span className="price">{Common.toFixed(ABpp.User.settings.basicMode ? item.Price : item.Price, 2)}</span>
                                                            <span className="volume">{item.Quantity}</span>
                                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                                        </button>
                                                    )
                                                : false
                                            )
                                        )
                                    :   <button className="event animated empty buy real not-sort">
                                            <span className="price empty">BID</span>
                                            <div className="symbolName" style={{display: 'none'}}>data.Symbol</div>
                                        </button>
                                )
                            }
                        </div>
*/}
{/*
                        <div className="buy button-container">
                            @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Sell && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
                            {
                                foreach (var spsItem in Model.Orders.Single(x => x.Side == AltBet.Exchange.Side.Sell).SummaryPositionPrice.Where(x => x.Quantity != 0).ToList())
                                {
                                    <button className="event animated buy real not-sort">
                                        <span className="price">@((Session["Mode"] != null) ? ((bool)Session["Mode"]) ? string.Format("${0}", spsItem.Price.ToString("0.00")) : spsItem.Price.ToString("0.00") : string.Format("${0}", spsItem.Price.ToString("0.00")))</span>
                                        <span className="volume">@spsItem.Quantity</span>
                                        <div className="symbolName" style="display: none">data.Symbol</div>
                                    </button>
                                }
                            }
                            else
                            {
                                <button className="event animated empty buy real not-sort">
                                    <span className="price empty">BID</span>
                                    <div className="symbolName" style="display: none">data.Symbol</div>
                                </button>
                            }
                        </div>
*/}
                        <div className="pl mode_info_js">
                            <strong>P/L: <span></span></strong>
                        </div>
                    </div>
                </div>


                <div className="event-content revers" data-symbol={symbol + "_mirror"}>
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.AwayName}</span>
                        <span>{(data.Symbol.AwayHandicap != null ? (data.Symbol.AwayHandicap > 0 ? " +" + data.Symbol.AwayHandicap : " " + data.Symbol.AwayHandicap) : "")}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "/1"}>see more</a>
                    </h3>

                    <div className="container">
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'sell',
                            side: 1,
                            ismirror: true,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>

{/*
                        <div className="sell button-container">
                            {
                                data.Orders.length && data.Orders.some((item) => item.Side == 1) ?
                                        data.Orders.map((item) =>
                                            item.Side == 1 ?
                                                    item.SummaryPositionPrice.map((item) =>
                                                        <button className="event animated sell mirror not-sort">
                                                            <span className="price">{(1-(ABpp.User.settings.basicMode ? item.Price : item.Price)).toFixed(2)}</span>
                                                            <span className="volume">{item.Quantity}</span>
                                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                                        </button>
                                                    )
                                                : false
                                        )
                                    :   <button className="event animated empty sell mirror not-sort">
                                            <span className="price empty">OFFER</span>
                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                        </button>
                            }
                        </div>
*/}
{/*
                        <div className="sell button-container">
                            @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Sell && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
                            {
                                foreach (var spsItem in Model.Orders.Single(x => x.Side == AltBet.Exchange.Side.Sell).SummaryPositionPrice.Where(x => x.Quantity != 0).OrderByDescending(x => x.Price).ToList())
                                {
                                    <button className="event animated sell mirror not-sort">
                                        <span className="price">@((Session["Mode"] != null) ? ((bool)Session["Mode"]) ? string.Format("${0}", (1 - spsItem.Price).ToString("0.00")) : (1 - spsItem.Price).ToString("0.00") : string.Format("${0}", (1 - spsItem.Price).ToString("0.00")))</span>
                                        <span className="volume">@spsItem.Quantity</span>
                                        <div className="symbolName" style="display: none">data.Symbol</div>
                                    </button>
                                }
                            }
                            else
                            {
                                <button className="event animated empty sell mirror not-sort">
                                    <span className="price empty">OFFER</span>
                                    <div className="symbolName" style="display: none">data.Symbol</div>
                                </button>
                            }
                        </div>
                        */}
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'buy',
                            side: 0,
                            ismirror: true,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>

{/*
                        <div className="buy button-container">
                            {
                                data.Orders.length && data.Orders.some((item) => item.Side == 0) ?
                                        data.Orders.map((item) =>
                                            item.Side == 0 ?
                                                    item.SummaryPositionPrice.map((item) =>
                                                        <button className="event animated sell mirror not-sort">
                                                            <span className="price">{(1 - (ABpp.User.settings.basicMode ? item.Price : item.Price)).toFixed(2)}</span>
                                                            <span className="volume">{item.Quantity}</span>
                                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                                        </button>
                                                    )
                                                : false
                                        )
                                    :   <button className="event animated empty buy mirror not-sort">
                                            <span className="price empty">BID</span>
                                            <div className="symbolName" style={{display: 'none'}}>{symbol}</div>
                                        </button>
                            }
                        </div>
*/}

                        {/*
                        <div className="buy button-container">
                            @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Buy && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
                            {
                                foreach (var spsItem in Model.Orders.Single(x => x.Side == AltBet.Exchange.Side.Buy).SummaryPositionPrice.Where(x => x.Quantity != 0).OrderByDescending(x => x.Price).ToList())
                                {
                                    <button className="event animated buy mirror not-sort">
                                        <span className="price">@((Session["Mode"] != null) ? ((bool)Session["Mode"]) ? string.Format("${0}", (1 - spsItem.Price).ToString("0.00")) : (1 - spsItem.Price).ToString("0.00") : string.Format("${0}", (1 - spsItem.Price).ToString("0.00")))</span>
                                        <span className="volume">@spsItem.Quantity</span>
                                        <div className="symbolName" style="display: none">data.Symbol</div>
                                    </button>
                                }
                            }
                            else
                            {
                                <button className="event animated empty buy mirror not-sort">
                                    <span className="price empty">BID</span>
                                    <div className="symbolName" style="display: none">data.Symbol</div>
                                </button>
                            }
                        </div>
*/}
                        <div className="pos mode_info_js">
                            <strong>Pos: <span></span></strong>
                        </div>
                    </div>
                </div>

                <button className="show-schedule" title="Показать график"></button>
                <div className="schedule loader not-sort">
                    <div id={"container_" + symbol}></div>
                    {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                </div>
                <a href="#" className="add_favorite" title="Add to favorite"></a>
            </div>
        </div>;
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
