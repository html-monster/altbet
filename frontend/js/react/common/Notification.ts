/**
 * Created by Htmlbook on 16.08.2017.
 */
declare let Lobibox : any;
declare let $ : any;

export default class Notification
{
    static typeDefault = 'default';
    static typeError = 'error';
    static typeWarning = 'warning';
    static typeInfo = 'info';
    static typeSuccess = 'success';
    private InitialState = null;

    constructor(params)
    {
        this.InitialState = {
            soundPath: '../../sounds/',
            title: false,
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            ...params
        };

        Lobibox.notify.DEFAULTS = $.extend({}, Lobibox.notify.DEFAULTS, {
            iconSource: 'fontAwesome'
        });
    }

    /**
     * @param params : object - plugin params https://lobianijs.com/site/lobibox#notifications
     * @param messageType : string - type of message (can be default, error, info, warning, success)
     */
    public showMessage (params, messageType = Notification.typeDefault)
    {
        if(this.checkPropsType(params, messageType)) return false;

        Lobibox.notify(messageType, {
            ...this.InitialState,
            ...params
        });
    }

    public showError (params)
    {
        if(this.checkPropsType(params)) return false;

        Lobibox.notify(Notification.typeError, {
            ...this.InitialState,
            ...params
        });
    }

    public showInfo (params)
    {
        if(this.checkPropsType(params)) return false;

        Lobibox.notify(Notification.typeInfo, {
            ...this.InitialState,
            ...params
        });
    }

    public showWarning (params)
    {
        if(this.checkPropsType(params)) return false;

        Lobibox.notify(Notification.typeWarning, {
            ...this.InitialState,
            ...params
        });
    }

    public showSuccess (params)
    {
        if(this.checkPropsType(params)) return false;

        Lobibox.notify(Notification.typeSuccess, {
            ...this.InitialState,
            ...params
        });
    }

    private checkPropsType(params, messageType = null)
    {
        const paramsType = defaultMethods.getType(params);

        try {
            if(params && paramsType !== 'Object') throw new TypeError(`First parameter is ${paramsType}, but it must be Object`);

            if(messageType)
            {
                const typeOfMessageType = defaultMethods.getType(messageType);
                const messageTypes = [Notification.typeDefault, Notification.typeError, Notification.typeInfo, Notification.typeWarning, Notification.typeSuccess];

                if(typeOfMessageType !== 'String') throw new TypeError(`Second parameter is ${typeOfMessageType}, but it must be String`);
                if(!(messageTypes.some((item) => item === messageType)))
                    throw new TypeError(`Second parameter is '${messageType}', but expected one of ['${Notification.typeDefault}', '${Notification.typeError}', '${Notification.typeInfo}', '${Notification.typeWarning}', '${Notification.typeSuccess}']`);
            }
        } catch (error)
        {
            console.error(error);
            return true;
        }
    }

}