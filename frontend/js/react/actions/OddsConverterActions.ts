/**
 * Created by Htmlbook on 01.08.2017.
 */

import {
    ODDSCONVERTER_CHANGE,
} from '../constants/ActionTypesOdds';
import BaseActions from './BaseActions';
import OddsConverter from '../models/oddsConverter';

export default class Actions extends BaseActions
{
    private _OddsConverterObj = new OddsConverter;


    setOddsSystem (system)
    {
        return (dispatch) =>
        {
            this._OddsConverterObj.setOddSystem(system);

            ABpp.SysEvents.notify(ABpp.SysEvents.EVENT_CHANGE_ODD_SYSTEM, {currentOddSystem: system});

            dispatch({
                type: ODDSCONVERTER_CHANGE,
                payload: system
            });
        };
    }
}
