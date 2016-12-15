import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar.jsx';
import PageMyPos from './components/PageMyPos.jsx';


window.ee = new EventEmitter();


if(globalData.myPosOn) {
	// временно рендерим PageMyPos
	ReactDOM.render(
			<PageMyPos data={{openOrdersData, positionData, historyData}}/>
			,
			document.getElementById('DiPageMyAssets')
	);
}

// временно рендерим Sidebar
// if(!globalData.userPageOn){
// 	ReactDOM.render(
// 			<Sidebar
// 					data={appData.yourOrders}
// 					globalData={globalData}
// 			/>
// 			,
// 			document.getElementById('sidebar')
// 	);
// }