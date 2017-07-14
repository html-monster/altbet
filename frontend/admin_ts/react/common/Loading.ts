/**
 * Created by Vlasakh on 17-01-17.
 */


import {MainConfig, DS} from "../../inc/MainConfig";

declare let $;


export class Loading
{
    // public static ALIGN_LEFT = 'left';

    private defProps = {
        tmplElm: '#DiLoading2',
        render: false,
        pic: 1,
    };

    private props;
    private loadingObj = null;


    constructor(props?)
    {
        if( props )
        {
            this.props = {...this.defProps, ...props};

            if (props.render) this.showLoading();
        } else {
            this.props = {...this.defProps};
        } // endif
    }



    public showLoading(inProps?)
    {
        // this.loadingObj && this.loadingObj.remove();

        inProps = {...this.props, ...inProps};

        var DiLoading = $(inProps.tmplElm);
        this.loadingObj = DiLoading;

        //G_VARS.App.showLoading($("#DiMessages"), 0, {align: 'center', pic: 1, variant: 2});

        // var src = MainConfig.BASE_URL + DS + MainConfig.PATH_PIC + '/loading'+inProps.pic+'.gif';
        DiLoading.stop().fadeIn(400);
    }



    public hideLoading()
    {
        // 0||console.log( 'this.loadingObj', this.loadingObj );
        $(this.loadingObj).stop().fadeOut(200);
    }
}