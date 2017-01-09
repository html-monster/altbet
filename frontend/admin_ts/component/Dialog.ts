/**
 * Created by Vlasakh on 30.12.2016.
 */

declare var Handlebars;


export default class Dialog
{
    private vars;
    private TPLName;
    private target;
    private callbackOK;
    private callbackCancel;


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


        var source = $(this.TPLName).html();
        var template = Handlebars.compile(source);
        var html = template(this.vars);


        $(this.target).html(html);
        $("[data-js=cancel], [data-js=wrapper]", this.target).click(function(e) { self.onCloseClick() });
        $("[data-js=ok]", this.target).click(function(e) { self.onOkClick(e, this) });


        $("[data-js=wrapper]", this.target).fadeIn(400);
    }



    private saveProps(inProps)
    {
        if (inProps.TPLName) this.TPLName = inProps.TPLName;
        if (inProps.target) this.target = inProps.target;
        if (inProps.vars) this.vars = inProps.vars;
        if (inProps.callbackOK) this.callbackOK = inProps.callbackOK;
        if (inProps.callbackCancel) this.callbackCancel = inProps.callbackCancel;
    }



    private onCloseClick()
    {
        if (this.callbackCancel) this.callbackCancel();
        $("[data-js=wrapper]", this.target).fadeOut(200);
    }



    private onOkClick(e, that)
    {
        e.stopPropagation();


        if (this.callbackOK)
            if (this.callbackOK())
                $("[data-js=wrapper]", this.target).fadeOut(200);
    }
}