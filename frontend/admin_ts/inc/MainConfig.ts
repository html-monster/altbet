/**
 * Created by Vlasakh on 05.01.2017.
 */


export var DS = '/';

export class MainConfig
{
    public static BASE_URL = '';

    public static PATH_PIC = "Images";

    // public static AJAX_TEST = 'Category/GetAjax';
    // public static AJAX_TEST = 'Category/EditCategory?catery=nfl';
    // public static AJAX_TEST = 'Category/TestAction';
    public static AJAX_TEST = 'http://localhost/AltBet.Admin/Category/TestAction';

    public static AJAX_CATEGORY_ADD = 'Category/AddCategory';
    public static AJAX_CATEGORY_EDIT = 'Category/ChangeCategory';
    public static AJAX_EXCH_GET = 'Home/EditExchange';
    public static AJAX_EXCH_ADD = 'Home/CreateExchange';
    public static AJAX_EXCH_EDIT = 'Home/ChangeExchange';
    public static AJAX_EXCH_DEL = 'Home/RemoveExchange';
    public static AJAX_GET_DETAILS = 'Home/Details';

    public static AJAX_EXCH_SET_STATUS_APPROVED = 'Home/Approved';
    public static AJAX_EXCH_SET_STATUS_COMPLETED = 'Home/Completed';
    public static AJAX_EXCH_SET_STATUS_SETTLEMENT= 'Home/Settlement';

    public static AJAX_CATEGORY_MOVE = 'Category/MoveCategory';

    public static AJAX_FEED_GETPLAYERS = 'Feed/GetPlayers';
    public static AJAX_FEED_GETTIMEEVENT = 'Feed/GetTimeEvent';
    public static AJAX_FEED_GET_EVENTS = 'Feed/GetEvents';
    public static AJAX_FEED_CREATE_FEED_EXCHANGE = 'Feed/CreateFeedExchange';
}