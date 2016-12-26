import React from 'react';

// import {DateLocalization} from './../../models/DateLocalization';
import {Common} from './../../common/Common';


export default class ButtonContainer extends React.Component
{
    render()
    {
        let isBasicMode = ABpp.User.settings.basicMode;
        // let $DateLocalization = new DateLocalization();
        let data = this.props.data;
        var price;

        // 0||console.debug( 'this.props.actions', this.props.actions );

        if( data.ismirror )
        {
            var mirrorClass = 'mirror';
            // var price = (1 - (isBasicMode ? item.Price : item.Price));
        }
        else
        {
            var mirrorClass = 'real';
            // var price = isBasicMode ? item.Price : item.Price;
        } // endif
        // price = Common.toFixed(price, 2);


        if( data.type == 'sell' )
        {
            var className = 'sell';
            var emptBtnName = 'OFFER';
        }
        else
        {
            var className = 'buy';
            var emptBtnName = 'BID';
        } // endif
        // 0||console.debug( 'data', data );


        return <div className={`${className} button-container`}>
            {
                (data.Orders.length && data.Orders.some((item) => item.Side == data.side) ?
                        data.Orders.map((item) =>
                            (item.Side == data.side ?
                                    item.SummaryPositionPrice.map((item2) =>
                                        <button className={`event animated ${className} ${mirrorClass} not-sort`} onClick={this._onBtnClick.bind(this,
                                                {
                                                    PosPrice: item.SummaryPositionPrice,
                                                    ismirror: data.ismirror,
                                                    price: (price = isBasicMode ? item2.Price : item2.Price),
                                                    type: data.type == "sell" ? 1 : 2,
                                                    data: data,
                                                })}>
                                            <span className="price">{(Common.toFixed(data.ismirror ? 1 - price : price, 2))}</span>
                                            <span className="volume">{item2.Quantity}</span>
                                            <div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>
                                        </button>
                                    )
                                : ""
                            )
                        )
                    :   <button className={`event animated empty ${className} ${mirrorClass} not-sort`} onClick={this._onBtnClick.bind(this,
                                {
                                    isempty: true,
                                    PosPrice: [],
                                    ismirror: data.ismirror,
                                    price: 0,
                                    type: data.type == "sell" ? 1 : 2,
                                    data: data,
                                })}>
                            <span className="price empty">{emptBtnName}</span>
                            <div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>
                        </button>
                )
            }
{/*                                @if (Model.Orders.Where(x => x.Side == AltBet.Exchange.Side.Buy && x.SummaryPositionPrice.Sum(y => y.Quantity) != 0).Any())
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
            }*/}
        </div>;
    }


    _onBtnClick(props)
    {
        // 0||console.debug( 'props', props, this.props.actions );
        this.props.actions.actionOnPosPriceClick(props);
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
