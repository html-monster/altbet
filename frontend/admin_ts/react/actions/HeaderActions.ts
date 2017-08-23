/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	ON_BALVAN,
} from '../constants/ActionTypesHeader.js';
import {
	ON_CH_TEST_MODE,
} from '../constants/ActionTypesApp.js';
import BaseActions from './BaseActions';

export default class Actions extends BaseActions
{
	/**
	 * switch test mode false/true
	 */
    public actionChTestMode(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_CH_TEST_MODE,
                payload: inMode
            });
        };
    }
}
