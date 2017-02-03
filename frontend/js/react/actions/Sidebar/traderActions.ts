/**
 * Created by Htmlbook on 27.01.2017.
 */
import {
	TRADER_ON_SOCKET_MESSAGE,
	TRADER_ON_QUANTITY_CHANGE,
	TRADER_ON_SPREAD_CHANGE,
	TRADER_ON_ADD_ORDER,
	TRADER_ON_DELETE_ORDER
} from '../../constants/ActionTypesActiveTrader';
import BaseActions from '../BaseActions';
import RebuildServerData from '../Sidebar/activeTrader/rebuildServerData';
// import {OddsConverterObj} from '../../models/oddsConverter/oddsConverter.js';

class Actions extends BaseActions
{
	public actionOnSocketMessage(context)
	{
		return (dispatch, getState) =>
		{
			let trader = $('.active_trader');
			let tbody = $('table.limit tbody');
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
				if(JSON.stringify(state.activeTrader.data) != JSON.stringify(currSymbData) || state.activeTrader.isMirror != isMirror){
					// this.setState({data: currSymbData, isMirror: isMirror});
					dispatch({
						type: TRADER_ON_SOCKET_MESSAGE,
						payload: {
							data: currSymbData,
							isMirror: isMirror,
							rebuiltServerData: context.props.traderActions.actionOnServerDataRebuild(currSymbData, isMirror)}
					});
					__DEV__ && console.log('re-render');
				}

				setTimeout(activeTraderClass.scrollTo(), 100);
				tbody.addClass('scroll_dis');
				activeTraderClass.buttonActivation($('.active_trader .control input.quantity'), true);
				activeTraderClass.spreaderChangeVal(trader.find('input.spreader'));
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
				backendData = this.objectReconstruct(copyData.Orders, isMirror),
				htmlData = [];
				// className = 'ask';

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

	public actionAddOrder(data, index)
	{
		return (dispatch) => {
			dispatch({
				type: TRADER_ON_ADD_ORDER,
				payload: {
					activeString: index,
					direction:  data.direction,
					price: data.price,
					limit:  data.limit,
					showDefaultOrder:  true
				}
			});
		}
	}

	public actionRemoveOrderForm()
	{
		return (dispatch) => {
			dispatch({
				type: TRADER_ON_DELETE_ORDER,
				payload: {showDefaultOrder: false}
			});
		}
	}

	// public actionSetActiveString(index)
	// {
	// 	return (dispatch, getState) => {
	// 		const state = getState().activeTrader;
    //
	// 		state.orderInfo.activeString = index;
	// 	}
	// }

	/**
	 * на основе объекта с бэкенда формирует новый объект в формате ключ == price и добавляет side
	 * @param inData
	 * @param isMirror
	 * @returns {{}}
	 */
	private objectReconstruct(inData, isMirror)
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
}
export default (new Actions()).export();