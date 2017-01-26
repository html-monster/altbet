/**
 * Created by Vlasakh on 12.01.2017.
 */


export class SysEvents
{
    public EVENT_TURN_BASIC_MODE = '1';         // turn basic mode on/off (true/false)
    public EVENT_TURN_TRADER_ON = '2';          // turn active trader on/off (true/false)
    public EVENT_CHANGE_ACTIVE_SYMBOL  = '3';   // turn active trader on/off (true/false)

    private observers = {};
    private eventsDatas = {};   // save last notify params


    public subscribe(that, eventType, callback)
    {
        let name = ( that.constructor.name == 'String' ) ? that + (new Date()).getTime() : that.constructor.name;

        if (!this.observers[eventType]) this.observers[eventType] = {} ;
        if (typeof callback == 'function') this.observers[eventType][name] = callback;
    }


    /**
     * Notify subscribers
     * @param type
     * @param params
     */
    public notify(type, params?)
    {
        if (params) this.eventsDatas[type] = params;
        for( let ii in this.observers[type] )
        {
            this.observers[type][ii](params);
        } // endfor
    }


    /**
     * @param type
     * @param params
     */
    public getLastNotifyData(type)
    {
        return this.eventsDatas[type];
    }
}