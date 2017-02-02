import React from 'react';

import {DateLocalization} from '../../models/DateLocalization';


export class TabMyPos extends React.Component
{
    filters = {'Sport': 'Sport', 'Finance': 'Finance', 'E-Sport': 'E-Sport', 'Society': 'Society', };

    constructor(props)
    {
        super(props);

        var filters = {};
        Object.keys(this.filters).forEach((item) => { filters[this.filters[item]] = true });
        this.state = {filters: filters};
    }


    _onFilterChange(ee)
    {
        // 0||console.log( 'ee', ee.target, ee.target.dataset, this.state );
        // 0||console.log( 'this.state.filters[ee.target.dataset.filter]', this.state.filters[ee.target.dataset.filter], this.state );
        this.state.filters[ee.target.dataset.filter] = !this.state.filters[ee.target.dataset.filter];
        this.setState({...this.state});
    }


    render()
    {
        // 0||console.log( 'this.props.route', this.props.route );
        var {data: positionData, actions} = this.props;
        var plClass;


        // filter btn
        var filterBtn = (inCatName) => [<input key={inCatName + "1"} id={inCatName + "1"} type="checkbox" className="checkbox" checked={this.state.filters[inCatName]} data-filter={inCatName} onChange={::this._onFilterChange} />, <label key={inCatName + '2'} htmlFor={inCatName + "1"} className={inCatName.toLowerCase().replace("-", "_")}><span className="sub_tab">{inCatName}</span></label>];


        return <div className="tab_item active">
                    <div className="my_position_tab">
                        <div className="wrapper">
                            <div className="filters">
                                {filterBtn(this.filters['Sport'])}&nbsp;
                                {filterBtn(this.filters['Finance'])}&nbsp;
                                {filterBtn(this.filters['E-Sport'])}&nbsp;
                                {filterBtn(this.filters['Society'])}
                            </div>
                            <div className="tab_content">
                                <div className="my_position_container table_content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Symbol</th>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th><span className="sell">BID</span> | <span className="buy">ASK</span></th>
                                                <th><span className="profit">Profit</span>&nbsp;/&nbsp;<span className="loss">Loss</span></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <div id="my_position_container">
                                    {
                                        (positionData && positionData.length) ?
                                            <div>
                                            {
                                                positionData.map((item, key) =>
                                                {
                                                    if(item.CommonSymbolProfitLoss < 0) plClass = 'loss';
                                                    else if(item.CommonSymbolProfitLoss > 0) plClass = 'profit';


                                                    return <table key={key} className="pos tmp">
                                                        <thead>
                                                        <tr>
                                                            <th className="title">{item.Symbol.HomeName + ' - ' + item.Symbol.AwayName}</th>
                                                            <th>{}</th>
                                                            <th><span className="quantity">{item.CommonSymbolVolume}</span></th>
                                                            <th>{}</th>
                                                            <th>{}</th>
                                                            <th>
                                                                        <span className={'pl ' + plClass}>
                                                                            {(item.CommonSymbolProfitLoss < 0 ? '($' + (item.CommonSymbolProfitLoss).toString().slice(1) + ')' : '$' + item.CommonSymbolProfitLoss)}
                                                                        </span>
                                                            </th>
                                                            <th><button className="btn close_out wave" onClick={this.handleCloseOut}>Close Out</button></th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="showhide active">
                                                        {
                                                            item.SubPositions.map((item2, key) =>
                                                            {
                                                                var commProps = {
                                                                    isMirror: item2.IsMirror,
                                                                    // symbolName: symbol,
                                                                    // Orders: data.Orders,
                                                                    HomeName : item.Symbol.HomeName,
                                                                    AwayName : item.Symbol.AwayName,
                                                                    Positions : item.Positions,
                                                                    Exchange : item.Symbol.Exchange,
                                                                    Name : item.Symbol.Name,
                                                                    Currency : item.Symbol.Currency,
                                                                };
                                                                plClass = '';
                                                                if(item.CommonSymbolProfitLoss < 0) plClass = 'loss';
                                                                else if(item.CommonSymbolProfitLoss > 0) plClass = 'profit';


                                                                return <tr key={key} className={'event-content content_bet ' +
                                                                        (item2.IsMirror ? (item2.Side ? 'sell revers' : 'buy revers') : (item2.Side ? 'sell' : 'buy'))}
                                                                        data-symbol={item2.ID + (item2.IsMirror ? '_mirror' : '')}>
                                                                    <td>
                                                                        <strong className="title">{item2.EventName} <span className="muted">{item2.EventHandicap && ` (${item2.EventHandicap})`}</span></strong>
                                                                        <span className="hidden symbol_name">{item2.ID}</span>
                                                                    </td>
                                                                    <td className="side">{(item2.Side ? 'Short' : 'Long')}</td>
                                                                    <td className="quantity">{item2.CommonVolume}</td>
                                                                    <td className="avg_price">{Math.round10(item2.AvgPrice, -2)}</td>
                                                                    <td className="spread">
                                                                        <span className="sell">{(item2.IsMirror ? Math.round10(1 - item.Symbol.LastAsk, -2) : item.Symbol.LastBid)}</span> |
                                                                        <span className="buy"> {(item2.IsMirror ? Math.round10(1 - item.Symbol.LastBid, -2) : item.Symbol.LastAsk)}</span>
                                                                    </td>
                                                                    <td className={'pl ' + plClass}>{(item2.CommonProfitLoss < 0) ? '($' + (item2.CommonProfitLoss).toString().slice(1) + ')' : '$' + item2.CommonProfitLoss}</td>
                                                                    <td>
                                                                        <span className="buy"><button className="buy btn event wave empty btnJs"
                                                                            onClick={() => actions.actionOnBuySellClick({type: 0, exdata: commProps})}
                                                                        >Buy</button></span>
                                                                        <span className="sell"><button className="sell btn event wave empty btnJs"
                                                                            onClick={() => actions.actionOnBuySellClick({type: 1, exdata: commProps})}
                                                                        style={{marginLeft : 10}}>Sell</button></span>
                                                                    </td>
                                                                </tr>
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                })
                                            }

                                            </div>
                                            :
                                            <p>You have no positions</p>
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}