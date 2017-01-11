/**
 * Created by Vlasakh on 04.01.2017.
 */

/// <reference path="./../../js/.d/common.d.ts" />

import BaseView from "./BaseView";
import { MainConfig, DS } from "../inc/MainConfig";


export default class BodyView extends BaseView
{
    public static ALIGN_LEFT = 'left';
    public static ALIGN_RIGHT = 'right';
    public static ALIGN_CENTER = 'center';
    public static ALIGN_OUTER_LEFT = 'left';
    public static ALIGN_OUTER_RIGHT = 'right';

    public addClass(inClass)
    {
        $("body").addClass('page-' + inClass);
    }



    /**
     * Loader luncher 2.0
     * @param props
     */
    public showLoading(inElm, props?)
    {
        //G_VARS.App.showLoading($("#DiMessages"), 0, {align: 'center', pic: 1, variant: 2});
        var self = this;
        var DiLoading = $("#DiLoading");
        var defProps = { align: 'center',
            valign: 'middle',
            pic: 2,
            offsetX: 0,
            offsetY: 0,
            outerAlign: '',
            withBg: false
        };

        inElm = $(inElm);

        $.extend(defProps, props);
        props = defProps;

        var src = MainConfig.BASE_URL + DS + MainConfig.PATH_PIC + '/loading'+props.pic+'.gif';

        DiLoading.find('img').attr('src', src).one('load', function()
        {
            // align outer left
            if( props.outerAlign == BodyView.ALIGN_OUTER_LEFT ) DiLoading.css({left: inElm.offset().left - DiLoading.width() + props.offsetX});
            // align outer right
            else if( props.outerAlign == BodyView.ALIGN_OUTER_RIGHT ) DiLoading.css({left: inElm.offset().left + inElm.outerWidth() + props.offsetX + 2});

            // align right
            else if( props.align == BodyView.ALIGN_RIGHT ) DiLoading.css({left: inElm.offset().left + inElm.outerWidth() - DiLoading.width() + props.offsetX});
            // align center
            else if( props.align == BodyView.ALIGN_CENTER ) DiLoading.css({left: inElm.offset().left + (inElm.outerWidth() - DiLoading.outerWidth()) / 2});
            // align left
            else if( props.align == BodyView.ALIGN_LEFT ) DiLoading.css({left: inElm.offset().left + props.offsetX});


            // vertical align
            if( props.valign == 'top' ) DiLoading.css({top: inElm.offset().top + props.offsetY});
            else if( props.valign == 'middle' ) DiLoading.css({top: inElm.offset().top + ((inElm.outerHeight() - DiLoading.height()) / 2)});

            if( props.withBg ) {
                if( props.pic == '1' ) DiLoading.addClass('wb-sq');
                else DiLoading.addClass('wb');
            } else DiLoading.removeClass('wb wb-sq');

            DiLoading.stop().fadeIn(400);
        });
    }



    public hideLoading(inTime = 200)
    {
        setTimeout(()=>{ $("#DiLoading").stop().fadeOut(200) }, inTime);
    }
}
