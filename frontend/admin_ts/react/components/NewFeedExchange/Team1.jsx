/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';


export class Team1 extends React.Component
{
/*
    constructor(props)
    {
        super(props);
    }
*/


    render()
    {
        const { data, positions, teamNum, actions, uplayerdata: {uniPositionIndex, uniPositionName} } = this.props;
        let jj = 0, kk = 1;
        // 0||console.log( 'da', data );

        return (
            <div className="h-team">
                <table class="table teams-table">
                    <thead>
                    <tr>
                        <th>{}</th>
                        <th>POS</th>
                        <th>Team</th>
                        <th>Name</th>
                        <th>EPPG</th>
                        <th>FPPG</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    { positions.map((itm) =>
                        do {
                            let ret = [];
                            for( let ii = 0; ii < itm.Quantity; ii++ )
                            {
                                if( data[jj] && data[jj].Index == itm.Index )
                                {
                                    ret.push(<tr key={itm.Name + ii}>
                                        <td> {kk++} </td>
                                        <td> {itm.Name === uniPositionName ? <span title="Universal player">UP ({data[jj].meta.PositionOrig})</span> : data[jj].Position} </td>
                                        <td> {data[jj].Team} </td>
                                        <td> {data[jj].Name} </td>
                                        <td><NumericInput className="eppg" value={data[jj].Eppg} precision={2} onChange={this._onPPGChange.bind(this, {player: data[jj], team: "PlayersTeam"+teamNum, type: 'Eppg'})} style={ false } /></td>
                                        <td><NumericInput className="fppg" value={data[jj].Fppg} precision={2} onChange={this._onPPGChange.bind(this, {player: data[jj], team: "PlayersTeam"+teamNum, type: 'Fppg'})} style={ false } /></td>
                                        <td> {data[jj].Status} </td>
                                        <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: data[jj], team: teamNum, used: data[jj].used})} title="Remove player"><i className="fa fa-remove -red">{}</i></button></td>
                                    </tr>);
                                    jj++;
                                }
                                else
                                {
                                    ret.push(<tr className="empty">
                                        <td>{}</td>
                                        <td>{itm.Name === uniPositionName ? <span title="Universal player">UP</span> : itm.Name}</td>
                                        <td colSpan="5"><i>Add player to this position...</i></td>
                                    </tr>)
                                } // endif
                            } // endfor

                            ret;
                        })
                    }
                    </tbody>
                </table>
            </div>
        );
    }


    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    /**@private*/ _onPPGChange(props, num, p1)
    {
        // if (num) this.props.actions.actionPPGValues({player, team, type, num});
        if (num) this.props.actions.actionPPGValues({...props, num});
    }
}