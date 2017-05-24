/**
 * Created by Vlasakh on 13.01.2017.
 */

import React from 'react' ;
import {Common} from '../../common/Common.ts' ;
import AnimateOnUpdate from '../Animation';
import {TestCm} from './TestCm';


export class BetsTable extends React.Component
{
    static TYPE_BID = '1';
    static TYPE_ASK = '2';


    constructor()
    {
        super();

        this.loading = true;
    }


    componentDidMount()
    {
        this.loading = false;
    }


    render ()
    {
        const self = this;
        let { defaultOrderActions, data:{ data, typeb, isTraiderOn, exdata, socket }, traderActions } = this.props;
        let $class = "clickable ";// = !isTraiderOn ? "clickable " : '';
        let $fieldName;
        let $type;
        let symbol = socket.activeOrders ? socket.activeOrders.Symbol : exdata.SymbolsAndOrders.Symbol;

        if( typeb == BetsTable.TYPE_BID )
        {
            if (!exdata.IsMirror) data = data.slice().reverse();
            $class += 'buy';
            $fieldName = 'Bid';
            $type = 0;
        }
        else
        {
            if (exdata.IsMirror) data = data.slice().reverse();
            $class += 'sell';
            $fieldName = 'Ask';
            $type = 1;
        } // endif


        let commProps = {
            isMirror: exdata.IsMirror,
            // symbolName: symbol,
            // Orders: data.Orders,
            HomeName : exdata.SymbolsAndOrders.Symbol.HomeName,
            AwayName : exdata.SymbolsAndOrders.Symbol.AwayName,
            Positions : exdata.SymbolsAndOrders.Positions,
            Exchange : exdata.SymbolsAndOrders.Symbol.Exchange,
            Name : exdata.SymbolsAndOrders.Symbol.Name,
            Currency : exdata.SymbolsAndOrders.Symbol.Currency,
        };

        return <table>
            <thead>
                <tr>
                    {/*<th><span>ID</span></th>*/}
                    <th><span>{$fieldName}</span></th>
                    <th><span>Quantity</span></th>
                </tr>
            </thead>
            <tbody>
                        {/*return <tr className="" key={val.Price}>*/}
                            {/*transitionLoading={!this.loading}*/}
                {
                    data.map((val, key) =>
                        <AnimateOnUpdate
                            component="tr"
                            key={val.Price}
                            transitionName={{
								enter : 'fadeColorOut',
								leave : 'fadeColorOut',
								appear: 'fadeColorOut'
							}}
                            transitionAppear={true}
                            transitionLeave={false}
                            transitionAppearTimeout={1600}
                            transitionEnterTimeout={800}
                            transitionLeaveTimeout={500}
                            data={val}
                        >
                            {/*<td><span>alt.bet</span></td>*/}
                            <td className={`price ${$class} animated`} data-verify="Quantity"
                                onClick={() => self.props.actions.onPriceClick({
								Price   : val.Price,
								Quantity: val.Quantity,
								type    : $type,
								data    : data, // orders
								exdata  : commProps, // for trader object
							}, (ABpp.config.tradeOn ? traderActions : defaultOrderActions))}
                            >
								{/*component="div"
                                 className="button" */}
                                <span>${Common.toFixed(exdata.IsMirror ? 1 - val.Price : val.Price, 2)}</span>
                            </td>
                            <td className={`volume ${$class} animated`}
                                data-verify="Quantity"
                                onClick={() => self.props.actions.onQuantityClick({
									Price   : val.Price,
									Quantity: val.Quantity,
									type    : $type,
									data    : data, // orders
									exdata  : commProps, // for trader object
                                    bestPrice: exdata.IsMirror ?
                                                    $type ? Math.round10(1 - symbol.LastBid, -2) : Math.round10(1 - symbol.LastAsk, -2)
                                                    :
                                                    $type ? symbol.LastAsk : symbol.LastBid
								}, (ABpp.config.tradeOn ? traderActions : defaultOrderActions))}
                            >
                                <span>{val.Quantity}</span>
                            </td>
                        </AnimateOnUpdate>
                )}
                        {/*</tr>;*/}
                {/*// if (children < objLength) {
//     for (var ii = children; ii < objLength; ii++) {
//         table.append('<tr><td><span>alt.bet</span></td><td class="' + className + ' price ' + side +
//             ' animated"><span></span></td><td class="' + className + ' volume ' + side + ' animated"><span></span></td></tr>');
//     }
// }
// $(data.SummaryPositionPrice).each(function () {
//     var self = this;
//     var tr = table.find('tr').eq(flag++);
//
//     self.Price = (isMirror == "True") ? (1 - self.Price) : self.Price;
//
//     //if (self.Price > maxPrice) maxPrice = self.Price;
//     //if (self.Price < minPrice) minPrice = self.Price;
//
//     tr.find('.price span').text('$' + self.Price.toFixed(2));
//     tr.find('.volume span').text(self.Quantity);
// });*/}
            </tbody>
        </table>;
    }
}