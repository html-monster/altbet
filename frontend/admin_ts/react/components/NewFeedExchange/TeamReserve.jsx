/**
 * Created by Vlasakh on 15.06.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';


export class TeamReserve extends React.Component
{
    render()
    {
        const { players, teamNum, actions } = this.props;
        // 0||console.log( 'da', data );

        return (
            <div className="h-team">
                <label>Reserve players team {teamNum}</label>
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
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    { players.length ?
                        players.map((itm, key) =>
                            <tr key={key}>
                                <td> {key+1} </td>
                                <td> {itm.Position} </td>
                                <td> {itm.Team} </td>
                                <td> {itm.Name} </td>
                                <td><NumericInput className="eppg" value={itm.Eppg} precision={2} onChange={this._onPPGChange.bind(this, {player: itm, team: `PlayersTeam${teamNum}Reserve`, type: 'Eppg'})} style={ false } /></td>
                                <td><NumericInput className="fppg" value={itm.Fppg} precision={2} onChange={this._onPPGChange.bind(this, {player: itm, team: `PlayersTeam${teamNum}Reserve`, type: 'Fppg'})} style={ false } /></td>
                                <td> {itm.Status} </td>
                                <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: itm, team: teamNum, used: itm.used})} title="Remove player"><i className="fa fa-remove -red">{}</i></button></td>
                            </tr>)
                        :
                        <tr className="empty">
                            <td/>
                            <td colSpan="5"><i>Add players to reserve...</i></td>
                        </tr>
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