/**
 * Created by Htmlbook on 21.12.2016.
 */
import {
    ON_KEY_UP
} from "../../constants/ActionTypesOrderForm.js";
// import {OddsConverter} from '../../models/oddsConverter/oddsConverter.js';


//not use!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// const PRICE = 'price';
// const QUANTITY = 'quantity';
// const SUM = 'sum';
// let OddsConverterObj = new OddsConverter('implied_probability');
export function actionOnKeyUp(form, input)
{
    return (dispatch, getState) =>
    {
        // console.log('ON_DEFAULT_ORDER_DELETE', ON_DEFAULT_ORDER_DELETE, getState());
        // switch (input){
        //     case (PRICE):
        //     case (QUANTITY):
        //     case (SUM):
        // }
        // console.log(form, input);
// console.log(OddsConverterObj.calculation);
//         let newOrderData = OddsConverterObj.calculation(getState().orderForm.orderData);
        // let orderId;
        // if(order.Side !== undefined)
        //     orderId = order.Side;
        // else
        //     orderId = orderContainer.ID;
        //
        // let newOrders = getState().sidebar.orderNewData.filter(function(itemContainer) {
        //     if(order.Side !== undefined && itemContainer.ID === orderContainer.ID){
        //         itemContainer.Orders = itemContainer.Orders.filter((item) => item.Side !== orderId);
        //         if(itemContainer.Orders.length)
        //             return true;
        //         else
        //             return false;
        //     }
        //     else
        //         return itemContainer.ID !== orderId;
        // });
        // console.log(newOrders);



        // dispatch({
        //     type: ON_KEY_UP,
        //     payload: newOrderData
        // });
    }
}