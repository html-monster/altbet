/**
 * Created by Vlasakh on 05.01.2017.
 */


export var DS = '/';

export class MainConfig
{
    public static BASE_URL = '';

    public static PATH_PIC = "Images";

    // public static AJAX_TEST = 'Category/GetAjax';
    public static AJAX_TEST = 'Category/EditCategory?catery=nfl';
    public static AJAX_CATEGORY_ADD = 'Category/AddCategory';
    public static AJAX_CATEGORY_EDIT = 'Category/ChangeCategory';
    public static AJAX_EXCH_ADD = 'Home/CreateExchange';
    public static AJAX_EXCH_GET = 'Home/EditExchange';
    public static AJAX_EXCH_EDIT = 'Home/ChangeExchange';
    public static AJAX_GET_DETAILS = 'Home/Details';

    public static AJAX_EXCH_SET_STATUS_COMPLETED = 'Home/Completed';
}