/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;


export class PlayersTable extends React.Component
{
    filters = {'All': 'All'};
    currFilter = "";

    constructor(props)
    {
        super(props);
        const { data, team1, team2 } = this.props;

        // prepare players filter
        this.filters[team1] = team1;
        this.filters[team2] = team2;
        var filters = {};
        Object.keys(this.filters).forEach((item) => { filters[item] = false });
        filters[this.currFilter = Object.keys(this.filters)[0]] = true;

        this.state = {data: data, filters: filters};
    }


    _onFilterChange(ee)
    {
        ee.preventDefault();

        Object.keys(this.state.filters).forEach((key) => (this.state.filters[key] = key == ee.target.dataset.filter) && (this.currFilter = key));
        this.setState({...this.state});
    }


    render()
    {
        const { team1, team2 } = this.props;
        const { data } = this.state;


        // filter btn
        var filterBtn = (filter) => [<a href="#" key={filter + '11'} className={"f-btn" + (this.state.filters[filter] ? " active" : "")} data-filter={filter} onClick={::this._onFilterChange}>{this.filters[filter]}</a>];


        return (
            <div className="h-players">
                <label>Players <span className="-nobold">(avaliable)</span></label>
                <div className="filters" title="Filter players">
                    {filterBtn('All')}&nbsp;
                    {filterBtn(team1)}&nbsp;
                    {filterBtn(team2)}
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
                    {
                        data.map((itm, key) =>
                            (this.currFilter === "All" || this.currFilter === itm.Team) &&
                                <tr key={key}>
                                    <td> {itm.Position} </td>
                                    <td> {itm.Team} </td>
                                    <td> {itm.Name} </td>
                                    <td> {itm.Status} </td>
                                    <td>
                                        <button className="btn btn-default -btn-default btn-xs " data-url="/AltBet.Admin/Category/NewCategory?category=fantasy-sport" title="Add to team 1"><i className="fa fa-plus"></i> Add T1</button>&nbsp;
                                        <button className="btn btn-default -btn-default btn-xs" data-url="/AltBet.Admin/Category/NewCategory?category=fantasy-sport" title="Add to team 1"><i className="fa fa-plus"></i> Add T2</button>
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}