/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {TabMyPos} from './pageMyPos/TabMyPos';
import {TabOpenOrders} from './pageMyPos/TabOpenOrders';
import {TabMyOrderHistory} from './pageMyPos/TabHistory';
import BaseController from '../containers/BaseController';
import actions from '../actions/ordersPageActions';
import myPositionsActions from '../actions/OrderPage/myPositionsActions.ts';
import yourOrdersActions from '../actions/Sidebar/yourOrderActions.ts';
import * as defaultOrderActions from '../actions/Sidebar/tradeSlip/defaultOrderActions';
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
        const { defaultOrderActions, yourOrdersActions } = this.props;
        // __DEV__ && console.log( 'PageMyPos props', this.props.route );

        // const myOpenOrdersFilters = ['openOrders_Sport', 'openOrders_Finance', 'openOrders_E-sport', 'openOrders_Society'];
        // const myPosFilers = ['MyPos_Sport', 'MyPos_Finance', 'MyPos_E-sport', 'MyPos_Society'];

        return <div className="my_position">
                <div className="container">
                    <div className="tabs">
                        <span className="tab">Open orders</span>
                        <span className="tab active">My positions</span>
                        <span className="tab">History</span>
                    </div>

                    <div className="tab_content">


                        {/* // BM: --------------------------------------------------- OPENED ORDERS ---*/}
                        <TabOpenOrders data={openOrdersData} yourOrdersActions={yourOrdersActions}/>

                        {/* // BM: --------------------------------------------------- MY POSITIONS ---*/}
                        <TabMyPos data={positionData} defaultOrderActions={defaultOrderActions} actions={this.props.myPositionsActions}/>


                        {/* // BM: --------------------------------------------------- ORDER HISTORY ---*/}
                        <TabMyOrderHistory key="my_order_history" data={historyData}/>
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
		defaultOrderActions: bindActionCreators(defaultOrderActions, dispatch),
		yourOrdersActions: bindActionCreators(yourOrdersActions, dispatch),
        actions: bindActionCreators(actions, dispatch),
        myPositionsActions: bindActionCreators(myPositionsActions, dispatch),
    })
)(PageMyPos)