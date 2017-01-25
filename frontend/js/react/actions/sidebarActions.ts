import {
    ON_TRADER_ON,
	ALLOW_AT_CH,
	ON_ACTIVE_SYMBOL_CHANGED,
} from '../constants/ActionTypesSidebar.js';
import { WebsocketModel } from '../models/Websocket';
import { Common } from '../common/Common';
import BaseActions from './BaseActions';
import {SocketSubscribe} from "../models/SocketSubscribe";


var __LDEV__ = true;
// var __LDEV__ = false;

declare var orderClass;


class Actions extends BaseActions
{
    public actionChangeAllowAt(isAllowAT)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ALLOW_AT_CH,
                payload: isAllowAT,
            });
        }
    }


    public actionOnTraderOnChange(isChecked)
    {
        return (dispatch, getState) =>
        {
			let ii = 0;
			let autoTrade = $('.left_order .tab input.auto'),
					order = $('#order'),
					default_order = $('.left_order .default_orders'),
					active_trader = $('.left_order .active_trader'),
					buttons = $('.event-content button.event'),
					event_container = $('.content_bet'),
					titles = event_container.eq(0).find('.event-title .title'),
					executedOrders = $('.wrapper_event_page .executed_orders');


            // call socket if allow active trader
			getState().sidebar.isAllowAT && ABpp.Websocket.sendSubscribe({tradeOn: isChecked}, SocketSubscribe.TRADER_ON);
			// 0||console.log( 'getState().sidebar.activeExchange', getState().sidebar.activeExchange );

			if( isChecked )
			{

				var symbol = event_container.eq(0).attr('data-symbol');

				order.css('overflow-y', 'hidden');
				autoTrade.parent().fadeIn(200);
				default_order.stop(true).fadeOut(200);
				setTimeout(function () {
					active_trader.fadeIn(200);
				}, 200);
				activeTraderClass.tbodyResize();
				// buttons.attr('disabled', true);


                // set tabs titles
				$('.active_trader .event_title .event_name').each(function () {
					$(this).text(titles.eq(ii++).text());
				});

				// === Vlasakh === 17-01-03 ===============================================
				// ABpp.actions['MainPage.firstExchangeActivate'] && ABpp.actions['MainPage.firstExchangeActivate']();
				// ABpp.actions['EventPage.activeTraiderActivate'] && ABpp.actions['EventPage.activeTraiderActivate']();

				// if(event_container.hasClass('active')){
				// 	event_container.addClass('clickable');
				// } else {
				// 	if(symbol) $('[data-symbol=' + symbol + ']').addClass('active');
				// 	event_container.addClass('clickable').eq(0).addClass('active');
				// 	titles = $('.content_bet.active .event-title .title');
				// 	$('.active_trader .event_title .event_name').each(function () {
				// 		$(this).text(titles.eq(ii++).text());
				// 	});
				// }
				// === ==================== ===============================================

				orderClass.tabReturn();
				setTimeout(function () {
					if($('.active_trader .best_buy').text() == '' && $('.active_trader .best_sell').text() == ''){
						if(globalData.mainPage || globalData.myPosOn)
							activeTraderClass.takeData($('.content_bet').eq(0));
						else
							activeTraderClass.takeData($('.wrapper_event_page'));
					}
					// === Vlasakh === 17-01-12 ===============================================
					// ABpp.Websocket.sendSubscribe({exchange: data.Symbol.Exchange}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
					// let id = $('.active_trader').attr('id').replace("trader_", "");
					// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()});
					// ABpp.actions['MainPage.getExchange'] && ABpp.actions['MainPage.getExchange']();
					// === ==================== ===============================================
				}, 700);
				if($('.wrapper_event_page').length)
					executedOrders.find('td.clickable').removeClass('clickable');

				globalData.tradeOn = true;
				// === Vlasakh === 23-01-12 ===============================================
				ABpp.config.tradeOn = true;
				// /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, true);

				// let id = $('.active_trader').attr('id').replace("trader_", "");
				// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()});


			// ABpp.Websocket.sendSubscribe({exchange: null}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
				// === ==================== ===============================================
			}
			else{
				autoTrade.parent().fadeOut(200);
				order.css('overflow-y', 'auto');
				setTimeout(function () {
					default_order.stop(true).fadeIn(200);
				}, 200);
				active_trader.fadeOut(200);
				buttons.removeAttr('disabled');
				event_container.removeClass('clickable');
				if($('.wrapper_event_page').length)
					executedOrders.find('td.clickable').addClass('clickable');

				globalData.tradeOn = false;
				// === Vlasakh === 17-01-12 ===============================================
				ABpp.config.tradeOn = false;
				// /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, false);
				// === ==================== ===============================================
			}

            /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, isChecked);



            dispatch({
                type: ON_TRADER_ON,
                payload: isChecked,
            });
        }
    }


    public actionOnActiveSymbolChanged(props)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_ACTIVE_SYMBOL_CHANGED,
                payload: props,
            });
        }
    }
}

export default (new Actions()).export();
