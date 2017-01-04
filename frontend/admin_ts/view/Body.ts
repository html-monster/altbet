/**
 * Created by Vlasakh on 04.01.2017.
 */

import BaseView from "./BaseView";


export default class Body extends BaseView
{
    public addClass(inClass)
    {
        $("body").addClass('page-' + inClass);
    }
}
