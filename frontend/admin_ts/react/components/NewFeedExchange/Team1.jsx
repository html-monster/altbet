/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';


export class Team1 extends React.Component
{
    /**@private*/ tablTeam;
/*
    constructor(props)
    {
        super(props);
    }
*/

    componentDidMount()
    {
        $(this.tablTeam).on('focus', '.js-eppg, .js-fppg', function() { $(this).select(); } );
    }


    render()
    {
        const { players, name, positions, teamNum, TeamDefence, Rules, actions, uplayerdata: {uniPositionIndex, uniPositionName}, TeamSize } = this.props.data;
        let jj = 0, kk = 1;


        return (
            <div className="h-team">
                <div className="form-horizontal">
                    <label className="col-sm-4 control-label">{Rules.teamLabels[teamNum]} name</label>
                    <div class="col-sm-8 input-group">
                        <input className="form-control" type="text" name={`team${teamNum}name`} value={name} onChange={::this._onChangeTeamName} />
                        {/*<span class="input-button input-group-addon"><button type="button" className="btn btn-default btn-xs" onClick={::this._onGenerateTeamName} title="Generate team name"><i class="fa fa-repeat"/></button></span>*/}
                        <div class="btn-group input-button -dropdown input-group-addon">
                            <button type="button" class="btn btn-default btn-xs" onClick={this._onGenerateTeamName.bind(this, {})}><i class="fa fa-repeat"/></button>
                            <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false">
                                <span class="caret"></span>
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu">
                                {players.map(val =>
                                    <li key={val.PlayerId}><a href="#" onClick={this._onGenerateTeamName.bind(this, {Name: val.Name, Team: val.Team})}>({val.Position}) <b>Team {val.Name.split(' ')[1].trim()}, {val.Team}</b></a></li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
{/*
                <div className="form-group">
                </div>
*/}

                <table ref={(val) => this.tablTeam = val} class="table teams-table">
                    <thead>
                    <tr>
                        <th>{}</th>
                        <th>POS</th>
                        <th>Team</th>
                        <th>Name</th>
                        <th>EPPG</th>
                        <th>FPPG</th>
                        <th>Status</th>
                        <th><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelAllTeamplayers.bind(null, {team: teamNum})} title="Remove all players"><i className="fa fa-remove -red">{}</i></button></th>
                    </tr>
                    </thead>
                    <tbody>
                    { // DEBUG: выводим просто списком для возможности добавить сколько хош игроков для тестирования
                      players.length ?
                        players.map(itm =>
                            <tr key={itm.Name + itm.PlayerId}>
                                <td> {kk++} </td>
                                <td> {itm.Position} </td>
                                <td> {itm.Team} </td>
                                <td> {itm.Name} </td>
                                <td><NumericInput className="eppg js-eppg" value={itm.Eppg} precision={1} onChange={this._onPPGChange.bind(this, {player: itm, team: "PlayersTeam"+teamNum, type: 'Eppg'})} style={ false } /></td>
                                <td><NumericInput className="fppg js-fppg" value={itm.Fppg} precision={1} onChange={this._onPPGChange.bind(this, {player: itm, team: "PlayersTeam"+teamNum, type: 'Fppg'})} style={ false } /></td>
                                <td>{itm.Status.toLowerCase() === 'out' ? <span style={{color: 'red'}}>{itm.Status}</span> : itm.Status}</td>
                                <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: itm, team: teamNum, used: itm.used})} title="Remove player"><i className="fa fa-remove -red">{}</i></button></td>
                            </tr>
                        )
                        :
                        <tr><td/><td colSpan={7}><i>Add players to {Rules.teamLabels[teamNum]}</i></td></tr>
                    }
{/*
                    { positions.map((itm) =>
                        do {
                            let ret = [];
                            for( let ii = 0; ii < itm.Quantity; ii++ )
                            {
                                // players[jj]&&__DEV__&&console.log( 'players[jj], itm.Index', players[jj].Index, itm.Index );
                                if( players[jj] && players[jj].Index == itm.Index )
                                {
                                    ret.push(<tr key={itm.Name + ii}>
                                        <td> {kk++} </td>
                                        <td> {itm.Name === uniPositionName ? <span title="Universal player">UP ({players[jj].meta.PositionOrig})</span> : players[jj].Position} </td>
                                        <td> {players[jj].Team} </td>
                                        <td> {players[jj].Name} </td>
                                        <td><NumericInput className="eppg js-eppg" value={players[jj].Eppg} precision={2} onChange={this._onPPGChange.bind(this, {player: players[jj], team: "PlayersTeam"+teamNum, type: 'Eppg'})} style={ false } /></td>
                                        <td><NumericInput className="fppg js-fppg" value={players[jj].Fppg} precision={2} onChange={this._onPPGChange.bind(this, {player: players[jj], team: "PlayersTeam"+teamNum, type: 'Fppg'})} style={ false } /></td>
                                        <td> {players[jj].Status.toUpperCase() === 'OUT' ? <span style={{color: 'red'}}>{players[jj].Status}</span> : players[jj].Status} </td>
                                        <td><button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: players[jj], team: teamNum, used: players[jj].used})} title="Remove player"><i className="fa fa-remove -red">{}</i></button></td>
                                    </tr>);
                                    jj++;
                                }
                                else
                                {
                                    ret.push(<tr className="empty">
                                        <td>{}</td>
                                        <td>{itm.Name === uniPositionName ? <span title="Universal player">UP</span> : itm.Name}</td>
                                        <td colSpan="5">
                                            <i>
                                                {players.length >= TeamSize ?
                                                    'Team is full'
                                                    :
                                                    'Add player to this position...'
                                                }
                                            </i>
                                        </td>
                                    </tr>)
                                } // endif
                            } // endfor

                            ret;
                        })
                    }
*/}
                    </tbody>
                </table>

                {TeamDefence.name ?
                    <div className="defence">
                        <b>Defense</b>: <abbr title={TeamDefence.event ? `From event “${TeamDefence.event}”` : ''}>{TeamDefence.name}</abbr>
                    </div>
                    :
                    <div className="defence"><b>Defense</b>: <i>Not set, please, choose a command for defense</i></div>
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


    /**@private*/ _onGenerateTeamName(props, ee)
    {
        // __DEV__&&console.log( 'props, ee, p1, p2, p3', {props, ee, p1, p2, p3} );
        const { actions, teamNum } = this.props.data;

        ee.preventDefault();

        actions.actionGenerateTeamName({teamNum, ...props});
    }
}