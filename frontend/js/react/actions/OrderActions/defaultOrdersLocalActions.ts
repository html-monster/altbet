/**
 * Created by Htmlbook on 09.06.2017.
 */

import {
    ON_MP_ORDER_CREATE,
    ON_MP_ORDER_DELETE
} from "../../constants/ActionTypesDefaultOrdersLocal";
import OrderActions from '../OrderActions';

class Actions extends OrderActions
{
    public actionOnOrderCreate(order)
    {
        return (dispatch) =>
        {
            dispatch({
                type: ON_MP_ORDER_CREATE,
                payload: {
                    orderData: order,
                    showOrder: true
                }
            });
        }
    }

    public actionOnDeleteOrder()
    {
        return (dispatch) =>
        {
            dispatch({
                type: ON_MP_ORDER_DELETE,
                payload: false
            });
        }
    }
}

export default (new Actions()).export();