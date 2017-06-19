import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Actions from '../actions/NewFeedExchangeActions.ts';
import {DropBox} from '../components/common/DropBox';
import {PlayersTable} from 'components/NewFeedExchange/PlayersTable';
import {Team1} from '../components/NewFeedExchange/Team1';
import {TeamResVar} from 'components/NewFeedExchange/TeamResVar';
import {DateLocalization} from '../common/DateLocalization';
import classNames from 'classnames';


class NewFeedExchange extends BaseController
{
    constructor(props)
    {
        super(props);

        __DEV__&&console.debug( 'this.props', props );

        // const { Players } = this.props.data;
        this.state = {currTeamKey: 0};
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
        const { Players, PlayersTeam1, PlayersTeam1Reserve, PlayersTeam2, PlayersTeam2Reserve, PlayersTeam1Variable, PlayersTeam2Variable, Positions, UPlayerData, EventFilter, Period, CurrentEventId, EventId, Rules, CurrentTeam} = this.props.data;
        const { currTeamKey } = this.state;
        var items = [];
        const playersComponents = [[1, 1, 'Players team 1', <Team1 data={PlayersTeam1.players} positions={Positions} uplayerdata={UPlayerData} actions={actions} teamNum="1" />,],
            [1, 2, 'Reserve players team 1', <TeamResVar players={PlayersTeam1Reserve.players} teamVar="PlayersTeam1Reserve" actions={actions} teamNum="1" />,],
            [1, 3, 'Variable players team 1', <TeamResVar players={PlayersTeam1Variable.players} teamVar="PlayersTeam1Variable" actions={actions} teamNum="1" />,],
            [2, 1, 'Players team 2', <Team1 data={PlayersTeam2.players} positions={Positions} uplayerdata={UPlayerData} actions={actions} teamNum="2" />,],
            [2, 2, 'Reserve players team 2', <TeamResVar players={PlayersTeam2Reserve.players} teamVar="PlayersTeam2Reserve" actions={actions} teamNum="2" />,],
            [2, 3, 'Variable players team 2', <TeamResVar players={PlayersTeam2Variable.players} teamVar="PlayersTeam2Variable" actions={actions} teamNum="2" />,],
        ];


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
                                <div class="panel box box-default">
                                    <div class="box-header with-border">
                                        <h4 class="box-title">
                                            Players <span className="-nobold">(avaliable)</span>
                                        </h4>
                                    </div>
                                    <div class="panel-collapse">
                                        <div class="box-body">
                                            <PlayersTable data={{
                                                Players,
                                                CurrentEventId,
                                                EventId,
                                                t1pos: PlayersTeam1.positions,
                                                t2pos: PlayersTeam2.positions,
                                                PlayersTeam1Reserve,
                                                PlayersTeam2Reserve,
                                                PlayersTeam1Variable,
                                                PlayersTeam2Variable,
                                                positions: Positions,
                                                uplayerdata: UPlayerData,
                                                Rules,
                                                CurrentTeam,
                                                actions,
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div class="box-group" id="accordion">
                                    {playersComponents.map(([$team, $type, $header, $component], key) =>
                                        <div key={key} class={`panel box box-team${$team}`}>
                                            <div class="box-header with-border" onClick={this._onAccordionOpenClick.bind(this, $type, $team, key)}>
                                                <h4 class="box-title">
                                                    <a data-toggle="collapse" data-js-opener="" data-parent="#accordion" href={"#collapse" + key} aria-expanded={key === 0} class={classNames({"collapsed": key !== currTeamKey, "unactive": key !== currTeamKey})}>{$header}</a>
                                                </h4>
                                            </div>
                                            <div id={"collapse" + key} class={classNames("panel-collapse collapse", {"in": key === 0})} aria-expanded="true">
                                                <div class="box-body">{$component}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
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



    _onAccordionOpenClick(inType, inTeam, currTeamKey, ee)
    {
        this.props.actions.actionSetCurrTeam(inType, inTeam);
        // $("[data-js-opener]").addClass('unactive');
        let $that = $(ee.target);
        $that.find("[data-js-opener]").click();
        this.setState({currTeamKey: currTeamKey});
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
