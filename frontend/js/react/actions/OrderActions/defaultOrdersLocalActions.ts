/**
 * Created by Htmlbook on 09.06.2017.
 */

import {
    ON_MP_ORDER_CREATE,
    ON_MP_ORDER_DELETE
} from "../../constants/ActionTypesDefaultOrdersLocal";
import OrderActions from '../OrderActions';
/// <reference path="../../../.d/common.d.ts" />
declare function $(object: any);


class Actions extends OrderActions
{
    public actionOnOrderCreate(order, context)
    {
        return (dispatch) =>
        {
            context.props.actions.actionShowOrder(true);
            // $('body').css({overflow: 'hidden', paddingRight: 10});

            dispatch({
                type: ON_MP_ORDER_CREATE,
                payload: {
                    orderData: order,
                    showOrder: true
                }
            });
        }
    }

    public actionOnDeleteOrder(data)
    {
        return (dispatch) =>
        {

            // $('#blindTop, #blindBottom').removeClass('fadeInUpLong fadeInDownLong');
            // $('#blindTop').addClass('fadeOutUp');
            $('#mainBlind').removeClass('fadeIn').addClass('fadeOut');
            $('.button.order_open').removeClass('order_open');
            $('#mp-orderContainer').fadeOut();

            setTimeout(() => {
                // $('body').removeAttr('style');

                if(data.mainPageActions) data.mainPageActions.actionShowOrder(false);

                dispatch({
                    type: ON_MP_ORDER_DELETE,
                    payload: false
                });
            }, 400)
        }
    }
}

export default (new Actions()).export();