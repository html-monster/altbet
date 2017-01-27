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

    private options = {
        TPLName: '#TPLinfoMessage',
        target: '.js-infomessage',
        timeout: 10000,
        vars: null,
        callbackOK: null,
        callbackCancel: null,
    };

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

        switch( this.options.vars.type )
        {
            case InfoMessage.TYPE_SUCCESS : this.options.vars.icon = "fa-check";
                this.options.vars.alertType = "alert-success";
                break;
            case InfoMessage.TYPE_ALERT : this.options.vars.icon = "fa-warning";
                this.options.vars.alertType = "alert-warning";
                break;
            default: this.options.vars.icon = "fa-info";
        }


        var source = $(this.options.TPLName).html();
        var template = Handlebars.compile(source);
        var html = template(this.options.vars);


        let mountPoint = $(this.options.target);
        mountPoint.hide();
        mountPoint.html(html);
        mountPoint.fadeIn(400);

        clearTimeout(this.T1infoMess);
        this.T1infoMess = setTimeout(() => mountPoint.children().fadeOut(200, function() { $(this).remove() }), this.options.timeout);
    }



    public close()
    {
        clearTimeout(this.T1infoMess);
        $(this.options.target).children().fadeOut(200);
    }



    private saveProps(inProps)
    {
        this.options = {...this.options, ...inProps, vars: inProps.vars};
    }
}