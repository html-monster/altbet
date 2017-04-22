/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;


export class PlayersTable extends React.Component
{
    // filters = {};
    currFilter = "";

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
        const { team1, team2, t1pos, t2pos, actions } = this.props;
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
                                let btn1disable = itm.PositionQuantity == t1pos[itm.Index];
                                let btn2disable = itm.PositionQuantity == t2pos[itm.Index];

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
                                            <button className={"btn btn-default -btn-default btn-xs"} title={btn1disable ? `The ${itm.Position} position is full` : "Add to team 1"} onClick={() => btn1disable || actions.actionAddTeamplayer({player: itm, team: 1})} disabled={btn1disable}><i className={"fa fa-plus" + (btn1disable ? " -gray" : "")}></i> Add T1</button>&nbsp;
                                            <button className={"btn btn-default -btn-default btn-xs"} title={btn2disable ? `The ${itm.Position} position is full` : "Add to team 2"} onClick={() => btn2disable || actions.actionAddTeamplayer({player: itm, team: 2})} disabled={btn2disable}><i className={"fa fa-plus" + (btn2disable ? " -gray" : "")}></i> Add T2</button>
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