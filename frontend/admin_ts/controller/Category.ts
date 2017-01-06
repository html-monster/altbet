/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import CategoryModel from "../model/CategoryModel";
import CategoryEdit from "../view/CategoryEdit";


export default class Category extends BaseController
{
    public actionEdit()
    {
        var self = this;
        0||console.debug( 'edit' );

        $(".js-btn-cancel").click(function (e) { history.back(); });
        $(".js-btn-save").click(function (e) { self.onSaveClick(e, this); });

        (new CategoryEdit).initCBIcon(globalData.iconClasses);
    }



    private onSaveClick(e, that)
    {
        var self = this;
        var $that = $(that);

        (new CategoryEdit).beginSave();

        var form = $that.closest('form');
        var formData = new FormData(<HTMLFormElement>form[0]);
        // formData.set('op', '1');
        (new CategoryModel).saveCategory(formData).then( result => {
            0||console.debug( 'success' );
        });
        // (new CategoryModel).saveCategory($("#F1EditCat").serializeArray());
    }
}
