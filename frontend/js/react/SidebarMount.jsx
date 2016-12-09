import Sidebar from './components/Sidebar.jsx';

// временно рендерим Sidebar
ReactDOM.render(
		<Sidebar data={appData.yourOrders}/>
		,
		document.getElementById('sidebar')
);
