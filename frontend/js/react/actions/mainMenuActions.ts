/**
 * Created by Htmlbook on 17.05.2017.
 */
import {
    ON_SUBMENU_SHOW_OR_HIDE,
    ON_MENU_GET_DATA
} from '../constants/ActionTypesMainMenu';
import BaseActions from './BaseActions';

class Actions extends BaseActions
{
    /**
     * open current category menu list
     * @param actions object
     * @param currentData object - object with current category data
     * @returns {(dispatch:any, setState:any)=>undefined}
     */
    public getMenuCategory(actions, currentData)
    {
        return (dispatch, setState) =>
        {
            const { currentData: { CatId }, showSubmenu } = setState().mainMenu;

            dispatch({
                type: ON_MENU_GET_DATA,
                payload: { currentData },
            });

            actions.showHideSubMenu(!showSubmenu || CatId !== currentData.CatId)
        }
    }

    /**
     * show or hide submenu
     * @param show: boolean
     * @returns {(dispatch:any)=>undefined}
     */
    public showHideSubMenu(show)
    {
        return (dispatch) =>
        {
            if(show)
                $('#DiMainMenu').addClass('opened');
            else
                $('#DiMainMenu').removeClass('opened');

            dispatch({
                type: ON_SUBMENU_SHOW_OR_HIDE,
                payload: show,
            });
        }
    }
}

export default (new Actions()).export();