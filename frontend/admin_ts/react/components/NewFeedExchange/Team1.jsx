/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;


export class Team1 extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    render()
    {
        const { data, teamNum, actions } = this.props;

        return (
            <div className="h-team">
                <label>Players team {teamNum}</label>
                <table className="table">
                    <thead>
                    <tr>
                        <th>{}</th>
                        <th>POS</th>
                        <th>Team</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    { data.length ?
                        data.map((itm, key) =>
                            <tr key={key}>
                                <td> {key + 1} </td>
                                <td> {itm.Position} </td>
                                <td> {itm.Team} </td>
                                <td> {itm.Name} </td>
                                <td> {itm.Status} </td>
                                <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: itm, team: teamNum})} title="Remove player"><i className="fa fa-remove -red">{}</i> remove</button></td>
                            </tr>
                        )
                        : <tr><td colSpan="5"><i>No players yet, please, add...</i></td></tr>
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}