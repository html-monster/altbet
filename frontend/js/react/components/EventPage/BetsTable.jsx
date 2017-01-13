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
        var {data, typeb} = this.props.data;
        var $class, $fieldName;

        if( typeb == BetsTable.TYPE_BID )
        {
            $class = 'buy';
            $fieldName = 'Bid';
        }
        else
        {
            $class = 'sell';
            $fieldName = 'Ask';
        } // endif

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
                        return <tr className="old" key={key}>
                            <td><span>alt.bet</span></td>
                            <td className={`price ${$class} animated`}><span>${Common.toFixed(val.Price, 2)}</span></td>
                            <td className={`volume ${$class} animated`}><span>{val.Quantity}</span></td>
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