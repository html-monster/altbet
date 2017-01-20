/**
 * Created by Vlasakh on 30.12.2016.
 */

/// <reference path="../../js/.d/common.d.ts" />



export class AlertBox
{
    public static TYPE_WARN = 'modal-warning';
    public static TYPE_INFO = 'modal-default';

    private options = {
            TPLName: '#TPLmodalDialog',
            target: '.js-mp-dialog',
            render: true,
            vars: {
                title: 'Info',
                btnOkTitle: 'OK',
                noCancel: true,
            },
            afterInit: null,
            callbackCancel: null,
            callbackOK: null,
        };



    constructor(props?)
    {
        if( props )
        {
            this.saveProps(props);
            if (this.options.render) this.render();
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
        // $("[data-js=cancel]", this.options.target).click(function(e) { self.onCloseClick(e, this) });
        $("[data-js=wrapper]", this.options.target).click(function(e) { self.onWrapperClick(e, this) });
        $("[data-js=ok], [data-js=BtnClose]", this.options.target).click(function(e) { self.onOkClick(e, this) });


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
        let vars = {...this.options.vars, ...inProps.vars};
        this.options = {...this.options, ...inProps, ...{vars: vars}};
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

        let flag = true;
        this.options.callbackOK && (flag = this.options.callbackOK());

        flag && $("[data-js=wrapper]", this.options.target).fadeOut(200);
    }
}



export function messageBox({message, title = 'Info', type = AlertBox.TYPE_INFO})
{
    let vars : any = {
        title: title && 'Info',
        modalBody: message,
        type: type,
    };

    (new AlertBox({vars: vars}));
}