import {
    WITHDRAW_QUANTITY_CHANGE,
    WITHDRAW_QUANTITY_VALIDATE,
} from '../constants/ActionTypesGidxCashier.js';
import BaseActions from './BaseActions';
// import {AjaxSend} from '../models/AjaxSend';
import {Dialog} from '../models/Dialog';



var __DEBUG__ = !true;


export default class Actions extends BaseActions
{
    public actionGidxServiceStatusListener({service, action, json})
    {
        __DEV__&&console.log( '{service, action, json}', {service, action, json} );
/*            new Dialog({
                render: true,
                type: Dialog.TYPE_MESSAGE,
                closableBg: false,
                vars: {
                    contentHtml: `<span class="">Registration is successful. You need to activate account. Please, check your email for  activation link.</span>`,
                    btn1Text: "OK",
                    // btn2Text: "No",
                },
                callbackOK: (inProps) => {location.reload()},
            })*/;
    }


    public actionOnLoad(event)
    {
        return (dispatch, getState) =>
        {
            __DEV__&&console.log( 'window.gidxServiceStatus', window.gidxServiceStatus );
            window.gidxServiceStatus = (service, action, json) =>
            {
                this.actionGidxServiceStatusListener({service, action, json});
            }
        }
    }


    public actionOnButtonQuantityClick(event)
    {
        return (dispatch, getState) =>
        {
            // let summary = +getState().withdraw.depositQuantity + +event.target.textContent;
            this.actionOnQuantityValidate(event.target.textContent);
            0||console.log( 'event.target.textContent', event.target.textContent );
            dispatch({
                type: WITHDRAW_QUANTITY_CHANGE,
                payload: event.target.textContent
            });
        }
    }


    public actionOnInputQuantityChange(event)
    {
        return (dispatch) =>
        {
            this.actionOnQuantityValidate(event.target.value);
            dispatch({
                type: WITHDRAW_QUANTITY_CHANGE,
                payload: event.target.value
            });
        }
    }


    private actionOnQuantityValidate(values)
    {
        return (dispatch) =>
        {
            let error = null;
            if(!values) error = 'Required';
            // if(values && values < 10) error = 'Required';
            dispatch({
                type: WITHDRAW_QUANTITY_VALIDATE,
                payload: error
            });
        }
    }

}