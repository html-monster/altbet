/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseView from "./BaseView";
import BodyView from "./BodyView";


export default class CategoryEdit extends BaseView
{
    public initCBIcon(inClasses)
    {
        var data = [];
                //[{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
        for( let ii in inClasses )
        {
            let val = inClasses[ii];
            data.push({id: ii, text: ii});
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
        }).val(globalData.currentIcon).trigger("change");
    }



    public beginSave()
    {
        var self = this;
        // var $that = $(that);
        // var wrapper = $that.closest('.ph-city-info-block-wrapp');
        // var cityBlock = $that.closest('.city-block');
        // e.preventDefault();

        // if (!confirm(_t('delconfirm'))) return;

        // let id = $that.closest('.city-block').data('id');
        // wrapper.find('.blind').fadeIn(400);
        // (new BodyView).showLoading($('.js-btn-save'), {pic: 2, align: 'left'});
        (new BodyView).showLoading($('.js-btn-cancel'), {pic: 2, outerAlign: BodyView.ALIGN_OUTER_RIGHT});
    }
}
