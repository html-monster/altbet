import React from 'react';
import ReactDOM from 'react-dom';
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