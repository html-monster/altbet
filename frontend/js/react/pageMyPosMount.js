// const ReactDOM = require('react-dom');
// const React = require('react');
import PageMyPos from './components/pageMyPos.jsx';
// const MyPosApp = require('./components/myPositions.jsx');
// const MyOpenOrdersApp = require('./components/myOpenOrders.jsx');
// const MyOrderHistoryApp = require('./components/myPosHistory.jsx');
window.ee = new EventEmitter();

if(globalData.myPosOn){
	    // временно рендерим PageMyPos
        ReactDOM.render(
            <PageMyPos data={{positionData, historyData}}/>
            ,
            document.getElementById('DiPageMyAssets')
        );



		// ReactDOM.render(
		// 	(positionData && positionData.length) ?
		// 		<div>
		// 			<MyPosApp
		// 					key="MyPos_Sport"
		// 					data={positionControllerClass.filterData(positionData, 'MyPos_Sport')}
		// 					id={'MyPos_Sport'}
		// 			/>
		// 			<MyPosApp
		// 					key="MyPos_Finance"
		// 					data={positionControllerClass.filterData(positionData, 'MyPos_Finance')}
		// 					id={'MyPos_Finance'}
		// 			/>
		// 			<MyPosApp
		// 					key="MyPos_E-sport"
		// 					data={positionControllerClass.filterData(positionData, 'MyPos_E-sport')}
		// 					id={'MyPos_E-sport'}
		// 			/>
		// 			<MyPosApp
		// 					key="MyPos_Society"
		// 					data={positionControllerClass.filterData(positionData, 'MyPos_Society')}
		// 					id={'MyPos_Society'}
		// 			/>
		// 		</div>
		// 		:
		// 		<p>You have no positions</p>
		// 		,
		// 		document.getElementById('my_position_container')
		// );


    // ReactDOM.render(
    //     (openOrdersData && openOrdersData.length) ?
    //         <table>
    //             <MyOpenOrdersApp
    //                     key="openOrders_Sport"
    //                     data={positionControllerClass.filterData(openOrdersData, 'openOrders_Sport')}
    //                     id={'openOrders_Sport'}
    //             />
    //             <MyOpenOrdersApp
    //                     key="openOrders_Finance"
    //                     data={positionControllerClass.filterData(openOrdersData, 'openOrders_Finance')}
    //                     id={'openOrders_Finance'}
    //             />
    //             <MyOpenOrdersApp
    //                     key="openOrders_E-sport"
    //                     data={positionControllerClass.filterData(openOrdersData, 'openOrders_E-sport')}
    //                     id={'openOrders_E-sport'}
    //             />
    //             <MyOpenOrdersApp
    //                     key="openOrders_Society"
    //                     data={positionControllerClass.filterData(openOrdersData, 'openOrders_Society')}
    //                     id={'openOrders_Society'}
    //             />
    //         </table>
    //         :
    //         <p>You have no order or positions</p>
    //         ,
    //         document.getElementById('open_orders')
		// );


	// ReactDOM.render(
	// 		<MyOrderHistoryApp
	// 				key="my_order_history"
	// 				data={historyData}
	// 		/>
	// 		,
	// 		document.getElementById('my_order_history')
	// );
}
