/**
 * Created by Vlasakh on 13.01.2017.
 */

import React from 'react' ;
import {Common} from '../../common/Common.ts' ;


export class BetsTable extends React.Component
{
    static TYPE_BID = '1';
    static TYPE_ASK = '2';

    render ()
    {
        var self = this;
        var {data, typeb, isTraiderOn, exdata} = this.props.data;
        var $fieldName;
        var $class = !isTraiderOn ? " clickable" : '';
        var $type;

        if( typeb == BetsTable.TYPE_BID )
        {
            $class += ' buy';
            $fieldName = 'Bid';
            $type = 0;
        }
        else
        {
            $class += ' sell';
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
                    <th><span>ID</span></th>
                    <th><span>{$fieldName}</span></th>
                    <th><span>Quantity</span></th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((val, key) => {
                        return <tr className="" key={key}>
                            <td><span>alt.bet</span></td>
                            <td className={`price ${$class} animated`}><span>${Common.toFixed(val.Price, 2)}</span></td>
                            <td className={`volume ${$class} animated`} onClick={() => self.props.actions.onQuantityClick({
                                   Price: val.Price,
                                   Quantity: val.Quantity,
                                   type: $type,
                                   data: data, // orders
                                   exdata: commProps, // for trader object
                                })}
                            >
                                <span>{val.Quantity}</span>
                            </td>
                        </tr>;
                })}
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