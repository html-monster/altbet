/**
 * Created by Vlasakh on 17-01-17.
 */


import {MainConfig, DS} from "../inc/MainConfig";


export class Loading
{
    public static ALIGN_LEFT = 'left';
    public static ALIGN_RIGHT = 'right';
    public static ALIGN_CENTER = 'center';
    public static ALIGN_OUTER_LEFT = 'left';
    public static ALIGN_OUTER_RIGHT = 'right';

    public static POS_INLINE = 1;
    public static POS_ABSOLUTE = 2;

    private defProps = {
        tmplElm: '#DiLoading',
        targetElm: 'body',
        element: null,
        render: false,
        position: 2,
        align: 'center',
        valign: 'middle',
        pic: 2,
        offsetX: 0,
        offsetY: 0,
        outerAlign: '',
        withBg: false
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
        var self = this;
        var left, top;
        var $css = {};

        // delete old loading view
        0||console.log( 'this.loadingObj', this.loadingObj );
        this.loadingObj && this.loadingObj.remove();

        inProps = {...this.props, ...inProps};

        var DiLoading = $(inProps.tmplElm).clone();
        var inElm = $(inProps.element);
        this.loadingObj = DiLoading;
        0||console.log( 'DiLoading', DiLoading );

        //G_VARS.App.showLoading($("#DiMessages"), 0, {align: 'center', pic: 1, variant: 2});

        var src = MainConfig.BASE_URL + DS + MainConfig.PATH_PIC + '/loading'+inProps.pic+'.gif';


        DiLoading.find('img').attr('src', src).one('load', function()
        {
            // align outer left
            if( inProps.outerAlign == Loading.ALIGN_OUTER_LEFT ) left = inElm.offset().left - DiLoading.width() + inProps.offsetX;
            // align outer right
            else if( inProps.outerAlign == Loading.ALIGN_OUTER_RIGHT ) left = inElm.offset().left + inElm.outerWidth() + inProps.offsetX + 2;

            // align right
            else if( inProps.align == Loading.ALIGN_RIGHT ) left = inElm.offset().left + inElm.outerWidth() - DiLoading.width() + inProps.offsetX;
            // align center
            else if( inProps.align == Loading.ALIGN_CENTER ) left = inElm.offset().left + (inElm.outerWidth() - DiLoading.outerWidth()) / 2;
            // align left
            else if( inProps.align == Loading.ALIGN_LEFT ) left = inElm.offset().left + inProps.offsetX;


            // vertical align
            if( inProps.valign == 'top' ) top = inElm.offset().top + inProps.offsetY;
            else if( inProps.valign == 'middle' ) top = inElm.offset().top + ((inElm.outerHeight() - DiLoading.height()) / 2);

            if( inProps.position == Loading.POS_ABSOLUTE )
            {
                DiLoading.css({left: left, top: top});

            // position inline
            } else {
                // align outer right
                if( inProps.outerAlign == Loading.ALIGN_OUTER_RIGHT && inProps.offsetX ) $css = {marginLeft: inProps.offsetX};
                else ;


                DiLoading.css({position: "relative", display: 'inline-block', ...$css});
            } // endif

            if( inProps.withBg ) {
                if( inProps.pic == '1' ) DiLoading.addClass('wb-sq');
                else DiLoading.addClass('wb');
            } else DiLoading.removeClass('wb wb-sq');


            DiLoading.stop().fadeIn(400);
        });

        $(inProps.targetElm).prepend(DiLoading);
    }



    public hideLoading()
    {
        $(this.loadingObj).stop().fadeOut(200, () => this.loadingObj.remove());
    }
}