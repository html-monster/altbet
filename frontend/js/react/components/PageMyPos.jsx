/**
 * Created by Vlasakh on 20.11.16.
 */

// import React, {PropTypes, Component} from 'react'
const MyPosApp = require('./myPositions.jsx');
const MyOpenOrdersApp = require('./myOpenOrders.jsx');
const MyOrderHistoryApp = require('./myPosHistory.jsx');


export default class PageMyPos extends React.Component
{
    constructor()
    {
        super();
        if( __DEV__ )
        {
            this.propTypes = {
                data: React.PropTypes.shape({
                    positionData: React.PropTypes.number.isRequired,
                    historyData: React.PropTypes.array.isRequired,
                })
            };
        } // endif
    }
    // onYearBtnClick(e) {
    //     // this.props.actions.getPhotos(+e.target.getAttribute('data-year'));
    // }

    render()
    {
        const { openOrdersData, positionData, historyData } = this.props.data;

        return <div className="my_position">
                <div className="container">
                    <div className="tabs">
                        <span className="tab hello">Open orders</span>
                        <span className="tab active hello">My positions</span>
                        <span className="tab hello">History</span>
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
                                                            <MyOpenOrdersApp
                                                                    key="openOrders_Sport"
                                                                    data={positionControllerClass.filterData(openOrdersData, 'openOrders_Sport')}
                                                                    id={'openOrders_Sport'}
                                                            />
                                                            <MyOpenOrdersApp
                                                                    key="openOrders_Finance"
                                                                    data={positionControllerClass.filterData(openOrdersData, 'openOrders_Finance')}
                                                                    id={'openOrders_Finance'}
                                                            />
                                                            <MyOpenOrdersApp
                                                                    key="openOrders_E-sport"
                                                                    data={positionControllerClass.filterData(openOrdersData, 'openOrders_E-sport')}
                                                                    id={'openOrders_E-sport'}
                                                            />
                                                            <MyOpenOrdersApp
                                                                    key="openOrders_Society"
                                                                    data={positionControllerClass.filterData(openOrdersData, 'openOrders_Society')}
                                                                    id={'openOrders_Society'}
                                                            />
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
                        <div className="tab_item">
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
                                                        <th><span className="profit">Profit</span> | <span className="loss">Loss</span></th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                            </table>

                                            <div id="my_position_container">
                                                {
                                                    (positionData && positionData.length) ?
                                                        <div>
                                                            <MyPosApp
                                                                    key="MyPos_Sport"
                                                                    data={positionControllerClass.filterData(positionData, 'MyPos_Sport')}
                                                                    id={'MyPos_Sport'}
                                                            />
                                                            <MyPosApp
                                                                    key="MyPos_Finance"
                                                                    data={positionControllerClass.filterData(positionData, 'MyPos_Finance')}
                                                                    id={'MyPos_Finance'}
                                                            />
                                                            <MyPosApp
                                                                    key="MyPos_E-sport"
                                                                    data={positionControllerClass.filterData(positionData, 'MyPos_E-sport')}
                                                                    id={'MyPos_E-sport'}
                                                            />
                                                            <MyPosApp
                                                                    key="MyPos_Society"
                                                                    data={positionControllerClass.filterData(positionData, 'MyPos_Society')}
                                                                    id={'MyPos_Society'}
                                                            />
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
                                        <MyOrderHistoryApp key="my_order_history" data={historyData}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    }
}

// if( __DEV__ )
// {
//     PageMyPos.propTypes = {
//         data: React.PropTypes.shape({
//             positionData: PropTypes.number.isRequired,
//             historyData: PropTypes.array.isRequired,
//         })
//     };
// } // endif
