import React from 'react';

import ButtonContainer from './ButtonContainer';
import {DateLocalization} from './../../models/DateLocalization';
// import {Common} from './../../common/Common';


export default class ExchangeItem extends React.Component
{
    componentDidMount()
    {
	    $('[data-js-lineup]:not(.has-click)').click((ee) =>
	    {
            if (!$(ee.target).hasClass('active') && $('[data-js-lineup].active').length) this.onLineupOpen('[data-js-lineup].active');
            this.onLineupOpen(ee.target);
	    }).addClass('has-click');
	    // 0||console.log( '999999999999999', $('.show-schedule') );
    }


    render()
    {
        // let  = ABpp.config.basicMode;
        const { actions, data:{ activeExchange, isBasicMode, isTraiderOn }, mainContext  } = this.props;
        const data = this.props.data;
        const symbol = `${data.Symbol.Exchange}_${data.Symbol.Name}_${data.Symbol.Currency}`;
        let $DateLocalization = new DateLocalization();
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
        let $classActive = '', $classActiveNM = '', $classActiveM = '';
        if( data.activeExchange.name === data.Symbol.Exchange )
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
                {data.Symbol.Status === 2 ? <i className="half_time" title="Completed">ht<span>Completed</span></i> : ""}
            </div>
            <div className="content_title command">
                <h2>{data.Symbol.HomeName} {(data.Symbol.HomePoints !== null) ? <span>({data.Symbol.HomePoints})</span> : '' }</h2>
                <h2>{data.Symbol.AwayName} {(data.Symbol.AwayPoints !== null) ? <span>({data.Symbol.AwayPoints})</span> : ''}</h2>
                <span className="symbol_name hidden">{symbol}</span>
            </div>
            <div className="table not-sort wave waves-effect waves-button"> {/*id="exchange_table"*/}
                <div className={"event-content" + $classActiveNM} data-symbol={symbol} data-id={data.Symbol.Exchange} data-mirror="0"
                    onClick={() => {ABpp.config.tradeOn && actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: false,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                {/*<div className="event-content" data-symbol={symbol} onClick={this._onEventContentClick.bind(this, data)}>*/}
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.HomeName}</span>
                        <span>{(data.Symbol.HomeHandicap !== null ? (data.Symbol.HomeHandicap > 0 ? " +" + data.Symbol.HomeHandicap : " " + data.Symbol.HomeHandicap) : false)}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "0"}>see more</a>
                    </h3>

                    <div className="container">

                        <ButtonContainer actions={actions} mainContext={mainContext} data={{
                            type: 'sell',
                            side: 0,
                            ismirror: false,
                            ...commProps
                        }}/>
                        <ButtonContainer actions={actions} mainContext={mainContext} data={{
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
                                    if( data.Positions !== 0 )
                                    {
                                        let $class;
                                        if (data.GainLoss < 0) $class = 'lose';
                                        else if (data.GainLoss > 0) $class = 'win';

                                        return <strong style={{'marginTop': 3}}>P/L: <span className={$class}>{data.GainLoss ?
											data.GainLoss < 0 ? `($${Math.abs(data.GainLoss)})` :  '$' + data.GainLoss
											:
                                            0}</span></strong>;
                                    } // endif
                                }()
                            }
                        </div>
                    </div>
                </div>


                <div className={"event-content revers" + $classActiveM} data-symbol={symbol + "_mirror"} data-id={data.Symbol.Exchange} data-mirror="1"
                    onClick={() => {ABpp.config.tradeOn && actions.exchangeSideClick({name: data.Symbol.Exchange,
                        isMirror: true,
                        title: [data.Symbol.HomeName, data.Symbol.AwayName],
                        symbol: symbol,
                    })}}
                >
                    <h3 className="event-title">
                        <span className="title">{data.Symbol.AwayName}</span>
                        <span>{(data.Symbol.AwayHandicap !== null ? (data.Symbol.AwayHandicap > 0 ? " +" + data.Symbol.AwayHandicap : " " + data.Symbol.AwayHandicap) : "")}</span>
                        <a href={ABpp.baseUrl + data.CategoryUrl + "1"}>see more</a>
                    </h3>

                    <div className="container">
                        <ButtonContainer actions={actions} mainContext={mainContext} data={{
                            type: 'sell',
                            side: 1,
                            ismirror: true,
                            symbolName: symbol,
                            Orders: data.Orders,
                            ...commProps
                        }}/>

                        <ButtonContainer actions={actions} mainContext={mainContext} data={{
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

                <button className="show-schedule" data-js-lineup="" title="Show chart">{}</button>
                <div className="h-lup schedule loader not-sort">
                    <div className="tabs">
                        <div className="h-lup__tab h-lup__tab_1 tab" title="Show teams info">Lineups</div>
                        <div className="h-lup__tab h-lup__tab_2 tab" title="Show chart info">Chart</div>
                    </div>
                    <div className="h-lup__tab_content tab_content">
                        <div className="h-lup__lineup tab_item">
                            <div className="l-team">
                                <div className="l-team__title">Arsenal (+27.1)</div>
                                <table className="l-team__team">
                                    <tr>
                                        <th>Pos</th>
                                        <th className="pl">Name</th>
                                        <th>Status</th>
                                        <th>FPPG</th>
                                        <th>Score</th>
                                    </tr>
                                    <tr><td>FWD</td><td className="pl">John Doe</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>FWD</td><td className="pl">Romelu Lukaku</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>FWD</td><td className="pl">Zlatan Ibrahimovic</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>FWD</td><td className="pl">Juan Mata</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Marcus Rashford</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Paul Pogba</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Anthony Martial</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>DEF</td><td className="pl">Jamie Vardy</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>DEF</td><td className="pl">Wayne Rooney</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>GK</td><td className="pl"> Riyad Mahrez</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                </table>
                                <div className="l-team__total">
                                    Total score: <b>126</b><br />
                                    Difference: <b>+32</b>
                                </div>
                            </div>
                            <div className="l-team">
                                <div className="l-team__title">Chelsea (-27.1)</div>
                                <table className="l-team__team">
                                    <tr>
                                        <th>Pos</th>
                                        <th className="pl">Name</th>
                                        <th>Status</th>
                                        <th>FPPG</th>
                                        <th>Score</th>
                                    </tr>
                                    <tr><td>FWD</td><td className="pl">Gareth Barry</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>FWD</td><td className="pl">Paul Robinson</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>FWD</td><td className="pl">Eric Bailly</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Robbie Brady</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Chris Brunt</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>MID</td><td className="pl">Ashley Williams</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>DEF</td><td className="pl">Isaac Success</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>DEF</td><td className="pl">Jake Livermore</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>DEF</td><td className="pl">Marouane Fellaini</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                    <tr><td>GK</td><td className="pl"> Morgan Schneiderlin</td><td>Act</td><td>24.7</td><td>15.9</td></tr>
                                </table>
                                <div className="l-team__total">
                                    Total score: <b>158</b><br />
                                    Difference: <b>-32</b>
                                </div>
                            </div>
                        </div>

                        <div className="tab_item" id={"container_" + symbol}>{}</div>
                        {/*<img src="~/Images/chart_white.svg" alt=""/>*/}
                    </div>
                </div>
                <a href="#" className="add_favorite" title="Add to favorite">{}</a>
            </div>
        </div>;
    }


    /**
     * show chart on the main page
     * @private
     * @param that - opener
     */
    onLineupOpen(that)
    {
        0||console.log( 'here', 0 );

        // this.onLineupOpen($("[data-js-lineup].active"));


        var $that = $(that);

		$that.toggleClass('active')
					 .next().toggleClass('active');
		$that.closest('.table').toggleClass('active');

        var $contentTitle = $that.closest('.content_bet').find('.content_title');
		if ($that.hasClass('active'))
        {
            $contentTitle.css('max-height', 'inherit');
        }
		else
		{
			setTimeout(() => { $contentTitle.removeAttr('style'); }, 400);
		}

		if($('[data-js-lineup]').hasClass('active'))
			globalData.MainCharOn = true;
		else
			globalData.MainCharOn = false;
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
