/**
 * Created by Vlasakh on 20.11.16.
 */

import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import MyPosTabData from './pageMyPos/myPosTabData';
import MyOpenOrdersTabData from './pageMyPos/myOpenOrdersTabData';
import {MyOrderHistoryTabData} from './pageMyPos/myOrderHistoryTabData';
import BaseController from '../containers/BaseController';
import actions from '../actions/ordersPageActions';
import {Common} from '../common/Common';


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

        // __DEV__||console.debug( 'openOrdersData ', openOrdersData  );
        const myOpenOrdersFilters = ['openOrders_Sport', 'openOrders_Finance', 'openOrders_E-sport', 'openOrders_Society'];
        const myPosFilers = ['MyPos_Sport', 'MyPos_Finance', 'MyPos_E-sport', 'MyPos_Society'];

        return <div className="my_position">
                <div className="container">
                    <div className="tabs">
                        <span className="tab">Open orders</span>
                        <span className="tab active">My positions</span>
                        <span className="tab">History</span>
                    </div>

                    <div className="tab_content">


                        {/* // BM: --------------------------------------------------- OPENED ORDERS ---*/}
                        <div className="tab_item">
                            <div className="my_position_tab">
                                <div className="wrapper">
                                    <div className="filters">
                                        <input type="checkbox" id="cb1" className="checkbox" value="openOrders_Sport" defaultChecked={true} />
                                        <label htmlFor="cb1" className="sport"><span className="sub_tab">Sport</span></label>{' '}
                                        <input type="checkbox" id="cb2" className="checkbox" value="openOrders_Finance" defaultChecked={true} />
                                        <label htmlFor="cb2" className="finance"><span className="sub_tab">Finance</span></label>{' '}
                                        <input type="checkbox" id="cb3" className="checkbox" value="openOrders_E-sport" defaultChecked={true} />
                                        <label htmlFor="cb3" className="e_sport"><span className="sub_tab">E-sport</span></label>{' '}
                                        <input type="checkbox" id="cb4" className="checkbox" value="openOrders_Society" defaultChecked={true} />
                                        <label htmlFor="cb4" className="society"><span className="sub_tab">Society</span></label>
                                    </div>
                                    <div className="tab_content">
                                        <div className="open_orders table_content">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Symbol</th>
                                                        <th>Time</th>
                                                        <th>Type</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>Latest</th>
                                                        <th>Position</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div id="open_orders">
                                                {
                                                    (openOrdersData && openOrdersData.length) ?
                                                        <table>
                                                                    {/*data={positionControllerClass.filterData(openOrdersData, 'openOrders_Sport')}*/}
                                                            {
                                                                myOpenOrdersFilters.map((val) =>
                                                                    <MyOpenOrdersTabData
                                                                            key={val}
                                                                            data={openOrdersData}
                                                                            id={val}
                                                                    />)
                                                            }
                                                        </table>
                                                        :
                                                        <p>You have no order or positions</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* // BM: --------------------------------------------------- MY POSITIONS ---*/}
                        <div className="tab_item active">
                            <div className="my_position_tab">
                                <div className="wrapper">
                                    <div className="filters">
                                        <input type="checkbox" id="cb5" className="checkbox" value="MyPos_Sport" defaultChecked={true} />
                                        <label htmlFor="cb5" className="sport"><span className="sub_tab">Sport</span></label>&nbsp;
                                        <input type="checkbox" id="cb6" className="checkbox" value="MyPos_Finance" defaultChecked={true} />
                                        <label htmlFor="cb6" className="finance"><span className="sub_tab">Finance</span></label>&nbsp;
                                        <input type="checkbox" id="cb7" className="checkbox" value="MyPos_E-sport" defaultChecked={true} />
                                        <label htmlFor="cb7" className="e_sport"><span className="sub_tab">E-sport</span></label>&nbsp;
                                        <input type="checkbox" id="cb8" className="checkbox" value="MyPos_Society" defaultChecked={true} />
                                        <label htmlFor="cb8" className="society"><span className="sub_tab">Society</span></label>
                                    </div>
                                    <div className="tab_content">
                                        <div className="my_position_container table_content">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Symbol</th>
                                                        <th>Type</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th><span className="sell">BID</span> | <span className="buy">ASK</span></th>
                                                        <th><span className="profit">Profit</span>/<span className="loss">Loss</span></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                            </table>

                                            <div id="my_position_container">
                                                                    {/*data={positionControllerClass.filterData(positionData, 'MyPos_Sport')}*/}
                                                {
                                                    (positionData && positionData.length) ?
                                                        <div>
                                                            {
                                                                myPosFilers.map((val) =>
                                                                    <MyPosTabData
                                                                            key={val}
                                                                            data={positionData}
                                                                            id={val}
                                                                    />)
                                                            }
                                                        </div>
                                                        :
                                                        <p>You have no positions</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


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
    })
)(PageMyPos)