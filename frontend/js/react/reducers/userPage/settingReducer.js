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
	files:[
		// {
		// 	thumbUrl: `${globalData.rootUrl}Images/event_page_chart_b.jpg`,
		// 	fileUrl: `${globalData.rootUrl}Images/event_page_chart_b.jpg`,
		// 	fileType: 'image',
		// 	extension: 'jpg',
		// 	name: 'Some.jpg',
		// 	id: 111,
		// 	size: 540000
		// },
		// {
		// 	thumbUrl: `${globalData.rootUrl}Images/curacao_logo.png`,
		// 	fileUrl: `${globalData.rootUrl}Images/curacao_logo.png`,
		// 	fileType: 'image',
		// 	extension: 'png',
		// 	name: 'Some.png',
		// 	id: 211,
		// 	size: 350000
		// },
		// {
		// 	fileUrl: `${globalData.rootUrl}test.txt`,
		// 	fileType: 'document',
		// 	extension: 'txt',
		// 	name: 'Some.txt',
		// 	id: 311,
		// 	size: 138000
		// },
		// {
		// 	fileUrl: `${globalData.rootUrl}test.doc`,
		// 	fileType: 'document',
		// 	extension: 'doc',
		// 	name: 'Some.doc',
		// 	id: 411,
		// 	size: 145000
		// },
		// {
		// 	fileUrl: `${globalData.rootUrl}test.xls`,
		// 	fileType: 'document',
		// 	extension: 'xls',
		// 	name: 'Some.xls',
		// 	id: 511,
		// 	size: 113000
		// },
	]
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

