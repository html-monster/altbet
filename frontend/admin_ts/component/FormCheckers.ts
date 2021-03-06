/**
 * Created on 30.12.2015.
 */


export class FormCheckers
{
    private FLAG_STOP = 0;
    private errBoxObj = 0;
    private addErrClass = '';
    private waitTimeErrorMess = 0;
    private prevItem = null;
    private customCheckers : any = {};
    private options : any = {};
    private filters : any = {};
    private settings = {
        event: null,
        form: null,
        justReturn: 1,
        beforeSubmit: null,     //startCallback
        onError: [],          //errorCallback funcs 0 - error set, 1 - error timeout
    };

    private T1wait = 0;

    constructor()
    {
        var self = this;

        // example, data-field-check='name:Дата снятия с публикации,empty'
        self.options = {
            'name': '',         // name of the label (needs for auto error message)
            'elem': false,      // element for attach error message
            'message': '',      // element for attach error message
            'wait': 10000,          // delay before error message hint close
            'ifthere': "",          //
            'ifhere': "",           //
            'elemthere': "",           //
        };

        self.filters = [
            [
                'empty',        // checks for emptiness
                'max',          // place max count of symbols in the field
                'multi',        // checker for multiple select component
                'email',        // checks for right email adress
                'if',           // checks for item.val == condition (message init is needed)
                                //      example: data-field-check='elem:#BtnAddCity>a,message:Нужно добавить минимум один город,wait:2500,if:0'
                'ifhere',       //      example: data-field-check='elem:#BtnAddCity>a,message:Нужно добавить минимум один город,wait:2500,if:0'
                'password',     // check for equality of password and its recurrence
                'notonlydigits',       // check for contains not only the numbers
                'custom',       // custom checker via callback, depend on name when call this.addCheckerCustom
            ],
            [
                'filterEmpty',
                'filterMax',
                'filterMulti',
                'filterEmail',
                'filterIf',
                'filterIfhere',
                'filterPassword',
                'filterNotonlydigits',
                'filterCustom',
            ],
        ];

        // self.filters.[1].forEach((val)=>{ return (fVal, itmVal)=>{ return self.filterIf(fVal, itmVal) } });
    }


    /**
     * Place data-field-check in DOM
     *
     * BM: FormSubmit
     * Checks for form fields
     * @param event - DOM event object
     * @param form - form ID or class or just `this`
     * @param justReturn - 0 : form submit, 1 : return results
     * @returns true : checking success, false : checking fail
     */
    public FormSubmit(props)
    {
        var self = this;
        // self.FLAG_STOP = 1;
        clearTimeout(self.T1wait);

        props = {...this.settings, ...props};

        return self.onFormSubmit(props);
    }


    public addCheckerCustom(inName, callback)
    {
        var self = this;
        self.customCheckers[inName] = callback;
    }



    /**
     * @param e - event
     * @param frmObj - just this
     * @param inJustReturn - no submit form, just return
     */
    protected onFormSubmit(props)
    {
        props.event.preventDefault();
        var self = this;

        var frmObj = $(props.form);
        var item = null;
        var itmVal = null;
        var mess = '';
        var flagError = 0;
        var actionMessage;  // mess from item
        var actionItem;     // item for error hint attach

        props.beforeSubmit && props.beforeSubmit(props);


        $(frmObj).find("[data-field-check]:not(.nocheck)").each(function()
        {
            self.options.message = '';
            item = self.options.elem = $(this);
            itmVal = item.val();

            // get filters
            var params: any = item.data('field-check').split(',');
            var filters = {};
            for( var ii in params )
            {
                var val = params[ii].split(':');
                filters[val[0]] = val[1] ? val[1] : true ;
            } // endfor


            // apply options
            for( var jj in filters )
            {
                self.setOptions(jj, filters[jj]);
            } // endfor


            // apply filters
            for( var jj in filters )
            {
                var flpos;
                if( (flpos = $.inArray(jj, self.filters[0])) > -1 )
                {
                    var fn = self.filters[1][flpos];
                    if( flagError = self[fn]({filterVal: filters[jj], item: item, itemVal: itmVal}) ) break;
                    // if( flagError = self.filters[1][flpos](filters[jj], itmVal) ) break;
                    // if( flagError = self[fn].apply(self, [filters[jj], itmVal]) ) break;
                }
            } // endfor

            if( flagError ) return false; // endif
        });


        // fields has errors
        if( flagError )
        {
            item = self.options.elem;
            self.FLAG_STOP = 1;
            $('body').stop().animate({scrollTop: item.offset().top - 30 +'px'}, 500, function()
            {
                // var msgBox = $('.error-hint-box');
                // msgBox.text(self.options.message).css({left: item.offset().left, top: item.offset().top + item.outerHeight() + 10 });
                // msgBox.fadeIn(400);
                // item.addClass('field--warning');
                // item.focus();

                $(self.prevItem).off('blur');
                self.prevItem = item;
                props.onError[0] && props.onError[0]({...self.options});


                // inProps.element.on('blur', function()
                // {
                //     $(this).off('blur');
                //     // clearTimeout(self.T1wait);
                //     $(this).closest('.js-form-group').removeClass('has-error');
                // });
                // ---------------------


                // remove error mess after delay
                if( self.options.wait > 0 || item.hasClass('multiple') )
                {
                    var delay = self.options.wait ? self.options.wait : 5000;
                    self.T1wait = setTimeout(function() {
                        // msgBox.fadeOut(200);
                        props.onError[1] && props.onError[1]({...self.options});
                    }, delay);
                } // endif

                // if error item lost focus
                item.on('blur', function()
                {
                    $(this).off('blur');
                    clearTimeout(self.T1wait);
                    // self.FLAG_STOP || msgBox.fadeOut(200);
                    props.onError[1] && props.onError[1]({...self.options});
                    $(this).off('blur');
                });
                self.FLAG_STOP = 0;
            });

            return false
        }
        else
        {
            if( props.justReturn )
            {
                return true;
            }
            else
            {
                // alert('ok')
                frmObj.off('submit').submit();
                return true;
            } // endif
        } // endif
    }


    /**
     * Set option
     * @param fName - filter name
     * @param fVal - filter value
     */
    private setOptions(fName, fVal)
    {
        var self = this;

        self.options[fName] = fVal;
/*
        if( fName == 'name' ) self.options.name = fVal;

        // element for attach error message
        else if( fName == 'elem' )
        {
            // actionItem
            self.options.elem = $(fVal);


        // element for attach error message
        } else if( fName == 'message' )
        {
            // actionMessage
            self.options.message = fVal;


        // wait for mess close
        } else if (fName == 'wait')
        {
            // self.waitTimeErrorMess
            self.options.wait = fVal;
        } // endif*/
    }


    private filterEmpty(inProps)
    {
        var self = this;
        var flagError = 0;

        if( inProps.itemVal == '' )
        {
            flagError = 1;
            self.options.message = 'Field "' + self.options.name + '" is empty';
        }
        return flagError;
    }

    private filterMax(inProps)
    {
        var self = this;
        if( inProps.itemVal.length > inProps.filterVal )
        {
            self.options.message = 'Field "' + self.options.name + '" is max ' + inProps.filterVal + ' symbols';
            return true;
        } // endif
        return false;
    }


    private filterMulti(inProps)
    {
        var self = this;
        if( !inProps.itemVal || inProps.itemVal.length < 1 )
        {
            self.options.message = 'Выберите значение в поле "' + self.options.name + '"';
            self.options.elem = self.options.elem.next('.ms-parent');
            return true;
        } // endif
        return false;
    }


    private filterEmail(inProps)
    {
        var self = this;
        if( !(new RegExp("^[^@]+@[^.]+\.[^.^@]{2,}[^@]*$", '')).test(inProps.itemVal) )
        {
            self.options.message = 'Field "' + self.options.name + '" needs correct email';
            return true;
        } // endif
        return false;
    }


    private filterIf(inProps)
    {
        var self = this;
        return inProps.itemVal == inProps.filterVal;
    }


    private filterIfhere(inProps)
    {
        var self = this;

        let flag = false;
        let $thereVal = $(this.options.elemthere).val();
        let $hereVal = inProps.itemVal;
        let $hereFilter = this.options.ifhere;
        let $thereFilter = this.options.ifthere;

        // 0||console.log( 'here f', $hereFilter, $hereVal, $thereVal, $thereFilter );
            // 1. Если here = hval && there = tval
            // 2. Если here = {empty} && hval = "" && there = tval
            // 3. Если here = {thereval} && hval = tval
        // if( $hereVal == $hereFilter && $thereVal == $thereFilter ) return true; // пока нет применений
        if( $hereFilter == "{empty}" && $hereVal == "" && $thereVal == $thereFilter ) { self.options.message = 'Field "' + self.options.name + '" is empty'; return true; }
        // else if( $hereFilter == "{thereval}" && $hereVal == "" && $thereVal == $thereFilter ) return true;

        return false;
    }


    private filterPassword(inProps)
    {
        var self = this;
        if( inProps.itemVal != $(inProps.filterVal).val() )
        {
            self.options.message = 'Пароль и его повторение не совпадают';
            // self.options.elem = inProps.filterVal;
            return true;
        } // endif
        return false;
    }


    private filterNotonlydigits(inProps)
    {
        var self = this;
        if( !(new RegExp("([a-zA-ZА-Я]+)")).test(inProps.itemVal) )
        {
            if( !self.options.message ) self.options.message = `Field "${self.options.name}" may contain only digits`;
            // self.options.elem = inProps.filterVal;
            return true;
        } // endif
        return false;
    }


    private filterCustom(inProps)
    {
        var self = this;
        let ret = self.customCheckers[inProps.filterVal]({item: inProps.item, value: inProps.itemVal, fieldname: self.options.name});

        if( ret )
        {
            self.options.message = ret.message;
            if (ret.item) self.options.elem = ret.item;
            return true;
        }

        return false;
    }
}