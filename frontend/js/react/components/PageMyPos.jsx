/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {TabMyPos} from './pageMyPos/TabMyPos';
import {TabOpenOrders} from './pageMyPos/TabOpenOrders';
import {MyOrderHistoryTabData} from './pageMyPos/myOrderHistoryTabData';
import BaseController from '../containers/BaseController';
import actions from '../actions/ordersPageActions';
import myPositionsActions from '../actions/OrderPage/myPositionsActions.ts';
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
                        <TabOpenOrders data={openOrdersData}/>

                        {/* // BM: --------------------------------------------------- MY POSITIONS ---*/}
                        <TabMyPos data={positionData} actions={this.props.myPositionsActions}/>


                        {/* // BM: --------------------------------------------------- ORDER HISTORY ---*/}
                        <div className="tab_item">
                            <div className="my_position_tab">
                                <div className="wrapper">
                                    <div className="my_order_history table_content" id="my_order_history">
                                        <MyOrderHistoryTabData key="my_order_history" data={historyData}/>
                                    </div>
                                </div>
                            </div>
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
        actions: bindActionCreators(actions, dispatch),
        myPositionsActions: bindActionCreators(myPositionsActions, dispatch),
    })
)(PageMyPos)