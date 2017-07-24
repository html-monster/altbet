import {
	ON_SIDEBAR_LOAD,
    ON_TRADER_ON,
	ON_AUTO_TRADE,
	ON_TAB_SWITCH,
	ALLOW_AT_CH,
	ON_ACTIVE_SYMBOL_CHANGED,
	ON_SIDEBAR_ODD_SYS_CHANGE,
} from '../constants/ActionTypesSidebar.js';
// import { WebsocketModel } from '../models/Websocket';
// import { Common } from '../common/Common';
import BaseActions from './BaseActions';
import {SocketSubscribe} from "../models/SocketSubscribe";
import OddsConverter from '../models/oddsConverter/oddsConverter';

var __LDEV__ = true;
// var __LDEV__ = false;
let initialLoad = true;
declare var orderClass;


class Actions extends BaseActions
{
	public actionOnLoad()
	{
		return (dispatch, getState) =>
		{

			dispatch({
				type: ON_SIDEBAR_LOAD,
				payload: (new OddsConverter()).getSystemName(),
			});
		}
	}

	/**
	 * @param tabName: string - can be: "ActiveTrader", "YourOrders", "Disqus"
	 * @returns {(dispatch:any, getState:any)=>undefined}
	 */
	public tabSwitch(actions, tabName)
	{
		ABpp.Websocket.sendSubscribe(tabName === 'YourOrders', window.SocketSubscribe.CURRENT_ORDERS);

		if(tabName === 'ActiveTrader')
			ABpp.config.tradeOn = true;
		else
			ABpp.config.tradeOn = false;

		actions.actionOnTraderOnChange(tabName === 'ActiveTrader');
		return (dispatch) =>
		{
			dispatch({
				type: ON_TAB_SWITCH,
				payload: tabName,
			});
		}
	}

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

	public actionOnOddSystemChange(data) {
		return (dispatch) =>
		{
			// console.log(data);
			dispatch({
				type: ON_SIDEBAR_ODD_SYS_CHANGE,
				payload: data.currentOddSystem
			});
		}
	}

    public actionOnTraderOnChange(isChecked)
    {
        return (dispatch, getState) =>
        {
			let ii = 0;
			let //autoTrade = $('.left_order input.auto'),
					order = $('#order'),
					default_order = $('.left_order .default_orders'),
					active_trader = $('.left_order .active_trader'),
					// buttons = $('.event-content button.event'),
					event_container = $('.content_bet'),
					titles = event_container.eq(0).find('.event-title .title'),
					executedOrders = $('.wrapper_event_page .executed_orders');

            // call socket if allow active trader
            // getState().sidebar.isAllowAT &&
			ABpp.Websocket.sendSubscribe({tradeOn: isChecked}, SocketSubscribe.TRADER_ON);
			// 0||console.log( 'getState().sidebar.activeExchange', getState().sidebar.activeExchange );

			if( isChecked )
			{

				// var symbol = event_container.eq(0).attr('data-symbol');

				order.css('overflow-y', 'hidden');
				// autoTrade.parent().fadeIn(200);
				// default_order.stop(true).fadeOut(200);
				// setTimeout(function () {
				// 	active_trader.fadeIn(200);
				// }, 200);
				activeTraderClass.tbodyResize();
				if(initialLoad){
					$('#active_trader').addClass('loading');
					initialLoad = false;
				}

				// globalData.tradeOn = true;
				// === Vlasakh === 23-01-12 ===============================================
				ABpp.config.tradeOn = true;
				// orderClass.tabReturn();

				// /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, true);

				// let id = $('.active_trader').attr('id').replace("trader_", "");
				// ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ACTIVE_SYMBOL, {id: id, isMirror: $(this).index()});


			// ABpp.Websocket.sendSubscribe({exchange: null}, SocketSubscribe.MP_SYMBOLS_AND_ORDERS);
				// === ==================== ===============================================
			}
			else{
				// autoTrade.parent().fadeOut(200);
				order.css('overflow-y', 'auto');
				// setTimeout(function () {
				// 	default_order.stop(true).fadeIn(200);
				// }, 200);
				// active_trader.fadeOut(200);
				// buttons.removeAttr('disabled');
				// event_container.removeClass('clickable');
				// if($('.wrapper_event_page').length)
				// 	executedOrders.find('td.clickable').addClass('clickable');

				// globalData.tradeOn = false;
				// === Vlasakh === 17-01-12 ===============================================
				ABpp.config.tradeOn = false;
				// /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, false);
				// === ==================== ===============================================
			}

            /** @var ABpp ABpp */ ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_TURN_TRADER_ON, isChecked);


			// orderClass.tabReturn();
            dispatch({
                type: ON_TRADER_ON,
                payload: isChecked,
            });
        }
    }

	public actionOnAutoTradeChange(event)
	{
		return (dispatch) =>
		{
			dispatch({
				type: ON_AUTO_TRADE,
				payload: event.target.checked,
			});
		}
	}

    public  actionOnActiveSymbolChanged(props)
    {
        return (dispatch) =>
        {
        	// console.log('props:', props);
            dispatch({
                type: ON_ACTIVE_SYMBOL_CHANGED,
                payload: props,
            });
        }
    }
}

export default (new Actions()).export();
