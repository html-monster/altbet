var ajaxControlTraderClass = new function () {
	function onSuccessAjax(data) {
		if(data)
		 console.log('Relax... ajax was sent');
	}
	function onErrorAjax(x, y) {
		console.log('XMLHTTPRequest object: ', x);
		console.log('textStatus: ',  y);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
	this.ajaxDataSender = function(method) {
		let url = `${globalData.rootUrl}Order/${method}`,
				data = {};

		data.symbol = ($('.active_trader').attr('id')).slice(7);
		defaultMethods.sendAjaxRequest({
			httpMethod: 'POST',
			callback: onSuccessAjax,
			onError: onErrorAjax,
			url: url,
			data: data});
	};
	// this.CancelAll = function () {
	// 	let url = globalData.rootUrl + 'Order/CancelAll',
	// 			data = {};
	//
	// 	data.symbol = ($('.active_trader').attr('id')).slice(7);
	// 	defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	// };
	// this.ReverseAll = function () {
	// 	let url = globalData.rootUrl + 'Order/ReverseAll',
	// 			data = {};
	//
	// 	data.symbol = ($('.active_trader').attr('id')).slice(7);
	// 	defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	// };
	// this.CloseOut = function () {
	// 	let url = globalData.rootUrl + 'Order/CloseOut',
	// 			data = {};
	//
	// 	data.symbol = ($('.active_trader').attr('id')).slice(7);
	// 	defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	// };
};
