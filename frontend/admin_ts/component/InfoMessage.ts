/**
 * Created by Vlasakh on 07-01-17.
 */

declare var Handlebars;


export class InfoMessage
{
    public static prevInfoMessage;

    public static TYPE_SUCCESS = 1;
    public static TYPE_ALERT = 2;

    private vars;
    private TPLName;
    private target;
    private callbackOK;
    private callbackCancel;

    private T1infoMess;


    constructor(props?)
    {
        if( props )
        {
            this.saveProps(props);
            if (props.render) this.render();
        } // endif


        InfoMessage.prevInfoMessage = this;
    }



    public render(inProps?)
    {
        var self = this;

        if( inProps ) this.saveProps(inProps);

        switch( this.vars.type )
        {
            case InfoMessage.TYPE_SUCCESS : this.vars.icon = "fa-check";
                this.vars.alertType = "alert-success";
                break;
            case InfoMessage.TYPE_ALERT : this.vars.icon = "fa-warning";
                this.vars.alertType = "alert-warning";
                break;
            default: this.vars.icon = "fa-info";
        }


        var source = $(this.TPLName).html();
        var template = Handlebars.compile(source);
        var html = template(this.vars);


        let mountPoint = $(this.target);
        mountPoint.hide();
        mountPoint.html(html);
        mountPoint.fadeIn(400);

        clearTimeout(this.T1infoMess);
        this.T1infoMess = setTimeout(() => mountPoint.children().fadeOut(200, function() { $(this).remove() }), 10000);
    }



    public close()
    {
        clearTimeout(this.T1infoMess);
        $(this.target).children().fadeOut(200);
    }



    private saveProps(inProps)
    {
        if (inProps.TPLName) this.TPLName = inProps.TPLName;
        if (inProps.target) this.target = inProps.target;
        if (inProps.vars) this.vars = inProps.vars;
        if (inProps.callbackOK) this.callbackOK = inProps.callbackOK;
        if (inProps.callbackCancel) this.callbackCancel = inProps.callbackCancel;
    }
}