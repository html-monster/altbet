/**
 * Created by Htmlbook on 12.06.2017.
 */
import BaseActions from './BaseActions';
// import { orderForm } from '../components/formValidation/validation';

/// <reference path="../../.d/common.d.ts" />
declare let __DEV__;
declare function $(object: any);
declare let defaultMethods;

abstract class OrderActions extends BaseActions
{
    public actionOnAjaxSend(data, actions, event)
    {
        return () =>
        {
            event.preventDefault();
            const form = $(event.currentTarget);

            // if(!ABpp.User.userIdentity) return false;
            // if(!orderForm(event.currentTarget)) return false;

            function OnBeginAjax()
            {
                form.addClass('loading');
                form.find('[type=submit]').attr('disabled', 'true');
            }

            function onSuccessAjax(answer)
            {
                actions.defaultOrdersActions.actionOnDeleteOrder({data, mainPageActions: actions.mainPageActions});
                __DEV__ && console.log(`Order sending finished: ${answer}`);
            }

            function onErrorAjax()
            {
                form.removeClass('loading');
                form.find('[type=submit]').removeAttr('disabled');
                defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
            }

            defaultMethods.sendAjaxRequest({
                httpMethod: 'POST',
                url: data.formUrl,
                callback: onSuccessAjax,
                onError: onErrorAjax,
                beforeSend: OnBeginAjax,
                context: form
            });

            // dispatch({
            // 	type: ON_DEFAULT_ORDER_AJAX_SEND,
            // 	payload: newData
            // });
        }
    }
}

export default OrderActions;