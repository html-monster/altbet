import React from 'react';

// import {DateLocalization} from './../../models/DateLocalization';
import {Common} from './../../common/Common';
import AnimateOnUpdate from '../Animation';
import classnames from 'classnames';

export default class ButtonContainer extends React.PureComponent
{
    render()
    {
        const { data, data:{ isBasicMode, isExpertMode, isTraiderOn, orderPrice, showOrder }, mainContext } = this.props;
        // let $DateLocalization = new DateLocalization();
    // console.log(data);
        let price, className, emptyBtnName, mirrorClass, btnsPreviewClass = "", side1 = 0, side2 = 1;
        let debug = "";

        // console.log('props:', this.props);

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
            // if( items1 && !items2 ) btnsPreviewClass = "onebtn";
            if (!items1 && !items2) btnsPreviewClass = "nobets";
            // else btnsPreviewClass = "hideall";
        }
        else
        {
            className = 'buy';
            emptyBtnName = 'trade';

            // check for bets
            // if( items2 ) btnsPreviewClass = "onebtn";
            // else if( items1 && !items2 ) btnsPreviewClass = "hideall";
            if( !items1 && !items2 ) btnsPreviewClass = "nobets";
        } // endif

        return <div className={`${className} button-container ${btnsPreviewClass}`}>
            {/*<span style={{position: "absolute", zIndex: "1", left: "0", top: "0"}}>{data.type}</span>*/}
            {
                (data.Orders.length && data.Orders.some((item) => item.Side === data.side) ?
                    data.Orders.map((item) =>
                    {
                        let SummaryPositionPrice = item.SummaryPositionPrice.slice();
                        // data.ismirror && SummaryPositionPrice.reverse();
                        if (data.type === 'sell' && !data.ismirror || data.type !== 'sell' && data.ismirror) SummaryPositionPrice.reverse();

                        let html = [];

                        if( item.Side === data.side )
                        {
                            for( let jj = 0, ii = 0, countii = 3; jj < countii; jj++ )
                            {
                                ii = data.type === 'sell' ? countii - (jj + 1) : jj;
                                // ii = jj;
                                let item2 = SummaryPositionPrice[ii];
                                if( item2 )
                                {
                                    let price = Common.toFixed(data.ismirror ? 1 - item2.Price : item2.Price, 2);
                                    html.push(<AnimateOnUpdate key={item2.Price}
                                            component="div"
                                            className={classnames(`button`, {order_open: showOrder && +orderPrice === item2.Price})}
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
                                            <button className={`event animated ${className} ${mirrorClass} not-sort`}
                                                    onClick={this._onBtnClick.bind(this, mainContext,
                                                    {
                                                        PosPrice: item.SummaryPositionPrice,
                                                        ismirror: data.ismirror,
                                                        price: item2.Price,
                                                        quantity: item2.Quantity,
                                                        type: data.type === "sell" ? 1 : 2,
                                                        data: data,
                                                    })}
                                                    data-verify="Quantity" /*disabled={isTraiderOn}*/ title={data.btnDisabled ? '' : 'Click to place entry'}>
                                                <span className="price">{price}</span>
                                                <span className="volume">{item2.Quantity}</span>
                                                {/*<div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>*/}
                                            </button>
                                        </AnimateOnUpdate>);
                                }
                                else
                                {
                                    html.push(<div key={jj} className="button empty-balvan">
                                            <button className={`event animated ${className} ${mirrorClass} empty-balvan`} disabled={true}>
                                                <span className="price">{}</span>
                                                <span className="volume">{}</span>
                                            </button>
                                        </div>);
                                } // endif
                            } // endfor
                        }
                        else html = [];
                        return html;
                    })
                    :
                    (do {
                        let html = [
                        <div className={classnames(`button`, {order_open: showOrder && orderPrice === '0.'})} key="0">
                            <button className={`event animated empty ${className} ${mirrorClass} not-sort`} onClick={this._onBtnClick.bind(this, mainContext,
                                    {
                                        isempty: true,
                                        PosPrice: [],
                                        ismirror: data.ismirror,
                                        price: 0,
                                        type: data.type === "sell" ? 1 : 2,
                                        data: data,
                                    })}
                                    title={data.btnDisabled ? '' : 'Click to place entry'} >
                                <span className="price empty">{emptyBtnName}</span>
                                <div className="symbolName" style={{display: 'none'}}>{data.symbol}</div>
                            </button>
                        </div>
                        ,
                        <div className="button empty-balvan" key="1">
                            <button className={`event animated ${className} ${mirrorClass} empty-balvan`} disabled={true}>
                                <span className="price">{}</span>
                                <span className="volume">{}</span>
                            </button>
                        </div>
                        ,
                        <div className="button empty-balvan" disabled={true} key="2">
                            <button className={`event animated ${className} ${mirrorClass} empty-balvan`} disabled={true}>
                                <span className="price">{}</span>
                                <span className="volume">{}</span>
                            </button>
                        </div>];

                        // no bets no btns
                        if( !items1 && !items2 && data.type === 'sell' ) null;
                        else if( !items1 && !items2 && data.type !== 'sell' ) html[0];
                        // additional empty btns
                        else data.type === 'sell' ? html.reverse() : html;
                        // else { if (data.type === 'sell') debug = "debug"; data.type === 'sell' ? html.reverse() : html; }
                    })
                )
            }
            {/*{debug ? <span style={{position: "absolute", zIndex: "1", left: "0", top: "0"}}>{debug}</span>:""}*/}
        </div>;
    }


    _onBtnClick(mainContext, props)
    {
        // 0||console.debug( 'props', props, this.props.actions );
        const inGame = true, isEventStarted = +moment().format('x') > (this.props.data.exdata.StartDate).split('+')[0].slice(6),
            isEventClosed = this.props.data.exdata.EndDate && +moment().format('x') > (this.props.data.exdata.EndDate).split('+')[0].slice(6);

		if(!inGame && isEventStarted || isEventClosed)
            defaultMethods.showWarning('This game is closed, please try another');
        else
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
