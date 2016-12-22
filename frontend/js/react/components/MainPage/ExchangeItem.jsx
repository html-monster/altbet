import React from 'react'


export default class ExchangeItem extends React.Component
{
    render()
    {
        let isBasicMode = ABpp.User.settings.basicMode;


        let data = this.props.data;
        return <div className={"content_bet " + (isBasicMode ? " basic_mode_js" : "") + " categoryFilterJs"} style={{}}>{/*id={data.Symbol.Exchange}*/}{/*@(ViewBag.FilterId != null ? (Model.CategoryList.Contains(ViewBag.FilterId) ? 'display:flex;' : 'display:none;') : 'display:flex;')*/}
            <input name={data.Symbol.Status} type="hidden" value="inprogress" />

            <div className="event_info "> {/*@(eventClass.TryGetValue(new Guid(Model.CategoryList.Split('/')[1]), out value) ? value : "")*/}
                <span className="date help">
                    {data.Symbol.StartDate}
                    <span className="help_message"><span>MM/DD/YYYY</span></span>
                </span>
                {/*@*<i className="half_time">ht<span>half-time</span></i>*@*/}
            </div>
            <div className="content_title command">
                <h2>{data.Symbol.HomeName} { (data.Symbol.HomePoints != null) ? <span>(data.Symbol.HomePoints)</span> : '' }</h2>
                <h2>{data.Symbol.AwayName} {(data.Symbol.AwayPoints != null) ? <span>(data.Symbol.AwayPoints)</span> : ''}</h2>
                <span className="symbol_name hidden">{data.Symbol.Exchange}</span>
            </div>
            <div className="table not-sort wave"> {/*id="exchange_table"*/}
                <div className="event-content" data-symbol={data.Symbol.Exchange}>
{/*
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.HomeName}</span>
                        <span>{(data.Symbol.HomeHandicap != null ? (data.Symbol.HomeHandicap > 0 ? "+" + data.Symbol.HomeHandicap : data.Symbol.HomeHandicap) : "")}</span>
                        <a href="/eng/Sport/American_Football/NFL/BUB-NEP-12312016/0">see more</a>
                    </h3>
*/}
{/*
                    <div className="container">
                        <div className="sell button-container">
                                @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Buy && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
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
                            }
                        </div>
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
                        <div className="pl mode_info_js">
                            <strong>P/L: <span></span></strong>
                        </div>
                    </div>
*/}
                </div>
                <div className="event-content revers" data-symbol={data.Symbol.Exchange + "_mirror"}>
{/*
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.AwayName}</span>
                        <span>{(data.Symbol.AwayHandicap != null ? (data.Symbol.AwayHandicap > 0 ? "+{0}" + data.Symbol.AwayHandicap : data.Symbol.AwayHandicap) : "")}</span>
                        /!*@Html.RouteLink("see more", "EventPage", new { controller = "Event", action = "Index", main = Model.CategoryName.Split('/')[2], sub = Model.CategoryName.Split('/')[1].Replace(" ", "_"), category = Model.CategoryName.Split('/')[0].Replace(" ", "_"), exchangename = Model.Symbol.Exchange, reflection = "1" }, new object())*!/
                    </h3>
*/}
{/*
                    <div className="container">
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
                        <div className="pos mode_info_js">
                            <strong>Pos: <span></span></strong>
                        </div>
                    </div>
*/}
                </div>
{/*                <button className="show-schedule" title="Показать график"></button>
                <div className="schedule loader not-sort">
                    <div id="@string.Format("container_{0}", Model.Symbol)"></div>
                    <!--img src="~/Images/chart_white.svg" alt=""-->
                </div>
                <a href="#" className="add_favorite" title="Add to favorite"></a>*/}
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
