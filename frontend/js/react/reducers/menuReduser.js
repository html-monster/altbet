/**
 * Created by Htmlbook on 17.05.2017.
 */
import {
	ON_SUBMENU_SHOW_OR_HIDE,
	ON_MENU_GET_DATA
} from '../constants/ActionTypesMainMenu';

const initialState = {
	menuData: appData.menuData,
	showSubmenu: false,
	currentData: {}
};


export default function mainMenu(state = initialState, action)
{
	switch (action.type)
	{
		case ON_SUBMENU_SHOW_OR_HIDE:
			return {...state, showSubmenu: action.payload};

		case ON_MENU_GET_DATA:
			return {...state, activeCat: action.payload.currentData.activeCat || state.activeCat, ...action.payload};

		default:
			return state;
	}

}