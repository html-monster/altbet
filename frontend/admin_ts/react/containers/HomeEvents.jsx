import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Actions from '../actions/HomeEventsActions';
import {DropBox} from '../components/common/DropBox';
import {PagerBox} from '../components/common/PagerBox';
import {DateLocalization} from '../common/DateLocalization';
import classnames from 'classnames';
import {Common} from "common/Common.ts";
import {InfoMessages} from "common/InfoMessages.ts";
import {Loading} from "common/Loading.ts";
import {MainConfig} from '../../inc/MainConfig';
import {Framework} from 'common/Framework.ts';

import {NewHomeEvent} from '../components/HomeEvents/NewHomeEvent';
import {EditHomeEvent} from '../components/HomeEvents/EditHomeEvent';


class HomeEvents extends BaseController
{
    LoadingObj;

    constructor(props)
    {
        super(props);

        __DEV__&&console.debug( 'HomeEvents props', props );

        // const { Players } = this.props.data;
        this.LoadingObj = new Loading;
        // this.state = {currTeamKey: 0, okBtnDisabled: false};

        // Hardcode for MVC code access
        window.HomeEvents = this;
    }


    setEditedData(data)
    {
        __DEV__&&console.log( 'data', data, this.props );
        this.props.actions.actionSetEditedEventData({data});
    }


    render()
    {
        let { actions, data: {Sort, LastNode, Status, StatusEvent, Links, LinksMenu, Exchanges, TypeEvent, TypeEventStr, NewEventData} } = this.props;
        let $DateLocalization = new DateLocalization();

        // prepare sport filter
        // AllSport && AllSport.unshift('All') || (AllSport = ['All']);
        // if (sportsItems) sportsItems = sportsItems.concat(AllSport.map((val) => { return { value: val === 'All' ? '' : val, label: val} }));
        // currSport = sportsItems.slice().filter((val) => val.value == Sport || !Sport && !val.value )[0];

        // prepare lig filter
        // AllLeague && AllLeague.unshift('All') || (AllLeague = ['All']);
        // if (AllLeague) ligItems = ligItems.concat(AllLeague.map((val) => { return { value: val === 'All' ? '' : val, label: val} }));
        // currLig = ligItems.slice().filter((val) => val.value == League || !League && !val.value )[0];


        // prepare filters
        let actFilClass = [], actFilTitle = [];
        // let filtersClass = ["primary", "success", "warning", "default"];
        actFilClass[Status] = " active";
        actFilTitle[Status] = "Active filter";

        // active sort title, classes
        let titleAttr = sortVal => (Sort.SortBy.indexOf(sortVal) > -1 ? Sort.OrderBy === "Asc" ? "sorted ascending" : "sorted descending" : 'click for sorting');
        let sortClasses = sortVal => classnames('icon -nowrap', Sort.OrderBy, {'active': Sort.SortBy.indexOf(sortVal) > -1})

        if (!Exchanges) __DEV__&&console.warn( 'Exchanges is not an array !');


        return <div class="">
            {/*<EditHomeEvent data={{vars:{data:{}}, data:{}}}/>*/}
            <div class="row">
                <div class="col-sm-8">
                    {LastNode &&
                        <NewHomeEvent data={{data: NewEventData}}/>
                    }
                </div>
            </div>
            <div class="box box-@statClass[index]">
                <div class="box-header">
                    {/*<i class="fa fa-navicon"></i>*/}
                    <h3 class="box-title">Exchanges</h3>
                </div>
                <div class="box-body pad table-responsive">
                    <div>
                        <a class={classnames("btn-filter btn btn-primary btn-xs", {'active': actFilClass[0]})} href={Links.New} title={actFilTitle[0]}>New</a>
                        <a class={classnames("btn-filter btn btn-success btn-xs", {'active': actFilClass[1]})} href={Links.Approved} title={actFilTitle[1]}>Approved</a>
                        <a class={classnames("btn-filter btn btn-warning btn-xs", {'active': actFilClass[2]})} href={Links.Completed} title={actFilTitle[2]}>Completed</a>
                        <a class={classnames("btn-filter btn btn-default btn-xs", {'active': actFilClass[3]})} href={Links.Settlement} title={actFilTitle[3]}>Settlement</a>
                    </div>



                    <table class="exchanges xml_fied table" data-js="tabl-exch">
                        <thead>
                            <tr>
                                <th>
                                    <span className={sortClasses('FullName')}>
                                        <a href={Sort.Links.FullName} className="dotted" title={titleAttr('FullName')}>Full name</a>
                                        {/*@Html.ActionLink("Full name", "Index", new { @path = Model.Path, @status = Model.Status, ln = Model.LastNode, @sortBy = Model.NameSort, @orderBy = Model.OrderBy })*/}
                                    </span>
      {/*                              @{
                                        string titleAttr = (Model.OrderBy == "Asc" ? "sorted ascending" : "sorted descending");
                                        bool flag;
                                    }*/}
{/*
                                    <span class="icon @Model.OrderBy @((flag = Model.SortBy.Contains("FullName")) ? "active" : "")" title="@(flag ? titleAttr : "")">
                                            @Html.ActionLink("Full name", "Index", new {@path = Model.Path, @status = Model.Status, ln = Model.LastNode, @sortBy = Model.NameSort, @orderBy = Model.OrderBy})
                                        </span>
*/}
                                </th>
                                <th><span>Home name</span></th>
                                <th><span>Handicap</span></th>
                                <th><span>Away name</span></th>
                                <th><span>Handicap</span></th>
                                <th>
                                    <span className={sortClasses('StartDate')}>
                                        <a href={Sort.Links.StartDate} className="dotted" title={titleAttr('StartDate')}>Start date</a>
                                    </span>

                                </th>
                                <th>
                                    <span className={sortClasses('EndDate')}>
                                        <a href={Sort.Links.EndDate} className="dotted" title={titleAttr('EndDate')}>End date</a>
                                    </span>
                                </th>
                                <th><span>Type</span></th>
                                <th><span>Url</span></th>
                                { Status == StatusEvent.Settlement &&
                                    <th><span>Result</span></th>
                                }
                                <th></th>
                            </tr>
                        </thead>

                        { Exchanges && Exchanges.length ?
                            Exchanges.map((val, key) => {
                                const isdropup = false&&key == Exchanges.length-1;
                                return <tbody key={val.Symbol.Exchange}>
                                    <tr class="exch-row" data-id={val.Symbol.Exchange}>
                                        <td data-js="TD-FullName">{val.Symbol.FullName}</td>
                                        <td data-js="TD-HomeName">{val.Symbol.HomeName}</td>
                                        <td data-js="TD-HomeHandicap">{val.Symbol.HomeHandicap}</td>
                                        <td data-js="TD-AwayName">{val.Symbol.AwayName}</td>
                                        <td data-js="TD-AwayHandicap">{val.Symbol.AwayHandicap}</td>
                                        <td data-js="TD-StartDate">{$DateLocalization.fromSharp2(val.Symbol.StartDate, 0).toLocalDate({format: "MM/DD/Y h:mm A"})}</td>
                                        <td data-js="TD-EndDate">{val.Symbol.EndDate && $DateLocalization.fromSharp2(val.Symbol.EndDate, 0).toLocalDate({format: "MM/DD/Y h:mm A"})}</td>
                                        <td data-js="">{TypeEventStr[val.Symbol.TypeEvent]}</td>
                                        <td data-js="TD-UrlExchange">{val.Symbol.UrlExchange}</td>
                                        {Status == StatusEvent.Settlement &&
                                            <td>{val.Symbol.ResultExchange}</td>
                                        }
                                        <td>
                                            <div class="controls">
                                                <div class={classnames("btn-group", {'dropup': isdropup})}>
                                                    {/*<button type="button" data-js-btn-def-action="" class="btn btn-sm btn-default">Action</button>
                                                    <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                                                        <span class="caret"/>
                                                        <span class="sr-only">Toggle Dropdown</span>
                                                    </button>*/}
                                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Action&nbsp;<span class="caret"></span>
                                                    </button>

                                                    {do{
                                                    let menu;
                                                    switch (val.Symbol.Status) {
                                                        case StatusEvent.New:
                                                            menu = <ul class="dropdown-menu">
                                                                <li>
                                                                    {val.Symbol.TypeEvent == TypeEvent.Fantasy ?
                                                                        <a href={LinksMenu.EditFantasy + `?exchange=${val.Symbol.Exchange}`} title="Edit fantasy exchange">Edit</a>
                                                                        :
                                                                        <a href="#" class="js-btn-crud" data-type="edit" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Edit exchange">Edit</a>
                                                                    }

                                                                </li>
                                                                <li><a href="#" class="js-btn-crud" data-type="del" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Delete exchange">Delete</a></li>
                                                                <li class="divider"></li>
                                                                <li><a href="#" class="js-btn-status" data-type="approve" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Set approved status">Set approved</a></li>
                                                            </ul>;
                                                            break;
                                                        case StatusEvent.Approved:
                                                            menu = <ul class="dropdown-menu" role="menu">
                                                                <li><a href="#" data-js-btn-detail="" title="Details exchange">Details</a></li>
                                                                {/*{val.Symbol.TypeEvent == TypeEvent.Fantasy ||}*/}
                                                                <li>
                                                                    {val.Symbol.TypeEvent == TypeEvent.Fantasy ?
                                                                        <a href={LinksMenu.EditFantasy + `?exchange=${val.Symbol.Exchange}`} title="Edit fantasy exchange">Edit</a>
                                                                        :
                                                                        <a href="#" class="js-btn-crud" data-type="edit" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Edit exchange">Edit</a>
                                                                    }
                                                                </li>
                                                                <li class="divider"></li>
                                                                <li><a href="#" class="js-btn-status" data-type="complete" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Set completed status">Set completed</a></li>
                                                            </ul>;
                                                            break;
                                                        case StatusEvent.Completed:
                                                            menu = <ul class="dropdown-menu" role="menu">
                                                                <li><a href="#" data-js-btn-detail="" title="Details exchange">Details</a></li>
                                                                <li class="divider"></li>
                                                                <li><a href="#" class="js-btn-status" data-type="settlement" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Set settlement status">Set settlement</a></li>
                                                                <li><a href="#" class="js-btn-status" data-type="uncomplete" data-id={val.Symbol.Exchange} data-name={val.Symbol.FullName} title="Set approved status">Resume (set approved)</a></li>
                                                            </ul>;
                                                            break;
                                                        case StatusEvent.Settlement:
                                                            menu = <ul class="dropdown-menu" role="menu">
                                                                <li><a href="#" data-js-btn-detail="" title="Details exchange">Details</a></li>
                                                            </ul>;
                                                            break;
                                                    }
                                                    menu;
                                                    }}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="details">
                                        <td colSpan="10"/>
                                    </tr>
                                </tbody>
                            })
                            :
                            <tbody>
                                <tr colSpan="10">
                                    <td><i>No events</i></td>
                                </tr>
                            </tbody>
                        }
                    </table>
                </div>
                {/*<!-- /.box -->*/}
            </div>

        </div>;
        // return <Chart data={this.props.MainPage} actions={this.props.chartActions} />
    }


    /**
     * show loading
     * @private
     */
/*
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
*/


    /**
     * Click on sport filter
     * @private
     */
/*
    _onFiterClick(props, filter, newFilter)
    {
        // 0||console.log( '{props, filter, ee, p1}', {props, filter, ee, p1} );
        // return;
        const { actions, } = this.props;
        props[filter] = newFilter;
        props.page = 1;

        this.sendingMode(true);
        actions.actionGetNewTableData({props, callback: ::this._onSortCallback});
    }
*/
}

// __DEV__&&console.debug( 'connect', connect );

export default connect(
    state => {return ({
        data: state.HomeEvents,
        // test: state.Ttest,
    })},
    dispatch => ({
        actions: bindActionCreators(Framework.initAction(Actions), dispatch),
    })
)(HomeEvents)
