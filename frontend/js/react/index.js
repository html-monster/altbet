/*import 'babel-polyfill';
// import React, { Component } from 'react'
// import React from 'react';
// import { render } from 'react-dom';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppAltbet from './containers/AppAltbet';
import configureStore from './store/configureStore';

// const store = createStore( () => {}, {});
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <AppAltbet />
    </Provider>,
  document.getElementById('root')
);

// --display-error-details
// --display-modules

__DEV__&&console.warn( '__DEV__', __DEV__ );*/

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
if(!globalData.userPageOn){
	ReactDOM.render(
			<Sidebar
					data={appData.yourOrders}
					globalData={globalData}
			/>
			,
			document.getElementById('sidebar')
	);
}

let olol = '{"CategoryList":null,"CategoryName":null,"GainLoss":-1960.12,"Invested":5419.72,"Orders":[{"Side":1,"SummaryPositionPrice":[{"ParticularUserQuantity":500,"Price":0.51,"Quantity":500},{"ParticularUserQuantity":0,"Price":0.53,"Quantity":3996},{"ParticularUserQuantity":50,"Price":0.54,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.55,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.56,"Quantity":50},{"ParticularUserQuantity":550,"Price":0.57,"Quantity":550},{"ParticularUserQuantity":20,"Price":0.58,"Quantity":20}]},{"Side":0,"SummaryPositionPrice":[{"ParticularUserQuantity":20,"Price":0.38,"Quantity":20},{"ParticularUserQuantity":10,"Price":0.4,"Quantity":10}]}],"Positions":8620,"Symbol":{"AwayAlias":"NNN","AwayHandicap":3.5,"AwayName":"New England Patriots","AwayPoints":null,"CategoryId":"1518ed47-ee93-4979-93de-344d526c3e36","Currency":"USD","Exchange":"BBB-NNN-12312016","FullName":"Buffalo Bills_vs_New England Patriots","HomeAlias":"BBB","HomeHandicap":-3.5,"HomeName":"Buffalo Bills","HomePoints":null,"LastAsk":0.6,"LastBid":0.49,"LastPrice":0.53,"LastSide":0,"Name":"BBB-NNN","StartDate":"/Date(1483138800000+0200)/","Status":"inprogress"}}';
let olos = '{"CategoryList":null,"CategoryName":null,"GainLoss":-1960.12,"Invested":5419.72,"Orders":[{"Side":1,"SummaryPositionPrice":[{"ParticularUserQuantity":500,"Price":0.51,"Quantity":500},{"ParticularUserQuantity":0,"Price":0.53,"Quantity":3996},{"ParticularUserQuantity":50,"Price":0.54,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.55,"Quantity":50},{"ParticularUserQuantity":50,"Price":0.56,"Quantity":50},{"ParticularUserQuantity":550,"Price":0.57,"Quantity":550},{"ParticularUserQuantity":20,"Price":0.58,"Quantity":20}]},{"Side":0,"SummaryPositionPrice":[{"ParticularUserQuantity":20,"Price":0.38,"Quantity":20},{"ParticularUserQuantity":10,"Price":0.4,"Quantity":10}]}],"Positions":8620,"Symbol":{"AwayAlias":"NNN","AwayHandicap":3.5,"AwayName":"New England Patriots","AwayPoints":null,"CategoryId":"1518ed47-ee93-4979-93de-344d526c3e36","Currency":"USD","Exchange":"BBB-NNN-12312016","FullName":"Buffalo Bills_vs_New England Patriots","HomeAlias":"BBB","HomeHandicap":-3.5,"HomeName":"Buffalo Bills","HomePoints":null,"LastAsk":0.51,"LastBid":0.4,"LastPrice":0.53,"LastSide":0,"Name":"BBB-NNN","StartDate":"/Date(1483138800000+0200)/","Status":"inprogress"}}';