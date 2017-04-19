/**
 * Created by Htmlbook on 15.03.2017.
 */
import {
	SETTING_ON_FILE_LOAD,
	SETTING_CHANGE_PROGRESS_BAR,
	SETTING_LOAD_FILE_ERROR,
} from "../../constants/ActionTypesSetting";


const initialState = {
	loadProgress: 0,
	loadError: '',
	files: globalData.userPageOn ? appData.pageAccountData.jsonImageInfo : null
};

export default function accountSetting(state = initialState, action)
{
	switch (action.type)
	{
		case SETTING_ON_FILE_LOAD:
			return {...state, files: action.payload};

		case SETTING_CHANGE_PROGRESS_BAR:
			return {...state, loadProgress: action.payload};

		case SETTING_LOAD_FILE_ERROR:
			return {...state, loadError: action.payload};

		default:
			return state
	}

}

