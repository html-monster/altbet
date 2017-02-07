/**
 * Created by Vlasakh on 03.02.2017.
 */

/// <reference path="../../../js/.d/common.d.ts" />

// import {Loading} from "./Loading";


export class Dialog
{
    private dialogObj;

    private options = {
            render: false,
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
        let $wrapper = $("[data-js-dialog-win]");
        this.dialogObj = $wrapper;
        $("[data-js-btn1]", $wrapper).text(this.options.vars.btn1Text);
        $("[data-js-btn2]", $wrapper).text(this.options.vars.btn2Text);
        $("[data-js-message]", $wrapper).text(this.options.vars.contentHtml);


        $("[data-js-wrapper]", $wrapper).click(function(e) { self.onWrapperClick(e, this) });
        $("[data-js-btn2]", $wrapper).click(function(e) { self.onBtn2Click(e, this) });
        $("[data-js-btn1]", $wrapper).click(function(e) { self.onBtn1Click(e, this) });


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
        if (this.options.callbackOK)
            if (this.options.callbackOK(ee, this.dialogObj))
                $("[data-js=wrapper]", this).fadeOut(200);
    }
}