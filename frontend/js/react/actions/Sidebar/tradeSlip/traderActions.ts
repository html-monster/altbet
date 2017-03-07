/**
 * Created by Htmlbook on 27.01.2017.
 */
import {
	TRADER_ON_SOCKET_MESSAGE,
	TRADER_ON_EXCHANGE_CHANGE,
	TRADER_ON_QUANTITY_CHANGE,
	TRADER_ON_SPREAD_CHANGE,
	TRADER_ON_ADD_ORDER,
	TRADER_ON_DELETE_ORDER,
	TRADER_ON_SPREAD_HIGHLIGHT
} from '../../../constants/ActionTypesActiveTrader';
import { ON_ACTIVE_SYMBOL_CHANGED } from '../../../constants/ActionTypesSidebar.js';
import BaseActions from '../../BaseActions';
import {RebuildServerData} from './activeTrader/rebuildServerData';
// import {OddsConverterObj} from '../../models/oddsConverter/oddsConverter.js';

declare var orderClass;
let initialStart = true;

class Actions extends BaseActions
{
	public actionOnSocketMessage(context)
	{
		return (dispatch, getState) =>
		{
			// let trader = $('.active_trader');
			// let tbody = $('table.limit tbody');
			const { traderActions } = context.props;
			let isMirror;

			window.ee.addListener('activeOrders.update', (newData) => {
				const state = getState();
				// if($('#IsMir	ror').length)
				// 	isMirror = $('#IsMirror').val() == 'False' ? 0 : 1;
				// else
				// 	isMirror = trader.find('.event_name').eq(0).hasClass('active') ? 0 : 1;
				isMirror = !state.sidebar.activeExchange.isMirror ? 0 : 1;

				// let symbol = $('.active_trader').attr('id');
				// if(!symbol) return;
				// symbol = symbol.slice(7);
				const symbol = state.sidebar.activeExchange.name;

				let currSymbData : any = {};

				$(newData).each(function(){
					// let currentSymbol = `${this.Symbol.Exchange}_${this.Symbol.Name}_${this.Symbol.Currency}`;
					let currentSymbol = this.Symbol.Exchange;

					if(symbol == currentSymbol) {
						currSymbData = this;
						return false;
					}
				});

				// newData = Object.assign({}, this.state.data, newData);
				if(currSymbData && currSymbData.Symbol){
					if(currSymbData.Symbol.LastAsk == 1) currSymbData.Symbol.LastAsk = null;
					if(currSymbData.Symbol.LastBid == 0) currSymbData.Symbol.LastBid = null;
				}
				// console.log(JSON.stringify(state.activeTrader.data), JSON.stringify(currSymbData));
				if(JSON.stringify(state.activeTrader.data) != JSON.stringify(currSymbData) || state.activeTrader.isMirror != isMirror){
					dispatch({
						type: TRADER_ON_SOCKET_MESSAGE,
						payload: {
							data: currSymbData,
							rebuiltServerData: traderActions.actionOnServerDataRebuild(currSymbData, isMirror)}
					});
					// __DEV__ && console.log('re-render');
				}
				if(state.activeTrader.activeExchange != symbol || state.activeTrader.isMirror != isMirror){
					setTimeout(() => {this._scrollTo(context, currSymbData, isMirror)}, initialStart ? 400 : 100);
					console.log(this._scrollTo);
					if(initialStart) initialStart = false;
					dispatch({
						type: TRADER_ON_EXCHANGE_CHANGE,
						payload: {
							isMirror: isMirror,
							activeExchange: symbol
						}
					});
					$(context.refs.activeTrader).removeClass('loading');
					// state.activeTrader.activeExchange = symbol;
				}
				// console.log(currSymbData);
				// setTimeout(activeTraderClass.scrollTo(), 100);
				// tbody.addClass('scroll_dis');
				// activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), true);
				// activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
			});
		};

	}

	public actionOnQuantityChange(context, event)
	{
		return (dispatch) => {
			if(event.target.value){
				const closeButton = $(context.refs.inputQuantity).prev('.clear');
				closeButton.show();
				setTimeout(() => {
					closeButton.addClass('active');
				}, 100);
			}
			else{
				const closeButton = $(context.refs.inputQuantity).prev('.clear');
				const spreaderCloseButton = $(context.refs.inputSpread).prev('.clear');
				closeButton.removeClass('active');
				spreaderCloseButton.removeClass('active').hide();
				setTimeout(() => {
					closeButton.hide();
				}, 100);
				dispatch({
					type: TRADER_ON_SPREAD_CHANGE,
					payload: ''
				});
			}
			if(!event.target.value) $(context.refs.inputQuantity).focus();
			// console.log(getState().activeTrader.activeFormContext);
			// OddsConverterObj.calculation(getState().activeTrader.activeFormContext, 'quantity', true);
			dispatch({
				type: TRADER_ON_QUANTITY_CHANGE,
				payload: +event.target.value || ''
			});
		}
	}

	public actionOnButtonQuantityRegulator(context, event)
	{
		return () => {
			const code = event.which || event.charCode || event.keyCode;

				if(code == 38)
				context.props.traderActions.actionOnButtonQuantityChange(context, 1);
			else if(code == 40)
				context.props.traderActions.actionOnButtonQuantityChange(context, -1)
		}
	}

	public actionOnButtonQuantityChange(context, quantity)
	{
		return (dispatch, getState) => {
			const closeButton = $(context.refs.inputQuantity).prev('.clear');
			const sum = +getState().activeTrader.quantity + quantity;
			closeButton.show();
			setTimeout(() => {
				closeButton.addClass('active');
			}, 100);
			quantity && $(context.refs.inputQuantity).focus();
			if(!(sum)){
				const closeButton = $(context.refs.inputQuantity).prev('.clear');
				const spreaderCloseButton = $(context.refs.inputSpread).prev('.clear');
				closeButton.removeClass('active');
				spreaderCloseButton.removeClass('active').hide();
				setTimeout(() => {
					closeButton.hide();
				}, 100);
				dispatch({
					type: TRADER_ON_SPREAD_CHANGE,
					payload: ''
				});
			}
			dispatch({
				type: TRADER_ON_QUANTITY_CHANGE,
				payload: sum || ''
			});
		}
	}

	public actionOnQuantityClear(context)
	{
		return (dispatch) => {
			const closeButton = $(context.refs.inputQuantity).prev('.clear');
			const spreaderCloseButton = $(context.refs.inputSpread).prev('.clear');
			closeButton.removeClass('active');
			spreaderCloseButton.removeClass('active').hide();
			setTimeout(() => {
				closeButton.hide();
			}, 100);
			dispatch({
				type: TRADER_ON_QUANTITY_CHANGE,
				payload: ''
			});
			dispatch({
				type: TRADER_ON_SPREAD_CHANGE,
				payload: ''
			});
		}

	}

	public actionOnSpreadChange(context, event)
	{
		return (dispatch) => {
			if(event.target.value	){
				const closeButton = $(context.refs.inputSpread).prev('.clear');
				closeButton.show();
				setTimeout(() => {
					closeButton.addClass('active');
				}, 100);
			}
			dispatch({
				type: TRADER_ON_SPREAD_CHANGE,
				payload: event.target.value
			});
		}
	}

	public actionOnButtonSpreadRegulator(context, event)
	{
		return () => {
			const code = event.which || event.charCode || event.keyCode;

			if(code == 38)
				context.props.traderActions.actionOnButtonSpreadChange(context, 0.01, true);
			else if(code == 40)
				context.props.traderActions.actionOnButtonSpreadChange(context, -0.01, true)
		}
	}

	public actionOnButtonSpreadChange(context, spread, regulator)
	{
		return (dispatch, getState) => {
			const closeButton = $(context.refs.inputSpread).prev('.clear');
			let spreadInput = <HTMLInputElement>$(context.refs.inputSpread)[0];

			closeButton.show();
			setTimeout(() => {
				closeButton.addClass('active');
			}, 100);
			spread && $(context.refs.inputSpread).focus();

			if(regulator.target) spreadInput.selectionStart = spread.length;

			dispatch({
				type: TRADER_ON_SPREAD_CHANGE,
				payload: !regulator.target ? Math.round10(+getState().activeTrader.spread + spread, -2) : spread
			});
		}
	}

	public actionOnSpreadClear(context)
	{
		return (dispatch) => {
			const closeButton = $(context.refs.inputSpread).prev('.clear');
			closeButton.removeClass('active');
			setTimeout(() => {
				closeButton.hide();
			}, 100);
			dispatch({
				type: TRADER_ON_SPREAD_CHANGE,
				payload: ''
			});
		}
	}

	public actionOnSpreadHighLight(highLightElem)
	{
		return (dispatch) => {
			dispatch({
				type: TRADER_ON_SPREAD_HIGHLIGHT,
				payload: highLightElem
			});
		}
	}

	// public takeActiveFormContext(context)
	// {
	// 	return (dispatch, getState) => {
	// 		getState().activeTrader.activeFormContext = context;
	// 	}
	// }

	public actionOnServerDataRebuild(data, isMirror)
	{
		return () => {
			let copyData = $.extend(true, {}, data);
			let price = 0.99,
				backendData = this._objectReconstruct(copyData.Orders, isMirror),
				htmlData = [];
			// let className = 'ask';

			for(let ii = 1; ii <= 99; ii++)
			{
				htmlData.push(new RebuildServerData({
					backendData,
					// className,
					data,
					price,
					isMirror
				}));
				price = Math.round10(price - 0.01, -2);
			}


			/*function object() {
			 price = Math.round10(price, -2);
			 this.Key = 'trader_' + price;
			 this.Price = price;
			 if(backendData[price]){
			 if(backendData[price].Side) {
			 this.ParticularUserQuantitySell = backendData[price].ParticularUserQuantity;
			 this.QuantitySell = backendData[price].Quantity;
			 }
			 else{
			 this.ParticularUserQuantityBuy = backendData[price].ParticularUserQuantity;
			 this.QuantityBuy = backendData[price].Quantity;
			 }

			 if(isMirror){
			 if(data.Symbol && price == Math.round10(1 - data.Symbol.LastAsk, -2)) this.Bid = Math.round10(1 - data.Symbol.LastAsk, -2);
			 if(data.Symbol && price == Math.round10(1 - data.Symbol.LastBid, -2)) this.Ask = Math.round10(1 - data.Symbol.LastBid, -2);
			 }
			 else{
			 if(data.Symbol && price == data.Symbol.LastBid) this.Bid = data.Symbol.LastBid;
			 if(data.Symbol && price == data.Symbol.LastAsk) this.Ask = data.Symbol.LastAsk;
			 }
			 if(this.Bid) className = 'bid';
			 }
			 if(!data.Symbol) {className = 'mid'; }
			 this.ClassName = className;
			 if(this.Ask){
			 if(data.Symbol.LastAsk && data.Symbol.LastBid)
			 className = 'mid';
			 else
			 className = 'bid';
			 }
			 }*/

			// console.log(htmlData);
			return htmlData;		}
	}

	public actionAddDefaultOrder(context, data, index)
	{
		return (dispatch, getState) => {
			if(getState().sidebar.autoTradeOn)
				context.props.traderActions.actionOnAjaxAutoTrade(context, data);
			else{
				dispatch({
					type: TRADER_ON_ADD_ORDER,
					payload: {
						activeString: index,
						direction:  data.direction,
						price: data.price,
						limit:  data.limit,
						showDirectionConfirm:  false,
						showDefaultOrder:  true,
						showSpreadOrder:  false,
					}
				});
			}
		}
	}

	public actionAddSpreadOrder(context, data, index, event)
	{
		return (dispatch, getState) => {
			event.stopPropagation();
			if(getState().sidebar.autoTradeOn)
				context.props.traderActions.actionOnAjaxAutoTradeSpread(context, data);
			else{
				dispatch({
					type: TRADER_ON_ADD_ORDER,
					payload: {
						activeString: index,
						direction: data.direction,
						price: data.price,
						showDefaultOrder:  false,
						showSpreadOrder:  true
					}
				});
			}
		}
	}

	public actionShowDirectionConfirm(index, event)
	{
		return (dispatch) => {
			event.stopPropagation();
			dispatch({
				type: TRADER_ON_ADD_ORDER,
				payload: {
					activeString: index,
					showDirectionConfirm:  true,
					showDefaultOrder:  false,
					showSpreadOrder:  false
				}
			});
		}
	}

	public actionHideDirectionConfirm()
	{
		return (dispatch) => {
			dispatch({
				type: TRADER_ON_ADD_ORDER,
				payload: {
					showDirectionConfirm:  false,
				}
			});
		}
	}

	public actionRemoveOrderForm()
	{
		return (dispatch) => {
			dispatch({
				type: TRADER_ON_DELETE_ORDER,
				payload: {
					showDefaultOrder: false,
					showSpreadOrder: false
				}
			});
		}
	}

	public actionOnAjaxAutoTrade(context, orderData){
		return () => {
			const { cmpData, isMirror, quantity } = context.props;
			const { direction, limit, price } = orderData;
			let url : string, ajaxData : any = {};

			ajaxData.Symbol = `${cmpData.activeExchange.symbol}`;
			ajaxData.Quantity = quantity;
			ajaxData.isMirror = isMirror;
			ajaxData.OrderType = limit;
			if(limit){
				ajaxData.LimitPrice = price;
				url = globalData.rootUrl + 'Order/Create';
			}
			else
				url = globalData.rootUrl + 'Order/MarketTrading';

			ajaxData.Side = (direction)[0].toUpperCase() + (direction).slice(1);

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				callback: onSuccessAjax,
				onError: onErrorAjax,
				url: url,
				data: ajaxData});

			function onSuccessAjax()
			{
				__DEV__ && console.log(`Order sending finished: ${ajaxData.Symbol}`);
			}

			function onErrorAjax()
			{
				defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
			}
		}
	}

	public actionOnAjaxAutoTradeSpread(context, orderData){
		return () => {
			const { cmpData, isMirror, quantity, spread } = context.props;
			const { direction, price } = orderData;
			const spreadPricePos = Math.round10(price + +spread, -2);
			const spreadPriceNeg = Math.round10(price - spread, -2);
			let url : string, ajaxData : any = {};

			ajaxData.Symbol = `${cmpData.activeExchange.symbol}`;

			ajaxData.SellOrderQuantity = quantity;
			ajaxData.BuyOrderQuantity = quantity;
			ajaxData.SellOrderLimitPrice = direction == 'ask' ? price : (spreadPricePos > 0.98 ? 0.99 : spreadPricePos);
			ajaxData.BuyOrderLimitPrice = direction == 'bid' ? price : (spreadPriceNeg < 0.02 ? 0.01 : spreadPriceNeg);
			ajaxData.isMirror = isMirror;

			// ajaxData.Quantity = quantity;
			// ajaxData.OrderType = limit;
			url = globalData.rootUrl + 'Order/Spreader';

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				callback: onSuccessAjax,
				onError: onErrorAjax,
				url: url,
				data: ajaxData});

			function onSuccessAjax()
			{
				__DEV__ && console.log(`Order sending finished: ${ajaxData.Symbol}`);
			}

			function onErrorAjax()
			{
				defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
			}
		}
	}

	public actionOnAjaxSend(context, event)
	{
		return () =>{
			event.preventDefault();
			const { cmpData: { activeExchange }, traderActions } = context.props;

			function OnBeginAjax()
			{
				$(event.target).find('[type=submit]').attr('disabled', 'true');
			}

			function onSuccessAjax()
			{
				traderActions.actionRemoveOrderForm();
				console.log(`Order sending finished: ${activeExchange.symbol}`);
			}

			function onErrorAjax()
			{
				$(event.target).find('[type=submit]').removeAttr('disabled');
				defaultMethods.showError('The connection to the server has been lost. Please check your internet connection or try again.');
			}

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				url: $(event.target).attr('action'),
				callback: onSuccessAjax,
				onError: onErrorAjax,
				beforeSend: OnBeginAjax,
				context: $(event.target)
			});
		}
	}

	/**
	 * на основе объекта с бэкенда формирует новый объект в формате ключ == price и добавляет side
	 * @param inData
	 * @param isMirror
	 * @returns {{}}
	 */
	private _objectReconstruct(inData, isMirror)
	{
		let newData = {};

		$(inData).each(function(){
			let sideData = this;
			if(sideData.SummaryPositionPrice){
				$(sideData.SummaryPositionPrice).each(function(){
					let item = this;
					if(isMirror) item.Side = sideData.Side == 1 ? 0 : 1;
					else item.Side = sideData.Side;

					item.Price = isMirror ? Math.round10(1 - item.Price, -2) : item.Price;
					newData[(item.Price).toString()] = item;
				});
			}
		});

		return newData;
	}

	private _scrollTo(context, data, isMirror) {
		const tbody =  $(context.refs.traderBody);
		if(JSON.stringify(data) != '{}'){
			let { Symbol: { LastAsk, LastBid } } = data;
			if(isMirror) {
				let LastBidOld = LastBid;

				if(LastAsk)LastBid = Math.round10(1 - LastAsk, -2);
				else LastBid = null;

				if(LastBidOld) LastAsk = Math.round10(1 - LastBidOld, -2);
				else LastAsk = null;
			}

			let indexBuy = LastBid ? Math.round(99 - LastBid * 100) : 0,
				indexSell = LastAsk ? Math.round(99 - LastAsk * 100) : 0;

			if(!indexBuy)
				indexBuy = indexSell;
			else if(!indexSell)
				indexSell = indexBuy;

			tbody.animate({scrollTop: (indexBuy + (indexSell - indexBuy) / 2) * 20 - tbody.height() / 2 + 10}, 400);
		}
		else
			tbody.animate({scrollTop: 980 - tbody.height() / 2}, 200);

		// console.log(tbody.height());
		// console.log(980 - tbody.height() / 2);
	}

	// public tbodyResize(showFooter){
	// 	let windowHeight = window.innerHeight,
	// 		footer = $('footer'),
	// 		footerHeight = footer.outerHeight(),
	// 		tbody = $('.left_order table.limit tbody'),
	// 		delay = 400;
	// 	// order = $('#order');
    //
	// 	if(showFooter) delay = 0;
    //
	// 	// order.css('overflow-y', 'hidden');
	// 	setTimeout(function () {
	// 		let orderSidebarHeight = windowHeight - ($('.left_order .tabs').outerHeight(true) + $('header').outerHeight(true)),
	// 			eventTitleHeight = ($('.active_trader .event_title').length) ? $('.active_trader .event_title')[0].offsetHeight : 0,
	// 			activeTraderHeight = orderSidebarHeight - (eventTitleHeight + $('.active_trader .info').outerHeight() +
	// 				$('.active_trader .control').eq(0).outerHeight() + $('.active_trader .control').eq(1).outerHeight() +
	// 				$('.active_trader .control.remote').outerHeight() + $('.active_trader .limit thead').outerHeight() + 12);
    //
	// 		if(footer.hasClass('active')){
	// 			tbody.css('max-height', activeTraderHeight - footerHeight);
	// 		} else {
	// 			tbody.css('max-height', activeTraderHeight);
	// 		}
	// 	}, delay);
	// };

	public actionOnTabMirrorClick(context, isMirror)
	{
		return (dispatch, getState) =>
		{
			$(context.refs .activeTrader).addClass('loading');
			ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: getState().sidebar.activeExchange.name, isMirror: isMirror, symbol: getState().sidebar.activeExchange.symbol});
			dispatch({
				// type: ON_TAB_MIRROR_CHANGE,
				type: ON_ACTIVE_SYMBOL_CHANGED,
				payload: {isMirror}
			});
		}
	}
}
export default (new Actions()).export();