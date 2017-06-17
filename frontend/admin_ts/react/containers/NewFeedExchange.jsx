import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Actions from '../actions/NewFeedExchangeActions.ts';
import {DropBox} from '../components/common/DropBox';
import {PlayersTable} from 'components/NewFeedExchange/PlayersTable';
import {Team1} from '../components/NewFeedExchange/Team1';
import {TeamReserve} from 'components/NewFeedExchange/TeamReserve';
import {DateLocalization} from '../common/DateLocalization';


class NewFeedExchange extends BaseController
{
    constructor(props)
    {
        super(props);

        __DEV__&&console.debug( 'this.props', props );

        // const { Players } = this.props.data;
        // this.state = {Players, PlayersTeam1: [], PlayersTeam2: []};
    }


/*
    componentDidUpdate()
    {
        __DEV__&&console.debug( 'this.props', this.props );
    }
*/


    render()
    {
        // const { actions, data: {AppData:{ FullName, Category, Filters, Players, Team1name, Team2name }} } = this.props;
        const { actions, data: AppData } = this.props;
        const { Players, PlayersTeam1, PlayersTeam1Reserve, PlayersTeam2, PlayersTeam2Reserve, Positions, UPlayerData, EventFilter, Period, CurrentEventId, EventId, Rules} = this.props.data;
        var items = [];

        return (
            <div className="box box-default">
                <div className="box-header">
                    {/*<i className="fa fa-navicon"></i>*/}
                    <h3 className="box-title">Event approving “{AppData.FullName}”</h3>
                </div>
                <div className="box-body pad table-responsive">
                    <div className="box box-widget">
                        {/*<!-- /.box-header -->*/}
                        {/*<div className="box-header with-border"></div>*/}
                        {/*<!-- /.box-body -->*/}
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <label>Category</label>
                                        <div className="">{AppData.Category}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <label>Event start date</label>
                                        <div className="">{moment(AppData.StartDate).format('DD MMM Y H:mm A')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <label>Full name</label>
                                        <input className="form-control" type="text" name="url" />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-sm-6">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <label>Event <span class="-nobold" title="Available events">({Object.keys(AppData.TimeEvent).length})</span></label>
                                        <div className="form-group-filters" title="Filter events by period">
                                            { Object.keys(EventFilter).map((val) => <a href="#" key={val} class={Period == val ? '-bold' : ''} onClick={this._onEventFilterChange.bind(this, val)}> {EventFilter[val]} </a>) }
                                        </div>
                                        <DropBox name="selected-state" items={items = Object.keys(AppData.TimeEvent).map((key) =>
                                                { return {
                                                    value: AppData.TimeEvent[key].EventId,
                                                    label: `${AppData.TimeEvent[key].HomeTeam} vs ${AppData.TimeEvent[key].AwayTeam} (${(new DateLocalization).fromSharp2(AppData.TimeEvent[key].StartDate, 0).toLocalDate({format: 'MM/DD/Y h:mm A'})})`
                                                }}
                                            )} clearable={false} value={items[0]} searchable={true} afterChange={actions.actionChangeEvent}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <PlayersTable data={{ Players,
                                            CurrentEventId,
                                            EventId,
                                            t1pos: PlayersTeam1.positions,
                                            t2pos: PlayersTeam2.positions,
                                            PlayersTeam1Reserve,
                                            PlayersTeam2Reserve,
                                            positions: Positions,
                                            uplayerdata: UPlayerData,
                                            Rules,
                                            actions,
                                        }} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6">

                                <div class="box-group" id="accordion">
                                    <div class="panel box box-primary">
                                        <div class="box-header with-border">
                                            <h4 class="box-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" class="">
                                                    Players team 1
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseOne" class="panel-collapse collapse in" aria-expanded="true">
                                            <div class="box-body">
                                                <Team1 data={PlayersTeam1.players} positions={Positions} uplayerdata={UPlayerData} actions={actions} teamNum="1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel box box-danger">
                                        <div class="box-header with-border">
                                            <h4 class="box-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" class="collapsed" aria-expanded="false">
                                                    Reserve players team 1
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseTwo" class="panel-collapse collapse" aria-expanded="false" style={{height: '0'}}>
                                        <div class="box-body">
                                                <TeamReserve players={PlayersTeam1Reserve.players} actions={actions} teamNum="1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel box box-success">
                                        <div class="box-header with-border">
                                            <h4 class="box-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" class="collapsed" aria-expanded="false">
                                                    Players team 2
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseThree" class="panel-collapse collapse" aria-expanded="false" style={{height: '0'}}>
                                        <div class="box-body">
                                                <Team1 data={PlayersTeam2.players} positions={Positions} uplayerdata={UPlayerData} actions={actions} teamNum="2" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel box box-success">
                                        <div class="box-header with-border">
                                            <h4 class="box-title">
                                                <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" class="collapsed" aria-expanded="false">
                                                    Reserve players team 2
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseThree" class="panel-collapse collapse" aria-expanded="false" style={{height: '0'}}>
                                        <div class="box-body">
                                                <TeamReserve players={PlayersTeam2Reserve.players} actions={actions} teamNum="2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

{/*                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                */}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <label>Url</label>
                                        <input className="form-control" type="text" name="url" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*<!-- /.box-footer -->*/}
                        {/*<div class="box-footer" style="display: block;"></div>*/}
                    </div>
                </div>
            </div>
        );
        // return <Chart data={this.props.MainPage} actions={this.props.chartActions} />
    }



    _onEventFilterChange(filterVal, ee)
    {
        ee.preventDefault();

        const { actions, data: {EventId} } = this.props;
        // const { Players, PlayersTeam1, PlayersTeam2, CurrentEventId, Positions, UPlayerData, EventFilter, Period} = this.props.data;

        actions.actionChangeEventsPeriod({EventId, filterVal});
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(
    state => {
        return ({
        data: state.newFeedExchange,
        // test: state.Ttest,
    })
    },
    dispatch => ({
        actions: bindActionCreators(Actions, dispatch),
    })
)(NewFeedExchange)
