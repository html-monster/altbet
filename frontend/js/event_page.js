angular.module("orders", [])
          .controller("ordersCtrl", function ($scope) {
						// var object = JSON.parse('{"MessageID":"b71b1dd2-a7b2-48e5-93c0-c3219a21cd11","MessageType":"WebSoketOrdersResponse","ActiveOrders":[{"Orders":[{"SPS":[{"Price":0.33000000,"Quantity":10},{"Price":0.35000000,"Quantity":10},{"Price":0.42000000,"Quantity":10},{"Price":0.54000000,"Quantity":10}, {"Price":0.54000000,"Quantity":10}, {"Price":0.59000000,"Quantity":15}, {"Price":0.59000000,"Quantity":15},{"Price":0.59000000,"Quantity":15}, {"Price":0.59000000,"Quantity":15},{"Price":0.59000000,"Quantity":15}, {"Price":0.59000000,"Quantity":15}, {"Price":0.59000000,"Quantity":15}, {"Price":0.59000000,"Quantity":15}],"Side":1},{"SPS":[{"Price":0.02000000,"Quantity":10},{"Price":0.07000000,"Quantity":10},{"Price":0.21000000,"Quantity":10},{"Price":0.25000000,"Quantity":10}],"Side":0}],"Symbol":{"Currency":"USD","Exchange":"THIRD","Name":"SOMETHING"}},{"Orders":[{"SPS":[{"Price":0.04000000,"Quantity":10},{"Price":0.29000000,"Quantity":10},{"Price":0.41000000,"Quantity":10}],"Side":0},{"SPS":[{"Price":0.75000000,"Quantity":10},{"Price":0.78000000,"Quantity":10}],"Side":1}],"Symbol":{"Currency":"USD","Exchange":"SECOND","Name":"EUR\/USD"}}],"Ticks":[{"Symbol":{"Currency":"USD","Exchange":"THIRD","Name":"SOMETHING"},"Ticks":[{"MessageID":"4d30701e-f2b3-4345-ac1c-693fba90c30a","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.01000000,"Symbol":{"Currency":"USD","Exchange":"THIRD","Name":"SOMETHING"},"Time":"\/Date(1461780611633+0300)\/","Volume":10},{"MessageID":"05f0bb1e-30be-4922-9d0f-5e8e925dc3fa","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.03000000,"Symbol":{"Currency":"USD","Exchange":"THIRD","Name":"SOMETHING"},"Time":"\/Date(1461780613097+0300)\/","Volume":10},{"MessageID":"47195d67-64c4-4b92-8ed7-f7817bf2f009","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.29000000,"Symbol":{"Currency":"USD","Exchange":"THIRD","Name":"SOMETHING"},"Time":"\/Date(1461780605633+0300)\/","Volume":10}]}]}'),
								// buy = object.ActiveOrders[0].Orders[0].SPS;
								// sell = object.ActiveOrders[0].Orders[1].SPS,
								// ticks = object.Ticks[0].Ticks;
						// for(var ii = 0; ii < ticks.length; ii++){
						// 	ticks[ii].Time = dateParse(new Date(+ticks[ii].Time.slice(6, -7)));
						// }
						// $scope.orderBuy = buy;
						// $scope.orderSell = sell;
						// $scope.ticks = ticks;
						var object = JSON.parse('{"MessageID":"ba6c95e4-d9d2-446a-9c81-56a68e4ac422","MessageType":"GetOrdersResponse","ActiveOrders":[{"MessageID":"27f61766-1953-41eb-bb48-6540b9ee0150","MessageType":"NewOrderRequest","Account":"seller@seller.ua","ExpirationDate":"\/Date(4102441200000)\/","ID":"13562214-4a93-4b14-89e4-b00e47f1de59","LimitPrice":0.90000000,"OrderType":2,"Quantity":10000,"Side":1,"StopPrice":0.00000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462457558783)\/","TimeInForce":0,"isMirror":0},{"MessageID":"b4d2077b-9e75-47df-9a53-102d1d8d83dc","MessageType":"NewOrderRequest","Account":"buyer@buyer.ua","ExpirationDate":"\/Date(4102441200000)\/","ID":"4ab43cd3-2c08-41fb-a2b9-247a4807f9b0","LimitPrice":0.05000000,"OrderType":2,"Quantity":10000,"Side":0,"StopPrice":0.00000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462462806933)\/","TimeInForce":0,"isMirror":0},{"MessageID":"3bd596c8-4b17-4303-b3b6-6de0518f585b","MessageType":"NewOrderRequest","Account":"buyer@buyer.ua","ExpirationDate":"\/Date(4102441200000)\/","ID":"88eae391-6205-453a-b91d-a65533b8667c","LimitPrice":0.09000000,"OrderType":2,"Quantity":150,"Side":0,"StopPrice":0.00000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462462819320)\/","TimeInForce":0,"isMirror":0}],"Ticks":[{"MessageID":"b11a1033-1008-40ed-b986-5ce2c3a5b670","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.90000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462465943240+0300)\/","Volume":10000},{"MessageID":"c7e2c65b-15e2-40e4-8fd8-65ab71dae5ce","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.90000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462465946890+0300)\/","Volume":10},{"MessageID":"61e6f734-394c-4fbd-af2f-2aac9ab2e357","MessageType":"Tick","Ask":0,"AskSize":0,"Bid":0,"BidSize":0,"Currency":"USD","Price":0.90000000,"Symbol":{"Currency":"USD","Exchange":"FIRST","Name":"UAH\/USD"},"Time":"\/Date(1462466163583+0300)\/","Volume":10}]}'),
								buy = [], sell = [], ticks;
						for(var ii = 0; ii < object.ActiveOrders.length; ii++){
							if(object.ActiveOrders[ii].Side == 0){
								buy.push(object.ActiveOrders[ii]);
							}
							else{
								sell.push(object.ActiveOrders[ii]);
							}
						}
						console.log(buy);
						ticks = object.Ticks;
						for(ii = 0; ii < ticks.length; ii++){
							ticks[ii].Time = dateParse(new Date(+ticks[ii].Time.slice(6, -7)));
						}
						$scope.orderBuy = buy;
						$scope.orderSell = sell;
						$scope.ticks = ticks;
					});
function dateParse(date){
	var dd = date.getDate(),
			mm = date.getMonth()+1,
			yyyy = date.getFullYear(),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds();

	if(dd < 10)
		dd = '0' + dd;
	if(mm < 10)
		mm = '0' + mm;
	if(hours < 10)
		hours = '0' + hours;
	if(minutes < 10)
		minutes = '0' + minutes;
	if(seconds < 10)
		seconds = '0' + seconds;

	if(hours)
	return dd + '/' + mm + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}
