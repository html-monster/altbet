/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseController from "./BaseController";
import CategoryEdit from "../view/CategoryEdit";


export default class Category extends BaseController
{
    public actionEdit()
    {
        0||console.debug( 'edit' );

        $(".js-btn-cancel").click(function (e) { history.back(); });

        (new CategoryEdit).initCBIcon(globalData.iconClasses);
    }
}
