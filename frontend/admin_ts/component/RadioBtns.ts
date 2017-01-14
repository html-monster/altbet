/**
 * Created by Vlasakh on 13.01.2017.
 */


export class RadioBtns
{
    public options = {};


    constructor(props?)
    {
        this.options = {
            callbacks: [],
            activeClass: "btn-info",
            defaultIndex: 0, // default btn active
        };

        if( props )
        {
            Object.assign(this.options, props, this.options);
        } // endif
    }


    public apply()
    {
        var self = this;

        $("[data-js=radio-btn]:not(.js-rb-applied)").each(function()
        {
            let $wrapper = $(this);

            let $buttons = $wrapper.find('button');
            $buttons.each(function(key)
            {
                $(this).attr("data-id", key);
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
        let activeClass = this.activeClass;

        meta.valueStor.val($(that).data("rval"));

        for( let ii = 0, countii = meta.buttons.length; ii < countii; ii++ )
        {
            $(meta.buttons[ii]).removeClass("active").removeClass(activeClass).addClass("btn-default");
        } // endfor
        $(that).addClass(`active ${activeClass}`).removeClass("btn-default");
    }
}