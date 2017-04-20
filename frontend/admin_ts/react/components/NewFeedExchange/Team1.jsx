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
        const { data, teamNum } = this.props;

        return (
            <div className="h-team">
                <label>Players team {teamNum}</label>
                <table className="table">
                    <thead>
                    <tr>
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
                                <td> {itm.Position} </td>
                                <td> {itm.Team} </td>
                                <td> {itm.Name} </td>
                                <td> {itm.Status} </td>
                                <td><button className="btn btn-default -btn-default btn-xs" data-url="/AltBet.Admin/Category/NewCategory?category=fantasy-sport" title="Remove player"><i className="fa fa-remove">{}</i> remove</button></td>
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