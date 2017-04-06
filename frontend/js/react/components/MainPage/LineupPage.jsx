import React from 'react';

import {Popup} from "../../models/Popup.ts"


export class LineupPage extends React.PureComponent
{
    // constructor(props)
    // {
    //     super(props);
    //
    //     this.state = {};
    // }

    render()
    {
        const { className, exdata, data } = this.props;
        var date;


        return <div className={"l-lup " + className} data-js-team="">
                <div className="l-lup__rules"><a href="#" className="l-lup__link text_decoration" onClick={::this._onRaSClick}>Rules & scoring</a></div>
                <div className="l-team">
                    <div className="l-team__title">Arsenal (+27.1)</div>
                    <table className="l-team__team">
                        <tbody>
                            <tr>
                                <th>{}</th>
                                <th>Pos</th>
                                <th className="pl">Name</th>
                                <th>Status</th>
                                <th>FPPG</th>
                                <th>Score</th>
                                <th title="Time remaining">Time</th>
                            </tr>
                            {
                                data.team1.map((itm, key) =>
                                <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td className="pos">
                                        {itm.pos}
                                        <div className="b-pl-info">
                                            <div className="b-pl-info__main-inf">{`${exdata.HomeAlias} vs ${exdata.AwayAlias} ${((date = exdata.StartDate) ? date.unixToLocalDate({format: 'h:mm a MMM DD, Y'}) : "")}`}</div>
                                            <div className="b-pl-info__statistic">{itm.plInfo.action}</div>
                                        </div>
                                    </td>
                                    <td className="pl">{itm.name}</td><td>{itm.status}</td><td>{itm.fppg}</td><td>{itm.score}</td>
                                    <td title="Time remaining">{moment(moment(itm.timeEnd).diff(Date.now())).format("HH:mm")}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                <div className="l-team">
                    <div className="l-team__title">Chelsea (-27.1)</div>
                    <table className="l-team__team">
                        <tbody>
                            <tr>
                                <th>{}</th>
                                <th>Pos</th>
                                <th className="pl">Name</th>
                                <th>Status</th>
                                <th>FPPG</th>
                                <th>Score</th>
                                <th title="Time remaining">Time</th>
                            </tr>
                            {
                                data.team2.map((itm, key) => <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td className="pos">
                                        {itm.pos}
                                        <div className="b-pl-info">
                                            <div className="b-pl-info__main-inf">{`${exdata.HomeAlias} vs ${exdata.AwayAlias} ${((date = exdata.StartDate) ? date.unixToLocalDate({format: 'h:mm a MMM DD, Y'}) : "")}`}</div>
                                            <div className="b-pl-info__statistic">{itm.plInfo.action}</div>
                                        </div>
                                    </td>
                                    <td className="pl">{itm.name}</td><td>{itm.status}</td><td>{itm.fppg}</td><td>{itm.score}</td>
                                    <td title="Time remaining">{moment(moment(itm.timeEnd).diff(Date.now())).format("HH:mm")}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>

                <div className="b-clear">{}</div>
                <div className="l-team">
                    <div className="l-team__total">
                        Total score: <b>{data.t1TotScore}</b><br />
                        Difference: <b>{data.t1Diff}</b>
                    </div>
                </div>
                <div className="l-team">
                    <div className="l-team__total">
                        Total score: <b>{data.t2TotScore}</b><br />
                        Difference: <b>{data.t2Diff}</b>
                    </div>
                </div>
                <div className="b-clear">{}</div>
            </div>;
    }


    _onRaSClick()
    {
	    new Popup({
            render: true,
            vars: {
                contentHtml: $("[data-js-rules]").html(),
            },
            // callbackOK: (inProps) => actions.actionOnCloseOutClick({symbol, ...inProps}),
	    });
    }
}