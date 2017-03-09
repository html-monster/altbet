/**
 * Created by Vlasakh on 03.03.2017.
 */

import {
    ON_CHECK_FIELDS,
} from '../constants/ActionTypesRegister';
import BaseActions from './BaseActions';


// var __LDEV__ = true;
let __LDEV__ = false;

class Actions extends BaseActions
{
    public actionFormSubmit(context, values, serverValidation, event, p1, p2)
    {
        var self = this;
        return (dispatch, getState) =>
        {
            let flag = true;


            // $('.sign_up_form form').submit(function () {
            //     if(!(checkAreement('agreement', $(this)) && checkAreement('agreement_age', $(this)))) {0||console.log( 'here', 2 ); return false;}
            //     0||console.log( 'here', 3 );
            // });
            0||console.log( 'here 11', context, values, serverValidation, event, p1,  p2);
            if( (this.checkAreement('agreement', $(this)) && this.checkAreement('agreement_age', $(this))) )
            {
                0||console.log( 'OK', 1 );
            }


            // dispatch({
            //     type: ON_CHECK_FIELDS,
            //     payload: []
            // });
        }
    }


    private checkAreement(item, context)
    {
        if(context.find(`#${item}`).prop('checked')) return true;
        else
        {
            context.find(`.agreement label[for=${item}]`).addClass('animated shake');
            setTimeout(() => {
                context.find(`.agreement label[for=${item}]`).removeClass('animated shake');
            }, 500);
            return false;
        }
    }
}

export default (new Actions()).export();
