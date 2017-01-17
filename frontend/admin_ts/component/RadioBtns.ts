/**
 * Created by Vlasakh on 13.01.2017.
 */


export class RadioBtns
{
    public options : any = {
            activeClass: "btn-info",
            defaultClass: "btn-default",
            defaultIndex: 0, // default btn active
            target: null,
            callbacks: [],
        };


    constructor(props?)
    {
        if( props )
        {
            Object.assign(this.options, props, this.options);
        } // endif
    }


    public apply()
    {
        var self = this;

        var $target = this.options.target || "[data-js=radio-btn]";

        $(`${$target}:not(.js-rb-applied)`).each(function()
        {
            let $wrapper = $(this);

            let $buttons = $wrapper.find('button');
            $buttons.each(function(key)
            {
                let $that = $(this);
                $that.attr("data-id", key);
                if (self.options.defaultIndex == key) $that.removeClass(self.options.defaultClass).addClass("active " + self.options.activeClass);
            });


            $buttons.click(function(e) { self.onClick(e, this, {
                    wrapper: $wrapper,
                    buttons: $buttons,
                    valueStor: $wrapper.find("[data-js=valueStor]"),
                })
            });

            $wrapper.addClass("js-rb-applied");
        });
    }



    private onClick(e, that, meta)
    {
        let activeClass = this.options.activeClass;

        let $that = $(that);
        meta.valueStor.val($that.data("rval"));

        for( let ii = 0, countii = meta.buttons.length; ii < countii; ii++ )
        {
            $(meta.buttons[ii]).removeClass("active").removeClass(activeClass).addClass(this.options.defaultClass);
        } // endfor
        $that.removeClass(this.options.defaultClass).addClass(`active ${activeClass}`);


        let callbacks = this.options.callbacks;
        if( callbacks )
        {
            typeof callbacks[$that.data('id')] == "function" && callbacks[$that.data('id')]();
        } // endif
    }
}