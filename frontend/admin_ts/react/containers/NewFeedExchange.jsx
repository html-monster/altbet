import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import mainPageActions from '../actions/MainPageActions.ts';
import {DropBox} from '../components/common/DropBox';
import {PlayersTable} from '../components/NewFeedExchange/PlayersTable';
import {Team1} from '../components/NewFeedExchange/Team1';


class NewFeedExchange extends BaseController
{
    constructor(props)
    {
        super(props);
        const { Players } = this.props.data.AppData;

        __DEV__&&console.debug( 'this.props', props );

        this.state = {Players, PlayersTeam1: [], PlayersTeam2: []};
    }


    addToTeam1(plName, plTeam)
    {
        for( let ii in this.state.Players )
        {
            let val = this.state.Players[ii];

            if( val ) 
            {
            }
            else
            {
            } // endif
        } // endfor
    }



    render()
    {
        // const { actions, data: {AppData:{ FullName, Category, Filters, Players, Team1name, Team2name }} } = this.props;
        const { actions, data: {AppData: AppData} } = this.props;
        const { Players, PlayersTeam1, PlayersTeam2 } = this.state;

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
                                        <div className="">{moment(AppData.StartDate).format('DD MMM Y')}</div>
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
                                        <label>Event</label>
                                        <DropBox name="selected-state" items={items = Object.keys(AppData.TimeEvent).map((key) =>
                                                { return {value: key, label: AppData.TimeEvent[key]}}
                                            )} autofocus clearable={true} disabled={false} value={items[0]} searchable={true} afterChange={(newValue) => { false || console.log( 'selected val', newValue ) }}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className="box-body" >
                                    <div className="form-group">
                                        <PlayersTable data={Players} team1={AppData.Team1name} team2={AppData.Team2name} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">
                                                <Team1 data={PlayersTeam1} teamNum="1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box-body" >
                                            <div className="form-group">
                                                <Team1 data={PlayersTeam2} teamNum="2" />
                                            </div>
                                        </div>
                                    </div>
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
        actions: bindActionCreators(mainPageActions, dispatch),
    })
)(NewFeedExchange)