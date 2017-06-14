/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;


export class PlayersTable extends React.Component
{
    // filters = {};
    /**@private*/ currFilter = "";
    /**@private*/ uniPositionName = 'Util';


    constructor(props)
    {
        super(props);
        const { data, team1, team2 } = this.props;

        // prepare players filter
        var filters = this._prepareFilters(data);

        this.state = {data: data, filters};
    }


    componentWillUpdate(newData, props)
    {
        if( newData.eventId !== this.props.eventId )
        {
            this.setState({...this.state, data: newData.data, filters: this._prepareFilters(newData.data)})
        } // endif
    }


    render()
    {
        const { team1, team2, t1pos, t2pos, actions, positions, uplayerdata: {uniPositionIndex, uniPositionName} } = this.props;
        const { data, filters } = this.state;


        // filter btn
        var filterBtn = (filter) => <span key={filter + '11'}><a href="#" className={"f-btn" + (this.state.filters[filter] ? " active" : "")} data-filter={filter} onClick={::this._onFilterChange}>{filter}</a>&nbsp;</span>;

        return (
            <div className="h-players">
                <label>Players <span className="-nobold">(avaliable)</span></label>
                <div className="filters" title="Filter players">
                    { Object.keys(filters).map((val) => (filterBtn(val))) }
                </div>
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
                            (this.currFilter === "All" || this.currFilter === itm.Team) &&
                            do {
                                // 0||console.log( 'positions[itm.Index], itm.Index', positions[itm.Index], itm.Index, t1pos[itm.Index] );
                                // block add for full team position
                                let addTeam1disable = positions[itm.Index].Quantity == t1pos[itm.Index];
                                // block add for full uni position
                                let addTeam1UPdisable = positions[uniPositionIndex].Quantity == t1pos[uniPositionIndex];
                                let addTeam2disable = positions[itm.Index].Quantity == t2pos[itm.Index];
                                let addTeam2UPdisable = false&&positions[uniPositionIndex].Quantity == t2pos[uniPositionIndex];

                                <tr key={key} className={`${itm.used ? "used team" + itm.used : ""}`}>
                                    <td> {itm.Position} </td>
                                    <td> {itm.Team} </td>
                                    <td> {itm.Name} </td>
                                    <td> {itm.Status} </td>
                                    { itm.used ?
                                        <td>
                                            <button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamplayer.bind(null, {player: itm, team: itm.used})} title="Remove player"><i className="fa fa-remove -red">{}</i> remove</button>&nbsp;&nbsp;
                                            { itm.used && <span>Team {itm.used}</span> }
                                        </td>
                                        :
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default -btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-plus">{}</i> Add T1 <span className="caret">{}</span></button>
                                                <ul className="dropdown-menu">
                                                    <li className={addTeam1disable ? "disabled" : ""} title={addTeam1disable ? `The ${itm.Position} position is full` : ""}><a href="#" className={addTeam1disable ? "-silver" : ""} onClick={() => addTeam1disable || actions.actionAddTeamplayer({player: itm, team: 1})}>Add to {itm.Position}</a></li>
                                                    <li className={addTeam1UPdisable ? "disabled" : ""} title={addTeam1UPdisable ? `The Universal position is full` : ""}><a href="#" className={addTeam1UPdisable ? "-silver" : ""} onClick={() => addTeam1disable || actions.actionAddUPTeamplayer({player: itm, team: 1})}>Add to universal position </a></li>
                                                    {/*<li role="separator" className="divider"></li>*/}
                                                </ul>
                                            </div>
                                            &nbsp;
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-default -btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-plus">{}</i> Add T2 <span className="caret">{}</span></button>
                                                <ul className="dropdown-menu">
                                                    <li className={addTeam2disable ? "disabled" : ""} title={addTeam2disable ? `The ${itm.Position} position is full` : ""}><a href="#" className={addTeam2disable ? "-silver" : ""} onClick={() => addTeam2disable || actions.actionAddTeamplayer({player: itm, team: 2})}>Add to {itm.Position}</a></li>
                                                    <li className={addTeam2UPdisable ? "disabled" : ""} title={addTeam2UPdisable ? `The Universal position is full` : ""}><a href="#" className={addTeam2UPdisable ? "-silver" : ""}>Add to universal position </a></li>
                                                    {/*<li role="separator" className="divider"></li>*/}
                                                </ul>
                                            </div>
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