import React from 'react';

import {DateLocalization} from '../../models/DateLocalization';


export class TabOpenOrders extends React.Component
{
    filters = {'fantasy sport': 'Fantasy Sport', 'economy': 'Economy', 'e-sport': 'E-Sport', 'society': 'Society', };

    constructor(props)
    {
        super(props);

        var filters = {};
        Object.keys(this.filters).forEach((item) => { filters[item] = true });
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
        const { data: openOrdersData, yourOrdersActions } = this.props;
        // 0||console.debug( 'openOrdersData', openOrdersData );
        // filter btn
        var filterBtn = (inCatName, $ca) => [<input key={inCatName + "11"} id={$ca = inCatName.replace(" ", "_").replace("-", "_") + "11"} type="checkbox" className="checkbox" checked={this.state.filters[inCatName]} data-filter={inCatName} onChange={::this._onFilterChange} />, <label key={inCatName + '13'} htmlFor={$ca} className={this.filters[inCatName].toLowerCase().replace("-", "_").replace(" ", "-")}><span className="sub_tab">{this.filters[inCatName]}</span></label>];


        return <div className="tab_item">
            <div className="my_position_tab">
                <div className="wrapper">
                    <div className="filters">
                        {filterBtn('fantasy sport')}&nbsp;
                        {/*{filterBtn(this.filters['Economy'])}&nbsp;*/}
                        {filterBtn('e-sport')}
                        {/*{filterBtn(this.filters['Society'])}*/}
                    </div>
                    <div className="tab_content">
                        <div className="open_orders table_content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{_t('Symbol')}</th>
                                        <th>Time</th>
                                        <th>Type</th>
                                        <th>Units</th>
                                        <th>Price</th>
                                        <th>Latest</th>
                                        <th>Position</th>
                                        <th/>
                                    </tr>
                                </thead>
                            </table>
                            <div id="open_orders">
                                {
                                    (openOrdersData && openOrdersData.length) ?
                                        <table>
                                            <tbody className="filter_item active" id={this.props.id}>
                                            {
                                                openOrdersData.map((item, key) =>
                                                {
                                                    const $handicap = (item.isMirror ? item.Symbol.AwayHandicap : item.Symbol.HomeHandicap);

                                                    if( this.state.filters[item.Category.toLowerCase()] ) return <tr key={key} className={(item.isMirror ? (item.Side ? 'buy' : 'sell') : (item.Side ? 'sell' : 'buy'))} id={item.ID}>
                                                        <td className="title">
															{item.Symbol.HomeName} - {item.Symbol.AwayName}
                                                            {/*<span className="muted">{$handicap && ` (${$handicap})`}</span>*/}
                                                            {/*<br />*/}
                                                            {/*<span className="fullname muted">{item.Symbol.HomeName} - {item.Symbol.AwayName}</span>*/}
                                                        </td>
                                                        <td>
                                                            <span className="timestamp">
                                                                <span className="date">{(new DateLocalization).fromSharp(item.Time, 0).unixToLocalDate({format: 'MM/DD/YYYY'})}</span>
                                                                <span className="time"> {(new DateLocalization).fromSharp(item.Time, 0).unixToLocalDate({format: 'hh:mm A'})}</span>
                                                            </span>
                                                        </td>
                                                        <td>{(item.isMirror ? (item.Side ? 'Buy' : 'Sell') : (item.Side ? 'Sell' : 'Buy'))}</td>
                                                        <td className="quantity">{item.Volume}</td>
                                                        <td>{(item.isMirror ? (Math.round10(1 - item.Price, -2)).toFixed(2) : (item.Price).toFixed(2))}</td>
                                                        <td>
                                                            {
                                                                (item.Symbol.LastSide !== null) &&
                                                                    <span className={`${item.isMirror ? (item.Symbol.LastSide ? 'buy' : 'sell') : (item.Symbol.LastSide ? 'sell' : 'buy')} last_price`}>
                                                                        {item.isMirror ? (Math.round10(1 - item.Symbol.LastPrice, -2)).toFixed(2) : (item.Symbol.LastPrice).toFixed(2)}
                                                                    </span>
                                                            }
                                                        </td>
                                                        <td className={item.isPosition ? 'pos' : ''}>{}</td>
                                                        <td>
                                                            <button className="edit btn wave" onClick={yourOrdersActions.actionOpenEditForm.bind(null, item.ID)}>Edit</button>
                                                            <button className="delete btn wave" onClick={yourOrdersActions.actionOpenDeleteForm.bind(null, item.ID)} style={{marginLeft : 10}}>Cancel</button>
                                                        </td>
                                                    </tr>;
                                                })
                                            }
                                            </tbody>
                                        </table>
                                        :
                                        <p>You have no order or positions</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
