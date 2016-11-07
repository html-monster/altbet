var ajaxControlTraderClass = new function () {
	function onSuccessAjax(data) {
		// data = data.split('_');
		//
		// console.log('Order sending finished: ' + data[0]);
	}
	function onErrorAjax(x, y, z) {
		console.dir('XMLHTTPRequest object: ', x);
		console.dir('textStatus: ',  y);
		console.dir('errorThrown: ',  z);
		defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
	}
	this.cancelAll = function () {
		let url = globalData.rootUrl + 'Order/CancelAll',
				data = {};

		data.symbol = ($('.active_trader').attr('id')).slice(7);
		defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	};
	this.reverseAll = function () {
		let url = globalData.rootUrl + 'Order/ReverseAll',
				data = {};

		data.symbol = ($('.active_trader').attr('id')).slice(7);
		defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	};
	this.closeOut = function () {
		let url = globalData.rootUrl + 'Order/CloseOut',
				data = {};

		data.symbol = ($('.active_trader').attr('id')).slice(7);
		defaultMethods.sendAjaxRequest('POST', onSuccessAjax, onErrorAjax, url, null, data);
	};
};
