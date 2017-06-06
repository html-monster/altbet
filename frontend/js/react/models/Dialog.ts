/**
 * Created by Vlasakh on 03.02.2017.
 */

/// <reference path="../../../js/.d/common.d.ts" />

// import {Loading} from "./Loading";


export class Dialog
{
    public static TYPE_DIALOG = 1;
    public static TYPE_MESSAGE = 2;

    private dialogObj;

    private options = {
            target: "[data-js-dialog-mp]",  // mount point for html template
            render: false,                  // render after construct
            type: 1,
            vars: {
                contentHtml: 'Please, confirm your action',
                btn1Text: "Yes",
                btn2Text: "No",
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
            if (props.render) this.render();
        } // endif
    }



    public render(inProps?)
    {
        var self = this;

        if( inProps ) this.saveProps(inProps);

            // vars: {
            //     contentHtml: '',
            //     btn1Text: "Yes",
            //     btn2Text: "No",
            // }
        let $wrapper = $("[data-js-dialog-win].template").clone().removeClass("template");
        this.dialogObj = $wrapper;

        // dialog type
        if (this.options.type == Dialog.TYPE_MESSAGE) $("[data-js-btn2]", $wrapper).hide();


        // apply dialog vars
        $("[data-js-btn1]", $wrapper).prop("disabled", false).text(this.options.vars.btn1Text);
        $("[data-js-btn2]", $wrapper).text(this.options.vars.btn2Text);
        $("[data-js-message]", $wrapper).html(this.options.vars.contentHtml);


        $("[data-js-wrapper]", $wrapper).click(function(e) { self.onWrapperClick(e, this) });
        // cancel btn
        $("[data-js-btn2]", $wrapper).click(function(e) { self.onBtn2Click(e, this) });
        // yes btn
        $("[data-js-btn1]", $wrapper).click(function(e) { self.onBtn1Click(e, this) });


        $("[data-js-dialog-mp]").empty().append($wrapper);
        $($wrapper).fadeIn(400);

        this.options.afterInit && this.options.afterInit(this, this.dialogObj);
    }



    public close()
    {
        $(this.dialogObj).fadeOut(200);
    }



    private saveProps(inProps)
    {
        this.options = Object.assign({}, this.options, inProps);
    }



    private onBtn2Click(ee, that)
    {
        if( this.options.callbackCancel )
        {
            if (this.options.callbackCancel()) this.close();
        }
        else
        {
            this.close();
        } // endif
    }



    private onWrapperClick(ee, that)
    {
        if( $(ee.target).data('js-wrapper') == 'wrapper' )
        {
            this.close();
        } // endif
    }



    private onBtn1Click(ee, that)
    {
        var self = this;

        var $target = $(ee.target);
        $target.prop("disabled", true);
        __DEV__&&console.log( 'btn 1 click', 0 );

        if (this.options.callbackOK)
        {
            var $Promise = new Promise((resolve, reject) =>
            {
                this.options.callbackOK({event: ee, that: self, resolve, reject});
            });


            $Promise.then(
                () => $(this.dialogObj).fadeOut(200),
                (isClose = 0) =>
                {
                    // 0||console.log( 'here rej', isClose );
                    $target.prop("disabled", false);
                    isClose && $(this.dialogObj).fadeOut(200)
                }
            );
        } // endif


    }
}