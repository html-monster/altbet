import React from 'react' ;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BaseController from './BaseController';
import Actions from '../actions/FeedEventsActions';
import {DropBox} from '../components/common/DropBox';
import {PagerBox} from '../components/common/PagerBox';
import {DateLocalization} from '../common/DateLocalization';
import classNames from 'classnames';
import {Common} from "common/Common.ts";
import {InfoMessages} from "common/InfoMessages.ts";
import {Loading} from "common/Loading.ts";
import {MainConfig} from '../../inc/MainConfig';
import {Framework} from 'common/Framework.ts';


class Users extends BaseController
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
        let { actions, data: {Users, } } = this.props;
        let sportsItems = [], ligItems = [], currSport, currLig;
        let $DateLocalization = new DateLocalization();


        // prepare sport filter
        // AllSport && AllSport.unshift('All') || (AllSport = ['All']);
        // if (sportsItems) sportsItems = sportsItems.concat(AllSport.map((val) => { return { value: val === 'All' ? '' : val, label: val} }));
        // currSport = sportsItems.slice().filter((val) => val.value == Sport || !Sport && !val.value )[0];
        //
        // // prepare lig filter
        // AllLeague && AllLeague.unshift('All') || (AllLeague = ['All']);
        // if (AllLeague) ligItems = ligItems.concat(AllLeague.map((val) => { return { value: val === 'All' ? '' : val, label: val} }));
        // currLig = ligItems.slice().filter((val) => val.value == League || !League && !val.value )[0];


        // sort title (см. как на HomeEvents)
        // let titleAttr = sortVal => (CurrentOrderBy ? CurrentOrderBy === "Asc" ? "sorted ascending" : "sorted descending" : 'click for sorting');

        return (
                <div class="">
                    <div class="box-header">
                        <h3 class="box-title">Users</h3>
                    </div>

                    <div class="box-body pad table-responsive">
{/*
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="form-group">
                                    <label>Filter by sport</label>
                                    <DropBox name="selected-state" items={sportsItems}
                                        /*items={[
                                            { value: '1', label: 'var 1'},
                                            { value: '2', label: 'var 2'},
                                        ]}
                                        clearable={false} value={currSport} searchable={true} afterChange={this._onFiterClick.bind(this, {Sport, League, sort: StartDateSort, OrderBy: 'Asc', page: 1}, 'Sport')}/>
                                </div>
                            </div>

                            { ligItems.length > 1 &&
                                <div className="col-sm-3">
                                    <div className="form-group">
                                        <label>Filter by ligue</label>
                                        <DropBox name="selected-state" items={ligItems}
                                            clearable={false} value={currLig} searchable={true} afterChange={this._onFiterClick.bind(this, {Sport, League, sort: StartDateSort, OrderBy: 'Asc', page: 1}, 'League')}/>
                                    </div>
                                </div>
                            }
                        </div>
*/}



                        <table class="table exchanges">
                            <thead>
                            <tr>
                                <th><span>Login</span></th>
                                <th><span>Name</span></th>
                                <th><span>E-mail</span></th>
                                <th><span>Country</span></th>
                            </tr>
                            </thead>
                            <tbody>
                            { Users && Users.length ?
                                Users.map((item) =>
                                    <tr key={item.Email}>
                                        <td>
                                            {item.UserName}
                                        </td>
                                        <td>{item.LastName} {item.FirstName}</td>
                                        <td>{item.Email}</td>
                                    </tr>
                                )
                                :
                                <tr colSpan="4">
                                    <td><i>No users</i></td>
                                </tr>
                            }
                            </tbody>
                        </table>

{/*
                        <div className="row">
                            <div className="col-xs-12">
                                <PagerBox total={PageInfo.TotalPages} current={PageInfo.CurrentPage - 1} visiblePage={5} onPageChange={this._onPagerClick.bind(this, {Sport, League, sort: StartDateSort, OrderBy: CurrentOrderBy})} />
                                </div>
                        </div>
*/}

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
     * Click on sport filter
     * @private
     */
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


    /**
     * Click on column header
     * @private
     */
    _onSortClick(props, ee)
    {
        const { actions, data } = this.props;

        ee.preventDefault();
        props.page = 1;

        this.sendingMode(true);
        actions.actionGetNewTableData({props, callback: ::this._onSortCallback});
    }


    /**
     * Click on pager
     * @private
     */
    _onPagerClick(props, newPage)
    {
        const { actions } = this.props;

        this.sendingMode(true);

        props.page = newPage + 1;

        actions.actionGetNewTableData({props, callback: ::this._onSortCallback});
    }


    /**@private*/ _onSortCallback({errorCode, title, message})
    {
        this.sendingMode(false);

        if( errorCode !== 100)
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
        data: state.Users,
        // test: state.Ttest,
    })
    },
    dispatch => ({
        actions: bindActionCreators(Framework.initAction(Actions), dispatch),
    })
)(Users)
