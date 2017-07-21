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
        const { players, name, positions, teamNum, TeamDefence, TimeEvent, actions, uplayerdata: {uniPositionIndex, uniPositionName} } = this.props.data;
        let jj = 0, kk = 1;
        // 0||console.log( 'da', data );
        let Defence = {};
        TimeEvent.forEach((val) => {
            if (val.HomeId === TeamDefence.TeamId) Defence = {name: val.HomeTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
            if (val.AwayId === TeamDefence.TeamId) Defence = {name: val.AwayTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
        });

        return (
            <div className="h-team">
                <label>Team {teamNum} name</label>
                <div class="input-group">
                    <input className="form-control" type="text" name={`team${teamNum}name`} value={name} onChange={::this._onChangeTeamName} />
                    <span class="input-button input-group-addon"><button type="button" className="btn btn-default btn-xs" onClick={::this._onGenerateTeamName} title="Generate team name"><i class="fa fa-repeat"/></button></span>
                </div>
{/*
                <div className="form-group">
                </div>
*/}

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
                                if( players[jj] && players[jj].Index == itm.Index )
                                {
                                    ret.push(<tr key={itm.Name + ii}>
                                        <td> {kk++} </td>
                                        <td> {itm.Name === uniPositionName ? <span title="Universal player">UP ({players[jj].meta.PositionOrig})</span> : players[jj].Position} </td>
                                        <td> {players[jj].Team} </td>
                                        <td> {players[jj].Name} </td>
                                        <td><NumericInput className="eppg" value={players[jj].Eppg} precision={2} onChange={this._onPPGChange.bind(this, {player: players[jj], team: "PlayersTeam"+teamNum, type: 'Eppg'})} style={ false } /></td>
                                        <td><NumericInput className="fppg" value={players[jj].Fppg} precision={2} onChange={this._onPPGChange.bind(this, {player: players[jj], team: "PlayersTeam"+teamNum, type: 'Fppg'})} style={ false } /></td>
                                        <td> {players[jj].Status} </td>
                                        <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: players[jj], team: teamNum, used: players[jj].used})} title="Remove player"><i className="fa fa-remove -red">{}</i></button></td>
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

                {Defence.name ?
                    <div className="defence">
                        <b>Defence</b>: <span title={`From event “${Defence.event}”`}>{Defence.name}</span>
                    </div>
                    :
                    <div className="defence"><b>Defence</b>: <i>Not set, please, choose a command for defence</i></div>
                }
            </div>
        );
    }


    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    /**@private*/ _onPPGChange(props, num, p1)
    {
        // if (num) this.props.actions.actionPPGValues({player, team, type, num});
        if (num) this.props.data.actions.actionPPGValues({...props, num});
    }


    /**@private*/ _onChangeTeamName(ee)
    {
        const { actions, teamNum } = this.props.data;
        actions.actionChangeTeamName({name: ee.target.value, teamNum});
    }


    /**@private*/ _onGenerateTeamName(ee)
    {
        const { actions, teamNum } = this.props.data;
        actions.actionGenerateTeamName({teamNum});
    }
}