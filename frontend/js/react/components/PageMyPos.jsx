/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {TabMyPos} from './pageMyPos/TabMyPos';
import {TabOpenOrders} from './pageMyPos/TabOpenOrders';
import {TabMyOrderHistory} from './pageMyPos/TabHistory';
import BaseController from '../containers/BaseController';
import actions from '../actions/ordersPageActions';
import myPositionsActions from '../actions/OrderPage/myPositionsActions.ts';
import yourOrdersActions from '../actions/Sidebar/yourOrderActions.ts';
import defaultOrderSidebarActions from '../actions/Sidebar/tradeSlip/defaultOrderSidebarActions';
import classnames from 'classnames';
// import {Common} from '../common/Common';



class PageMyPos extends BaseController //React.Component
{
    constructor(props)
    {
        super(props);
        __DEV__ && console.log( 'PageMyPos props', props );

        props.actions.actionOnLoad();

        let {openOrdersData, positionData, historyData} = props.data;
        this.state = {data: {openOrdersData, positionData, historyData}};
    }



    componentDidMount()
    {
        window.ee.addListener('myOpenOrder.update', (newData) =>
        {
            // __DEV__ && console.debug('newData 1111', this.state.data.openOrdersData, newData);
            // let prevData = self.state.data;
            // newData = newData && newData.length ? positionControllerClass.filterData(newData, self.props.id) : [];
            if (JSON.stringify(this.state.data.openOrdersData) != JSON.stringify(newData))
            {
                newData = Object.assign(this.state.data, {openOrdersData: newData});
                this.setState(newData);
            } // endif
        });

        window.ee.addListener('myPosOrder.update', (newData) =>
        {
            // 0||console.log( 'newData', newData );
            newData = Object.assign(this.state.data, {positionData: newData});
            this.setState(newData);
        });
    }



    render()
    {
        const { openOrdersData, positionData, historyData } = this.state.data;
        const { defaultOrderActions, yourOrdersActions, route } = this.props;


        return <div className="my_position">
                <div className="container">
                    <ul className="tabs tabs_left">
                        {/*<span className="tab">Open Games</span>*/}
                        {/*<span className="tab active">My Games</span>*/}
                        {/*<span className="tab">History</span>*/}
                        <li className={classnames("tab ", {"active" : route.tab === "open-games"})}><Link to={`/open-games`}>Open Games</Link></li>
                        <li className={classnames("tab ", {"active" : route.tab === "my-games"})}><Link to={`/my-games`}>My Games</Link></li>
                        <li className={classnames("tab ", {"active" : route.tab === "history"})}><Link to={`/history`}>History</Link></li>
                    </ul>

                    <div className="tab_content">
                        {/* // BM: --------------------------------------------------- OPENED ORDERS ---*/}
                        <div className={classnames("tab_item", {"active" : route.tab === "open-games"})}>
                            {/*{route.tab === "open-games" && ""}*/}
                            <TabOpenOrders data={openOrdersData} yourOrdersActions={yourOrdersActions}/>
                        </div>

                        {/* // BM: --------------------------------------------------- MY POSITIONS ---*/}
                        <div className={classnames("tab_item", {"active" : route.tab === "my-games"})}>
                            <TabMyPos data={positionData} defaultOrderActions={defaultOrderActions} actions={this.props.myPositionsActions}/>
                        </div>

                        {/* // BM: --------------------------------------------------- ORDER HISTORY ---*/}
                        <div className={classnames("tab_item", {"active" : route.tab === "history"})}>
                            <TabMyOrderHistory key="my_order_history" data={historyData}/>
                        </div>
                    </div>
                </div>
            </div>
    }
}


export default connect(
    state => ({
        data: state.myPosReduce,
        // test: state.Ttest,
    }),
    dispatch => ({
		defaultOrderActions: bindActionCreators(defaultOrderSidebarActions, dispatch),
		yourOrdersActions: bindActionCreators(yourOrdersActions, dispatch),
        actions: bindActionCreators(actions, dispatch),
        myPositionsActions: bindActionCreators(myPositionsActions, dispatch),
    })
)(PageMyPos)