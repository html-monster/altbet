import React from 'react';

// import {DateLocalization} from './../../models/DateLocalization';
import {Common} from './../../common/Common';
import AnimateOnUpdate from '../Animation';


export default class ButtonContainer extends React.Component
{
    render()
    {
        const { data:{ isBasicMode, isTraiderOn }, mainContext } = this.props;
        // let $DateLocalization = new DateLocalization();
        const data = this.props.data;
    // console.log(data);
        let price, className, emptyBtnName, mirrorClass;

        // 0||console.debug( 'this.props.actions', this.props.actions );

        if( data.ismirror )
        {
            mirrorClass = 'mirror';
            // price = (1 - (isBasicMode ? item.Price : item.Price));
        }
        else
        {
            mirrorClass = 'real';
            // price = isBasicMode ? item.Price : item.Price;
        } // endif


        if( data.type === 'sell' )
        {
            className = 'sell';
            emptyBtnName = _t('buy');
        }
        else
        {
            className = 'buy';
            emptyBtnName = _t('sell');
        } // endif
        // 0||console.debug( 'data', data );


        return <div className={`${className} button-container`}>
            {
                (data.Orders.length && data.Orders.some((item) => item.Side === data.side) ?
                        data.Orders.map((item) =>
                        {
                            let SummaryPositionPrice = item.SummaryPositionPrice.slice();
                            data.ismirror && SummaryPositionPrice.reverse();

                            let html = [];
                            if( item.Side === data.side )
                            {
                                html = SummaryPositionPrice.map((item2) =>
                                    <AnimateOnUpdate key={item2.Price}
                                        component="div"
                                        className="button"
                                        transitionName={{
                                            enter: 'fadeOut',
                                            appear: 'fadeOut'
                                        }}
                                        transitionAppear={true}
                                        transitionLeave={false}
                                        transitionAppearTimeout={800}
                                        transitionEnterTimeout={800}
                                        data={item2}
                                    >
                                        <button className={`event animated ${className} ${mirrorClass} not-sort`} onClick={this._onBtnClick.bind(this, mainContext,
                                                {
                                                    PosPrice: item.SummaryPositionPrice,
                                                    ismirror: data.ismirror,
                                                    price: (price = isBasicMode ? item2.Price : item2.Price),
                                                    quantity: item2.Quantity,
                                                    type: data.type === "sell" ? 1 : 2,
                                                    data: data,
                                                })}
                                                 data-verify="Quantity" /*disabled={isTraiderOn}*/ title="Click to place entry">
                                            <span className="price">{((price = Common.toFixed(data.ismirror ? 1 - price : price, 2))||true) && isBasicMode  ? '$' + price : price}</span>
                                            <span className="volume">{item2.Quantity}</span>
                                            {/*<div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>*/}
                                        </button>
                                    </AnimateOnUpdate>
                                );
                                    {/*</div>*/}
                            }
                            else html = '';
                            return html;
                        })
                        : <div className="button">
                        <button className={`event animated empty ${className} ${mirrorClass} not-sort`} onClick={this._onBtnClick.bind(this, mainContext,
                                {
                                    isempty: true,
                                    PosPrice: [],
                                    ismirror: data.ismirror,
                                    price: 0,
                                    type: data.type === "sell" ? 1 : 2,
                                    data: data,
                                })}
                                /*disabled={isTraiderOn}*/ title="Click to place entry">
                            <span className="price empty">{emptyBtnName}</span>
                            <div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>
                        </button>
                    </div>
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


    _onBtnClick(mainContext, props)
    {
        // 0||console.debug( 'props', props, this.props.actions );
        this.props.actions.actionOnPosPriceClick(mainContext, props);
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
