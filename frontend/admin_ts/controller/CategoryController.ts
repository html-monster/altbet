/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import CategoryModel from "../model/CategoryModel";
import CategoryEdit from "../view/CategoryEdit";
import {InfoMessage} from "../component/InfoMessage";
import CategoryNew from "../view/CategoryNewView";
import { MainConfig, DS } from "../inc/MainConfig";


export class CategoryController extends BaseController
{
    /**
     * Edit category
     */
    public actionEdit()
    {
        var self = this;
        var form = $("#F1EditCat");

        $(".js-btn-cancel").click(function (e) { history.back(); });
        form.submit(function (e) { self.onSaveClick(e, this); });


        (new CategoryEdit).prepareForm({icons: globalData.iconClasses, form});
    }


    /**
     * Add category
     */
    public actionNew()
    {
        var self = this;
        var form = $("#F1EditCat");

        $(".js-btn-cancel").click(function (e) { history.back(); });
        form.submit(function (e) { self.onCreateClick(e, this); });

        (new CategoryNew).prepareForm({icons: globalData.iconClasses, form});
    }



    private onCreateClick(e, that)
    {
        var self = this;
        var $that = $(that);

        e.preventDefault();

        let categoryNew = (new CategoryNew);
        categoryNew.beginSave();

        if( categoryNew.checkFields() )
        {
            var form = $that.closest('form');
            var formData = new FormData(<HTMLFormElement>form[0]);
            // formData.set('op', '1');
            (new CategoryModel).addCategory({url: $that.attr('url'), name: $(".js-ed-name").val(), formData}).then( result =>
            {
                window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                location.href = MainConfig.BASE_URL + result.url;
            },
            reuslt => {
                // 0||console.debug( 'reuslt', reuslt );
                categoryNew.setErrors({code: reuslt.code, message: reuslt.message});
                categoryNew.endSave();
            });
            // (new CategoryModel).saveCategory($("#F1EditCat").serializeArray());
        }
        else
        {
            categoryNew.endSave();
        } // endif
    }



    private onSaveClick(e, that)
    {
        var self = this;
        var $that = $(that);

        e.preventDefault();

        let categoryEdit = (new CategoryEdit);
        categoryEdit.beginSave();

        if( categoryEdit.checkFields() )
        {
            var form = $that.closest('form');
            var formData = new FormData(<HTMLFormElement>form[0]);
            // formData.set('op', '1');
            (new CategoryModel).saveEditCategory({url: $that.attr('url'), name: $(".js-ed-name").val(), formData}).then(result =>
            {
                window.ADpp.User.setFlash({message: result.message, type: InfoMessage.TYPE_SUCCESS, header: "Success"});
                location.href = MainConfig.BASE_URL + result.url;
            },
            reuslt => {
                // 0||console.debug( 'reuslt', reuslt );
                categoryEdit.setErrors({code: reuslt.code, message: reuslt.message});
                categoryEdit.endSave();
            });
            // (new CategoryModel).saveCategory($("#F1EditCat").serializeArray());
        }
        else
        {
            categoryEdit.endSave();
        } // endif

    }
}
