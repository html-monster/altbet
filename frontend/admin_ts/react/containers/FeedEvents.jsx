import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Actions from '../actions/FeedEventsActions';
import {DropBox} from '../components/common/DropBox';
import {DateLocalization} from '../common/DateLocalization';
import classNames from 'classnames';
import {Common} from "common/Common.ts";
import {InfoMessages} from "common/InfoMessages.ts";
import {Loading} from "common/Loading.ts";
import {MainConfig} from '../../inc/MainConfig';


class FeedEvents extends BaseController
{
    LoadingObj;

    constructor(props)
    {
        super(props);

        __DEV__&&console.debug( 'FeedEvents props', props );

        // const { Players } = this.props.data;
        this.LoadingObj = new Loading;
        // this.state = {currTeamKey: 0, okBtnDisabled: false};
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
        const { actions, data: {AllSport, AllLeague, Sport, League, FeedEvents, OrderBy, StartDateSort} } = this.props;
        // const { okBtnDisabled } = this.state;
        let sportsItems, ligItems;

        let $DateLocalization = new DateLocalization();

        0||console.log( 'data', this.props.data );
        0||console.log( 'data', AllSport.map((val) => { return { value: val, label: val} }) );
        if (AllLeague) ligItems = AllLeague.map((val) => { return { value: val, label: val} });

        const getUrlParams = () => {
            let params = {Sport: Sport};
            params.League = League;
            params.sort = StartDateSort;
            params.OrderBy = OrderBy;
            return Object.keys(params).map((key) => params[key] ? `${key}=${params[key]}` : `${key}=`).join('&');
        };


        return (
                <div class="">
                    <div class="box-header">
                        <h3 class="box-title">Xml feed events</h3>
                    </div>

                    <div class="box-body pad table-responsive">
                        {/*<div class={classNames("box", {"box-widget": false})}></div>*/}
{/*
                        <DropBox name="selected-state" items={sportsItems = AllSport.map((val) => { return { value: val, label: val} })}
                            /*items={[
                                { value: '1', label: 'var 1'},
                                { value: '2', label: 'var 2'},
                            ]}*
                            clearable={false} value={Sport} searchable={true} afterChange={() => {}}/>
*/}
                        { ligItems &&
                            <DropBox name="selected-state" items={ligItems}
                                /*items={[
                                    { value: '1', label: 'var 1'},
                                    { value: '2', label: 'var 2'},
                                ]}*/
                                clearable={false} value={League} searchable={true} afterChange={() => {}}/>
                        }

                        <table class="table exchanges">
                            <thead>
                            <tr>
                                <th><span>FullName</span></th>
                                <th><span>Sport</span></th>
                                <th><span>League</span></th>
                                <th><span>Status</span></th>
                                <th>
                                    <span className={classNames(`icon ${OrderBy}`, {'active': StartDateSort.indexOf('StartDate') > -1})}>
                                        {/*<a href="#" onClick={this._onSortClick.bind(this, {Sport, League, sort: StartDateSort, OrderBy})}>Start date</a>*/}
                                        <a href={MainConfig.BASE_URL + `/Feed?` + getUrlParams()}>Start date</a>
                                    </span>
{/*
                    <span class="icon @Model.OrderBy @((Model.StartDateSort.Contains(" StartDate")) ? "
                          active" : "")">
                        @Html.ActionLink("Start date", "Index", new { @sport = Model.Sport, @league = Model.League, @sort = Model.StartDateSort, @orderBy = Model.OrderBy })
                    </span>
*/}
                                </th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                FeedEvents.map((item) =>
                                    <tr key={item.EventId}>
                                        <td>
                                            {item.FullName}
                                        </td>
                                        <td>{item.Sport}</td>
                                        <td>{item.League}</td>
                                        <td>{item.Status} </td>
                                        <td>{$DateLocalization.fromSharp2(item.StartDate, 0).toLocalDate({format: 'MM/DD/Y h:mm A'})}</td>
                                        <td class="controls">
                                            <a href={MainConfig.BASE_URL + "/Feed/NewFeedExchange?eventId=" + item.EventId} className="btn btn-sm btn-default">Apply</a>
                                        </td>
                                    </tr>
                                )
                            }

                            </tbody>
                        </table>

                    </div>
                </div>

        );
        // return <Chart data={this.props.MainPage} actions={this.props.chartActions} />
    }


    /**
     * show loading
     * @private
     */
    sendingMode(mode)
    {
        // turn on
        if( mode )
        {
            this.LoadingObj.showLoading();

        // turn off
        } else {
            this.LoadingObj.hideLoading();
        } // endif
        // this.setState({...this.state});
    }


    /**
     * Click on column header
     * @private
     */
    _onSortClick(props, ee)
    {
        const { actions, data } = this.props;

        ee.preventDefault();

        this.sendingMode(true);
        actions.actionGetNewTableData(props, {callback: ::this._onSortCallback});
    }


    /**@private*/ _onSortCallback({errorCode, title, message})
    {
        this.sendingMode(false);

        if( errorCode === 200)
        {
            // redirect
        }
        else
        {
            (new InfoMessages).show({
                title: '',
                message: message,
                color: InfoMessages.WARN,
            });
        } // endif
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(
    state => {
        return ({
        data: state.FeedEvents,
        // test: state.Ttest,
    })
    },
    dispatch => ({
        actions: bindActionCreators(Actions, dispatch),
    })
)(FeedEvents)
