import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    render()
    {
        // let  = ABpp.config.basicMode;
        let $DateLocalization = new DateLocalization();
        let {activeExchange, isBasicMode, isTraiderOn} = this.props.data;
        let data = this.props.data;
        let symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
        let date;

        // common props for button container
        let commProps = {
            isTraiderOn: isTraiderOn,
            isBasicMode: isBasicMode,
            symbolName: symbol,
            Orders: data.Orders,
            exdata: {
                HomeName : data.Symbol.HomeName,
                AwayName : data.Symbol.AwayName,
                Positions : data.Positions,
                Exchange : data.Symbol.Exchange,
                Name : data.Symbol.Name,
                Currency : data.Symbol.Currency,
            }
        };

        // data.activeExchange.name == data.Symbol.Exchange&&console.debug( 'data.Symbol', data.activeExchange, data.Symbol.Exchange, data.activeExchange.name == data.Symbol.Exchange );
        // activate current exchange
        var $classActive = '', $classActiveNM = '', $classActiveM = '';
        if( data.activeExchange.name == data.Symbol.Exchange )
        {
            $classActive = ' active';
            if( !data.activeExchange.isMirror ) $classActiveNM = ' active';
            else $classActiveM = ' active';
        } // endif


        return <div className={"content_bet not-sort categoryFilterJs" + (isBasicMode ? " basic_mode_js" : "") + $classActive + (isTraiderOn ? " clickable" : "")} id={symbol}>{/**/}{/*@(ViewBag.FilterId != null ? (Model.CategoryList.Contains(ViewBag.FilterId) ? 'display:flex;' : 'display:none;') : 'display:flex;')*/}
            <input name={data.Symbol.Status} type="hidden" value="inprogress" />

            <div className={"event_info " + data.CategoryIcon}>
                <span className="date">
                    {(date = $DateLocalization.fromSharp(data.Symbol.StartDate, 0, {TZOffset: false}).unixToLocalDate({format: 'DD MMM Y'})) ? date : ''}
                    {/*- {(date = $DateLocalization.fromSharp(data.Symbol.EndDate, 0, {TZOffset: false}).unixToLocalDate({format: 'H:mm'})) ? date : ''}*/}
                </span>
                {data.Symbol.Status == 2 ? <i className="half_time" title="Completed">ht<span>Completed</span></i> : ""}
            </div>
            <div className="content_title command">
                <h2>{data.Symbol.HomeName} {(data.Symbol.HomePoints != null) ? <span>({data.Symbol.HomePoints})</span> : '' }</h2>
                <h2>{data.Symbol.AwayName} {(data.Symbol.AwayPoints != null) ? <span>({data.Symbol.AwayPoints})</span> : ''}</h2>
                <span className="symbol_name hidden">{symbol}</span>
            </div>
            <div className="table not-sort wave waves-effect waves-button"> {/*id="exchange_table"*/}
                <div className={"event-content" + $classActiveNM} data-symbol={symbol} data-id={data.Symbol.Exchange} data-mirror="0"
                    onClick={() => {ABpp.config.tradeOn && this.props.actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: false,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                {/*<div className="event-content" data-symbol={symbol} onClick={this._onEventContentClick.bind(this, data)}>*/}
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.HomeName}</span>
                        <span>{(data.Symbol.HomeHandicap != null ? (data.Symbol.HomeHandicap > 0 ? " +" + data.Symbol.HomeHandicap : " " + data.Symbol.HomeHandicap) : false)}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "0"}>see more</a>
                    </h3>

                    <div className="container">

                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'sell',
                            side: 0,
                            ismirror: false,
                            ...commProps
                        }}/>
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'buy',
                            side: 1,
                            ismirror: false,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>
                        <div className="pl mode_info_js">
                            {
                                function() {
                                    if( data.Positions != 0 )
                                    {
                                        let $class;
                                        if (data.GainLoss < 0) $class = 'lose';
                                        else if (data.GainLoss > 0) $class = 'win';

                                        return <strong style={{'marginTop': 3}}>P/L: <span className={$class}>(${data.GainLoss ? Math.abs(data.GainLoss) : 0})</span></strong>;
                                    } // endif
                                }()
                            }
                        </div>
                    </div>
                </div>


                <div className={"event-content revers" + $classActiveM} data-symbol={symbol + "_mirror"} data-id={data.Symbol.Exchange} data-mirror="1"
                    onClick={() => {ABpp.config.tradeOn && this.props.actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: true,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.AwayName}</span>
                        <span>{(data.Symbol.AwayHandicap != null ? (data.Symbol.AwayHandicap > 0 ? " +" + data.Symbol.AwayHandicap : " " + data.Symbol.AwayHandicap) : "")}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "1"}>see more</a>
                    </h3>

                    <div className="container">
                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'sell',
                            side: 1,
                            ismirror: true,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>

                        <ButtonContainer actions={this.props.actions} data={{
                            type: 'buy',
                            side: 0,
                            ismirror: true,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>

                        <div className="pos mode_info_js">
                            <strong style={data.Positions != 0 ? {'marginTop': 3} : {}}>Pos: <span>{data.Positions != 0 && data.Positions}</span></strong>
                        </div>
                    </div>
                </div>

                <button className="show-schedule" title="Show chart"></button>
                <div className="schedule loader not-sort">
                    <div id={"container_" + symbol}></div>
                    {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                </div>
                <a href="#" className="add_favorite" title="Add to favorite"></a>
            </div>
        </div>;
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
