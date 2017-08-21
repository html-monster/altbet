/**
 * Created by Htmlbook on 28.02.2017.
 */
import {
	ON_TEST_MODE,
} from '../constants/ActionTypesHeader.js';
import BaseActions from './BaseActions';

export default class Actions extends BaseActions
{
	/**
	 * subscribe for socket
	 */
    public actionSwitchBasicMode(inMode)
    {
        return (dispatch, getState) =>
        {
            dispatch({
                type: ON_TEST_MODE,
                payload: inMode
            });
        };
    }
}
