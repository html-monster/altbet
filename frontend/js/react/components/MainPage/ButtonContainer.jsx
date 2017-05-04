import React from 'react';

// import {DateLocalization} from './../../models/DateLocalization';
import {Common} from './../../common/Common';
import AnimateOnUpdate from '../Animation';


export default class ButtonContainer extends React.Component
{
    render()
    {
        const { data, data:{ isBasicMode, isExpertMode, isTraiderOn }, mainContext } = this.props;
        // let $DateLocalization = new DateLocalization();
    // console.log(data);
        let price, className, emptyBtnName, mirrorClass, btnsPreviewClass = "", side1 = 0, side2 = 1;


        if( data.ismirror )
        {
            mirrorClass = 'mirror';
            side1 = 1;
            side2 = 0;
        }
        else
        {
            mirrorClass = 'real';
            // price = isBasicMode ? item.Price : item.Price;
        } // endif

        // check for bets
        let items1 = data.Orders.some((item) => item.Side === side1);
        let items2 = data.Orders.some((item) => item.Side === side2);


        // left buttons
        if( data.type === 'sell' )
        {
            className = 'sell';
            emptyBtnName = 'trade';

            // check for bets
            if( items1 && !items2 ) btnsPreviewClass = "onebtn";
            else if (!items1 && !items2) btnsPreviewClass = "nobets";
            else btnsPreviewClass = "hideall";
        }
        else
        {
            className = 'buy';
            emptyBtnName = 'trade';

            // check for bets
            if( items2 ) btnsPreviewClass = "onebtn";
            else if( items1 && !items2 ) btnsPreviewClass = "hideall";
            if( !items1 && !items2 ) btnsPreviewClass = "nobets";
        } // endif



        return <div className={`${className} button-container ${btnsPreviewClass}`}>
            {
                (data.Orders.length && data.Orders.some((item) => item.Side === data.side) ?
                        data.Orders.map((item) =>
                        {
                            let SummaryPositionPrice = item.SummaryPositionPrice.slice();
                            // data.ismirror && SummaryPositionPrice.reverse();

                            let html = [];

                            if( item.Side === data.side )
                            {
                                for( let jj = 0, ii = 0, countii = 3; jj < countii; jj++ )
                                {
                                    ii = data.ismirror ? countii - (jj + 1) : jj;
                                    let item2 = SummaryPositionPrice[ii];
                                    if( item2 )
                                    {
                                        let price = item2.Price;
                                        html.push(<AnimateOnUpdate key={item2.Price}
                                                component="div"
                                                className="button"
                                                transitionName={{
                                                    enter: 'updateAnimation',
                                                    appear: 'updateAnimation'
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
                                                            price: (price),
                                                            quantity: item2.Quantity,
                                                            type: data.type === "sell" ? 1 : 2,
                                                            data: data,
                                                        })}
                                                         data-verify="Quantity" /*disabled={isTraiderOn}*/ title="Click to place entry">
                                                    <span className="price">{Common.toFixed(data.ismirror ? 1 - price : price, 2)}</span>
                                                    <span className="volume">{item2.Quantity}</span>
                                                    {/*<div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>*/}
                                                </button>
                                            </AnimateOnUpdate>);
                                    }
                                    else
                                    {
                                        html.push(<div key={jj} className="button">
                                                <button className={`event animated ${className} ${mirrorClass} empty-balvan`}>
                                                    <span className="price">{}</span>
                                                    <span className="volume">{}</span>
                                                </button>
                                            </div>);
                                    } // endif

                                // html = SummaryPositionPrice.map((item2) =>
                                // );
                                } // endfor
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
                                //style={data.type === "sell" && !data.Orders.length ? {display: 'none'} :  data.type === "buy" && !data.Orders.length ? {marginLeft: -24} : {} }
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
