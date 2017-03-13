/**
 * Created by Htmlbook on 10.03.2017.
 */
// import {
//     ON_YOUR_ORDER_SOCKET_MESSAGE,
//     ON_YOUR_ORDER_DELETE,
// } from "../../constants/ActionTypesYourOrders.js";
import BaseActions from '../BaseActions';

class Actions extends BaseActions
{
    public actionAjaxUserDataUpdate(values, serverValidation, event)
    {
        return () =>
        {
            __DEV__ && console.log('UserDataUpdate:', values);
            const form = $(event.target);
            const submit = $(event.target).find('[type=submit]');

            defaultMethods.sendAjaxRequest({
                httpMethod: 'POST',
                url       : $(event.target).attr('action'),
                data      : values,
                callback  : onSuccessAjax,
                onError   : onErrorAjax,
                beforeSend: OnBeginAjax,
            });

            function onErrorAjax()
            {
                submit.removeAttr('disabled');
                form.removeClass('loading');
                serverValidation({error: 'The payment failed. Please check your internet connection or reload the page or try again later'});
            }

            function OnBeginAjax()
            {
                submit.attr('disabled', 'true');
                form.addClass('loading');
            }

            function onSuccessAjax(error)
            {
                __DEV__ && console.log(error);
                if(error) serverValidation({error});
                else serverValidation({message: 'Your data was successfully changed'});
                submit.removeAttr('disabled');
                form.removeClass('loading');
            }
        }
    }
}

export default (new Actions()).export();