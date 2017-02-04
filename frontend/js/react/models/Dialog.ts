/**
 * Created by Vlasakh on 03.02.2017.
 */

/// <reference path="../../../js/.d/common.d.ts" />

// import {Loading} from "./Loading";


export default class Dialog
{
    // private vars;
    // private TPLName;
    // private target;
    // private afterInit;
    // private callbackOK;
    // private callbackCancel;
/*
    private options = {
            TPLName: '',
            target: '',
            render: false,
            vars: null,
            afterInit: null,
            callbackCancel: null,
            callbackOK: null,
        };


    constructor(props?)
    {
        if( props )
        {
            this.saveProps(props);
            if (props.render) this.render();
        } // endif
    }



    public render(inProps?)
    {
        var self = this;

        if( inProps ) this.saveProps(inProps);


        var source = $(this.options.TPLName).html();
        var template = Handlebars.compile(source);
        var html = template(this.options.vars);


        $(this.options.target).html(html);
        $("[data-js=cancel], [data-js=BtnClose]", this.options.target).click(function(e) { self.onCloseClick(e, this) });
        $("[data-js=wrapper]", this.options.target).click(function(e) { self.onWrapperClick(e, this) });
        $("[data-js=ok]", this.options.target).click(function(e) { self.onOkClick(e, this) });


        $("[data-js=wrapper]", this.options.target).fadeIn(400);

        this.options.afterInit && this.options.afterInit(this, this.options.target);
    }



    public close()
    {
        if (this.options.callbackCancel) this.options.callbackCancel();
        $("[data-js=wrapper]", this.options.target).fadeOut(200);
    }



    private saveProps(inProps)
    {
        this.options = Object.assign({}, this.options, inProps);

        // if (inProps.TPLName) this.options.TPLName = inProps.TPLName;
        // if (inProps.target) this.options.target = inProps.target;
        // if (inProps.vars) this.options.vars = inProps.vars;
        // if (inProps.callbackOK) this.options.callbackOK = inProps.callbackOK;
        // if (inProps.callbackCancel) this.options.callbackCancel = inProps.callbackCancel;
    }



    private onCloseClick(ee, that)
    {
        this.close();
    }



    private onWrapperClick(ee, that)
    {
        if( $(ee.target).data('js') == 'wrapper' )
        {
            this.onCloseClick(ee, that);
        } // endif
    }



    private onOkClick(e, that)
    {
        e.stopPropagation();

        (new Loading).showLoading({targetElm: $('[data-js=loading]', this.options.target), element: $("[data-js=ok]", this.options.target), pic: 2, outerAlign: Loading.ALIGN_OUTER_LEFT, offsetX: 4, position: Loading.POS_INLINE});

        if (this.options.callbackOK)
            if (this.options.callbackOK(event))
                $("[data-js=wrapper]", this.options.target).fadeOut(200);
    }*/
}