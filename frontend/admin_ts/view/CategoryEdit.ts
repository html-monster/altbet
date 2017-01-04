/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseView from "./BaseView";


export default class CategoryEdit extends BaseView
{
    public initCBIcon(inClasses)
    {
        var data = [], jj = 0;
                //[{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
        for( let ii in inClasses )
        {
            let val = inClasses[ii];
            data.push({id: jj++, text: ii});
        } // endfor

        // var tmpl = function

        $(".js-cb-icons").select2({
            data: data,
            templateResult: (state) => {
                    if (!state.id) {
                        return state.text;
                    }
                    var $state = $('<span class="icon ' + state.text + '">' + state.text + '</span>');
                    return $state;
                }
        });
    }
}
