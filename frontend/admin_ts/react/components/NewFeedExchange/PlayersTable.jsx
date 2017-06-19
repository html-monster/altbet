/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import classNames from 'classnames';

export class PlayersTable extends React.Component
{
    // filters = {};
    /**@private*/ currFilter = "";
    /**@private*/ uniPositionName = 'Util';


    constructor(props)
    {
        super(props);
        const { Players, } = this.props.data;

        // prepare players filter
        var filters = this._prepareFilters(Players);

        this.state = {data: Players, filters};
    }


    componentWillUpdate(newData, props)
    {
        if( newData.data.eventId !== this.props.data.eventId )
        {
            this.setState({...this.state, data: newData.Players, filters: this._prepareFilters(newData.Players)})
        } // endif
    }


    render()
    {
        const { data, data: {t1pos, t2pos, PlayersTeam1Reserve, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, actions, positions, CurrentEventId, EventId, uplayerdata: {uniPositionIndex, uniPositionName}, Rules, CurrentTeam} } = this.props;
        // const data = this.props.data;
        const { data: Players, filters } = this.state;

        // 0||console.log( 'Rules, this.props.data', Rules, this.props.data );
        const addTeamReserveDisable = [];
        addTeamReserveDisable[1] = CurrentEventId.EventId !== EventId || PlayersTeam1Reserve.players.length >= Rules.reserveLen;
        addTeamReserveDisable[2] = CurrentEventId.EventId !== EventId || PlayersTeam2Reserve.players.length >= Rules.reserveLen;
        const addTeamVariableDisable = [];
        addTeamVariableDisable[1] = CurrentEventId.EventId === EventId || PlayersTeam1Variable.players.length >= Rules.variableLen;
        addTeamVariableDisable[2] = CurrentEventId.EventId === EventId || PlayersTeam2Variable.players.length >= Rules.variableLen;


        // filter btn
        var filterBtn = (filter) => <span key={filter + '11'}><a href="#" className={"f-btn" + (this.state.filters[filter] ? " active" : "")} data-filter={filter} onClick={::this._onFilterChange}>{filter}</a>&nbsp;</span>;

        return (
            <div className="h-players">
                [{CurrentTeam.type}, {CurrentTeam.num}]
                <div className="form-group-filters" title="Filter players">
                    { Object.keys(filters).map((val) => (filterBtn(val))) }
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th/>
                        <th>POS</th>
                        <th>Team</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    { Players.length ?
                        Players.map((itm, key) =>
                            (this.currFilter === "All" || this.currFilter === itm.Team) &&
                            do {
                                // 0||console.log( 'positions[itm.Index], itm.Index', positions[itm.Index], itm.Index, t1pos[itm.Index] );
                                let addTeamdisable = [];
                                let addTeamUPdisable = [], upAddTitle = [], resAddTitle = [];
                                let $TNum = CurrentTeam.num;
                                if( CurrentTeam.type === 1 )
                                {
                                    // block add for full team position
                                    addTeamdisable[1] = positions[itm.Index].Quantity == t1pos[itm.Index];
                                    addTeamdisable[2] = positions[itm.Index].Quantity == t2pos[itm.Index];


                                    // block add for full uni position
                                    upAddTitle[$TNum] = 'The Universal position is full';
                                    addTeamUPdisable[$TNum] = false;
                                    if( positions[uniPositionIndex].Quantity == data[`t${$TNum}pos`][uniPositionIndex] )
                                    {
                                        addTeamUPdisable[$TNum] = 1;

                                    // check position for restriction
                                    } else if (positions[uniPositionIndex].Locks.filter((val) => itm.Position === val).length )
                                    {
                                        addTeamUPdisable[$TNum] = 2;
                                        upAddTitle[$TNum] = `This position is not avaliable for Universal player`;
                                    } else upAddTitle[$TNum] = 'Add to universal position'; // endif

                                    // if( positions[uniPositionIndex].Quantity == t2pos[uniPositionIndex] ) addTeam2UPdisable = 1;
                                    // else upAdd2Title = '';
                                }
                                else if( CurrentTeam.type === 2 )
                                {
                                    upAddTitle[$TNum] = `Team ${$TNum} reserve is full`;
                                    if (!addTeamReserveDisable[$TNum]) upAddTitle[$TNum] = `Add to team ${$TNum} reserve`;
                                }
                                else
                                {
                                    resAddTitle[$TNum] = `Team ${$TNum} variable players is full`;
                                    if (!addTeamVariableDisable[$TNum]) upAddTitle[$TNum] = `Add to team ${$TNum} variable players`;
                                } // endif



                                <tr key={key} className={`${itm.used ? "used team" + itm.usedTeam : ""}`}>
                                    <td>{key+1}</td>
                                    <td> {itm.Position === uniPositionName ? itm.meta.PositionOrig : itm.Position} </td>
                                    <td> {itm.Team} </td>
                                    <td> {itm.Name} </td>
                                    <td> {itm.Status} </td>
                                    { itm.used ?
                                        <td className="nowrap">
                                            <button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: itm, team: itm.usedTeam, used: itm.used})} title="Remove player"><i className="fa fa-remove -red"/> remove</button>&nbsp;&nbsp;
                                            <span>
                                                Team {itm.usedTeam}&nbsp;
                                                {itm.used === 2 ? <span title="Universal Player">UP</span> : ''}
                                                {itm.used === 3 ? <span title="Reserve">RES</span> : ''}
                                            </span>
                                        </td>
                                        :
                                        <td class="nowrap">
                                            <div class="btn-group">
                                                {CurrentTeam.type === 1 ?
                                                    <div>
                                                        <button type="button" class="btn btn-default -btn-default btn-xs" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title={addTeamdisable[$TNum] ? `Position ${itm.Position} is full` : `Add to team ${$TNum}`} disabled={addTeamdisable[$TNum]} onClick={this._onAddPlayerClick.bind(this, addTeamdisable[$TNum], actions.actionAddTeamplayer, {player: itm, team: $TNum})}><i class="fa fa-plus"/> Add T{$TNum}</button>
                                                        &nbsp;
                                                        <button type="button" class={"btn btn-default -btn-default btn-xs"} title={upAddTitle[$TNum]} disabled={ addTeamUPdisable[$TNum]} onClick={this._onAddPlayerClick.bind(this, addTeamUPdisable[$TNum], actions.actionAddUPTeamplayer, {player: itm, team: $TNum})}><i class="fa fa-plus"/> Add UP</button>
                                                    </div>
                                                    :
                                                 CurrentTeam.type === 2 ?
                                                    <button type="button" class={classNames("btn btn-default -btn-default btn-xs", {"disabled": addTeamReserveDisable[$TNum]})} title={upAddTitle[$TNum]} onClick={this._onAddPlayerClick.bind(this, addTeamReserveDisable[$TNum], actions.actionAddTeamplayerReserve, {player: itm, team: CurrentTeam.num})}><i class="fa fa-plus"/> Add to RES</button>
                                                    :
                                                    <button type="button" class={classNames("btn btn-default -btn-default btn-xs", {"disabled": addTeamVariableDisable[$TNum]})} title={resAddTitle[$TNum]} onClick={this._onAddPlayerClick.bind(this, addTeamVariableDisable[$TNum], actions.actionAddTeamplayerVariable, {player: itm, team: CurrentTeam.num})}><i class="fa fa-plus"/> Add to RES</button>
                                                }

{/*
                                                <ul class="dropdown-menu">
                                                    <li class={addTeam1disable ? "disabled" : ""} title={addTeam1disable ? `The ${itm.Position} position is full` : ""}><a href="#" class={addTeam1disable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam1disable, actions.actionAddTeamplayer, {player: itm, team: 1})}>Add to {itm.Position}</a></li>
                                                    <li class={addTeam1UPdisable ? "disabled" : ""} title={upAdd1Title}><a href="#" class={addTeam1UPdisable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam1UPdisable, actions.actionAddUPTeamplayer, {player: itm, team: 1})}>Add to universal position </a></li>
                                                    <li class={addTeam1ReserveDisable ? "disabled" : ""} title={upAdd1Title}><a href="#" class={addTeam1ReserveDisable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam1ReserveDisable, actions.actionAddTeamplayerReserve, {player: itm, team: 1})}>Add to reserve </a></li>
                                                    <li role="separator" class="divider"></li>
                                                </ul>
*/}
                                            </div>
                                            {/*&nbsp;
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-default -btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-plus"/> Add T2 <span class="caret"/></button>
                                                <ul class="dropdown-menu">
                                                    <li class={addTeam2disable ? "disabled" : ""} title={addTeam2disable ? `The ${itm.Position} position is full` : ""}><a href="#" class={addTeam2disable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam2disable, actions.actionAddTeamplayer, {player: itm, team: 2})}>Add to {itm.Position}</a></li>
                                                    <li class={addTeam2UPdisable ? "disabled" : ""} title={upAdd2Title}><a href="#" class={addTeam2UPdisable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam2disable, actions.actionAddUPTeamplayer, {player: itm, team: 2})}>Add to universal position </a></li>
                                                    <li class={addTeam2ReserveDisable ? "disabled" : ""} title={upAdd2Title}><a href="#" class={addTeam2ReserveDisable ? "-silver" : ""} onClick={this._onAddPlayerClick.bind(this, addTeam2ReserveDisable, actions.actionAddTeamplayerReserve, {player: itm, team: 2})}>Add to reserve </a></li>
                                                    <li role="separator" class="divider"></li>
                                                </ul>
                                            </div>*/}
                                            {/*<button className={"btn btn-default -btn-default btn-xs"} title={addTeam1disable ? `The ${itm.Position} position is full` : "Add to team 1"} onClick={() => addTeam1disable || actions.actionAddTeamplayer({player: itm, team: 1})} disabled={addTeam1disable}><i className={"fa fa-plus" + (addTeam1disable ? " -gray" : "")}></i> Add T1</button>&nbsp;*/}
                                        </td>
                                    }
                                </tr>
                            }
                        )
                        :
                        <tr><td colSpan="5"><i>No avaliable players</i></td></tr>
                    }
                    </tbody>
                </table>
            </div>
        );
    }


    _onAddPlayerClick(disallow, clickFunc, params, ee)
    {
        // 0||console.log( 'ee.preventDefault', {disallow, clickFunc, proxy, ee} );
        ee.preventDefault();
        disallow || clickFunc(params);
        return false;
    }



    _onFilterChange(ee)
    {
        ee.preventDefault();

        Object.keys(this.state.filters).forEach((key) => (this.state.filters[key] = key == ee.target.dataset.filter) && (this.currFilter = key));
        this.setState({...this.state});
    }



    _prepareFilters(inData)
    {
        var filters = {'All': false};

        inData.forEach((val) => filters[val.Team] = false);

        // Object.keys(filters).forEach((item) => { filters[item] = false });
        filters[this.currFilter = Object.keys(filters)[0]] = true;
        return filters;
    }
}