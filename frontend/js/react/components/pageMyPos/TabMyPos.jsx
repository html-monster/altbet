import React from 'react';

// import {DateLocalization} from '../../models/DateLocalization';


export class TabMyPos extends React.Component
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
        0||console.log( 'ee', ee.target, ee.target.dataset, this.state );
        // 0||console.log( 'this.state.filters[ee.target.dataset.filter]', this.state.filters[ee.target.dataset.filter], this.state );
        this.state.filters[ee.target.dataset.filter] = !this.state.filters[ee.target.dataset.filter];
        this.setState({...this.state});
    }


	_handleCloseOut({symbol, name}, ee)
	{
        var {actions} = this.props;

	    new Dialog({
            render: true,
            vars: {
                contentHtml: `<span class="nowrap">Close out symbol “${name}” ?</span>`,
                btn1Text: "Yes",
                btn2Text: "No",
            },
            callbackOK: (inProps) => actions.actionOnCloseOutClick({symbol, ...inProps}),
	    });
	}


    render()
    {
        // 0||console.log( 'this.props.route', this.props.route );
        const {data: positionData, actions, defaultOrderActions} = this.props;
        let plClass;

        // filter btn
        var filterBtn = (inCatName, $ca) => [<input key={inCatName + "22"} id={$ca = inCatName.replace(" ", "_").replace("-", "_") + "22"} type="checkbox" className="checkbox" checked={this.state.filters[inCatName]} data-filter={inCatName} onChange={::this._onFilterChange} />, <label key={inCatName + '23'} htmlFor={$ca} className={this.filters[inCatName].toLowerCase().replace("-", "_").replace(" ", "-")}><span className="sub_tab">{this.filters[inCatName]}</span></label>];


        return <div className="">
                    <div className="my_position_tab">
                        <div className="wrapper">
                            <div className="filters">
                                {filterBtn('fantasy sport')}&nbsp;
                                {/*{filterBtn('economy')}&nbsp;*/}
                                {filterBtn('e-sport')}
                                {/*{filterBtn('society')}*/}
                            </div>
                            <div className="tab_content">
                                <div className="my_position_container table_content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>{_t('Symbol')}</th>
                                                <th>Type</th>
                                                <th>Units</th>
                                                <th>Price</th>
                                                <th><span className="sell">{_t('buy')}</span> | <span className="buy">{_t('ask')}</span></th>
                                                <th><span className="profit">{_t('Profit')}</span>&nbsp;/&nbsp;<span className="loss">Loss</span></th>
                                                <th/>
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

//0||console.log( 'this.state.filters', this.state.filters,item.Category.toLowerCase() )
                                                    if( this.state.filters[item.Category.toLowerCase()] ) return <table key={key} className="pos tmp">
                                                        <thead>
                                                        <tr>
                                                            <th className="title">{item.Symbol.HomeName + ' - ' + item.Symbol.AwayName}</th>
                                                            <th>{}</th>
                                                            <th><span className="quantity">{item.CommonSymbolVolume}</span></th>
                                                            <th>{}</th>
                                                            <th>{}</th>
                                                            <th>
                                                                        <span className={'pl ' + plClass}>
                                                                            {(item.CommonSymbolProfitLoss < 0 ?
                                                                                `($${(Math.abs(item.CommonSymbolProfitLoss)).toFixed(2)})`
                                                                                :
                                                                                '$' + (item.CommonSymbolProfitLoss).toFixed(2))}
                                                                        </span>
                                                            </th>
                                                            <th>
                                                                <button className="btn close_out wave"
                                                                        onClick={this._handleCloseOut.bind(this, {
                                                                            symbol: `${item.Symbol.Exchange}_${item.Symbol.Name}_${item.Symbol.Currency}`,
                                                                            name: item.Symbol.HomeName + ' - ' + item.Symbol.AwayName})}
                                                                >Close Out</button>
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="showhide active">
                                                        {
                                                            item.SubPositions.map((item2, key) =>
                                                            {
                                                                let commProps = {
                                                                    isMirror: item2.IsMirror,
                                                                    // symbolName: symbol,
                                                                    // Orders: data.Orders,
                                                                    HomeName : item.Symbol.HomeName,
                                                                    AwayName : item.Symbol.AwayName,
                                                                    Positions : item.CommonSymbolVolume,
                                                                    Exchange : item.Symbol.Exchange,
                                                                    Name : item.Symbol.Name,
                                                                    Currency : item.Symbol.Currency,
																	Ask : item.Symbol.LastAsk,
																	Bid : item.Symbol.LastBid,
                                                                };

																const bid = item2.IsMirror ?
																	(item.Symbol && item.Symbol.LastAsk !== 1) ? (Math.round10(1 - item.Symbol.LastAsk, -2)).toFixed(2) : '-'
																	:
																	(item.Symbol && item.Symbol.LastBid) ? (item.Symbol.LastBid).toFixed(2) : '-';
																const ask = item2.IsMirror ?
																	(item.Symbol && item.Symbol.LastBid) ? (Math.round10(1 - item.Symbol.LastBid, -2)).toFixed(2) : '-'
																	:
																	(item.Symbol && item.Symbol.LastAsk !== 1) ? (item.Symbol.LastAsk).toFixed(2) : '-';

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
                                                                    <td className="side">{(item2.Side ? _t('Sold') : _t('Bought'))}</td>
                                                                    <td className="quantity">{item2.CommonVolume}</td>
                                                                    <td className="avg_price">{(Math.round10(item2.AvgPrice, -2)).toFixed(2)}</td>
                                                                    <td className="spread">
                                                                        <span className="buy"> {bid}</span>|
                                                                        <span className="sell">{ask}</span>
                                                                    </td>
                                                                    <td className={'pl ' + plClass}>{(item2.CommonProfitLoss < 0) ? `($${(Math.abs(item2.CommonProfitLoss)).toFixed(2)})` : '$' + (item2.CommonProfitLoss).toFixed(2)}</td>
                                                                    <td>
                                                                        <span className="buy"><button className="buy btn event wave empty btnJs"
                                                                            onClick={() => actions.actionOnBuySellClick({type: 0, exdata: commProps}, defaultOrderActions)}
                                                                            disabled={true}>Buy</button></span>
                                                                        <span className="sell"><button className="sell btn event wave empty btnJs"
                                                                            onClick={() => actions.actionOnBuySellClick({type: 1, exdata: commProps}, defaultOrderActions)}
                                                                            style={{marginLeft : 10}} disabled={true}>Sell</button></span>
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
