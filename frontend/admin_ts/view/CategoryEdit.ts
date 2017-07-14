/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseView from "./BaseView";
import BodyView from "./BodyView";
import Common from "../inc/Common";


export default class CategoryEdit extends BaseView
{
    private T1errmess = null;

    public initCBIcon(inClasses)
    {
        var data = [];

        for( let ii in inClasses )
        {
            let val = inClasses[ii];
            data.push({id: ii, text: val.alias});
        } // endfor
        data.unshift({id: '-100', text: '- noicon -'});


        $(".js-cb-icons").select2({
            data: data,
            templateResult: (state) => {
                    if (!state.id) {
                        return state.text;
                    }
                    var $state = $('<span class="icon ' + state.id + '">' + state.text + '</span>');
                    if (state.id < 0) var $state = $('<span class="icon noicon">' + state.text + '</span>');
                    return $state;
                }
        }).val(globalData.currentIcon ? globalData.currentIcon : "-100").trigger("change");
    }



    public beginSave()
    {
        var self = this;

        this.closeAlert();
        (new BodyView).showLoading($('.js-btn-cancel'), {pic: 2, outerAlign: BodyView.ALIGN_OUTER_RIGHT, offsetX: 4});
    }


    public prepareForm(props)
    {
        var self = this;

        this.initCBIcon(props.icons);
        $(".js-ed-name", props.form).blur((e) => {
            var $that = $(e.target);
            $(".js-ed-url").val(Common.createUrlAlias($that.val()));
        });

        setTimeout(() => $("[name=Name]").focus(), 500);
    }



    public setErrors(inProps)
    {
        var self = this;
        var message;

        if( inProps.code < -100 && inProps.code > -200)
        {
            // controlled messages need switch and focus
            message = inProps.message;
        }
        else
        {
            message = inProps.message;
        } // endif

        let alert = $(".js-alert");
        alert.find('.js-text').text(message);
        alert.fadeIn(400);

        clearTimeout(this.T1errmess);
        this.T1errmess = setTimeout(() => { alert.fadeOut(200); }, 5000);
    }



    public closeAlert()
    {
        $(".js-alert").fadeOut(200)
    }



    public endSave()
    {
        (new BodyView).hideLoading();
    }



    public checkFields()
    {
        let error = false;
        let message = '';
        let element;
        let form = $("#F1EditCat");


        try {
            element = $("[name=Name]", form);
            var val = element.val();
            if( val == '' )
            {
                throw Error("Field “Name” is empty");
            } // endif


            element = $("[name=Url]", form);
            val = element.val();
            if( val == '' )
            {
                throw Error("Field “Url” is empty");
            } // endif
        } catch (e) {
            error = true;
            message = e.message;
        }



        if( error )
        {
            this.setErrorOnField({element, message});
            return false;
        }
        else
        {
            return true;
        } // endif
    }



    private setErrorOnField(inProps)
    {
        let form = inProps.element.closest('form');
        form.find('.js-form-group').removeClass('has-error');
        // form.find('.js-error-icon').hide();
        // form.find('.js-message').hide();

        let fieldWrapp = inProps.element.closest('.js-form-group');
        fieldWrapp.addClass('has-error');
        fieldWrapp.find('.js-message').text(inProps.message);
        inProps.element.focus();

        inProps.element.on('blur', function()
        {
            $(this).off('blur');
            // clearTimeout(self.T1wait);
            $(this).closest('.js-form-group').removeClass('has-error');
        });
        // fieldWrapp.find('.js-error-icon').show();
    }
}
