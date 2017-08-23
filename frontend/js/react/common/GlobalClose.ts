/**
 * Created by Htmlbook on 15.06.2017.
 */
/// <reference path="../../.d/common.d.ts" />

// enum Methods {
//     slideUp
// }

// interface iCloseStructure{
//     element;
//     method: string;
//     defaultClose: boolean;
//     customCloseFunction();
// }

export default class GlobalCloseClass
{
    public SLIDEUP = 'slideUp';
    private defaultProps = {
        element: null, //object || string - element what we want to close
        method: 'fadeOut', //string - jQuery method of closing
        customCloseFunction: null, //function - custom function, what we want bind to method
        defaultClose: true, //boolean - true, if we want use jQuery closing
        excludeElements: [], //string[] || object[] - elements what we want to exclude from clicking
        // closeButton: null, //string[] || object[] - close button (unbind global click)
        actionDelay: 400 //number - delay of action executing
    };
    private props;
    private static event;

    constructor(props)
    {
        this.props = {
            ...this.defaultProps,
            ...props
        }
    }

    /**
     * bind click on document that close element
     * @returns {boolean}
     */
    public bindGlobalClick()
    {
        try {
            this.checkPropsType();
        } catch (error)
        {
            console.error(error);
        }

        $(document).bind('click', (event) =>
        {
            // __DEV__ && console.log('document click');
            GlobalCloseClass.event = event;

            // if($(event.target).closest(this.props.closeButton).length)
            // {
            //     //__DEV__ && console.log('click on close button');
            //     $(document).unbind(event)
            // }

            if(!($(event.target).closest(this.props.element).length !== 0 ||
                this.props.excludeElements.some((element) =>  $(event.target).closest(element).length !== 0)))
            {
                // __DEV__ && console.log('element close');

                if(this.props.defaultClose)
                {
                    switch (this.props.method){
                        case this.SLIDEUP:
                            $(this.props.element).slideUp();
                            break;
                        default:
                            $(this.props.element).fadeOut();
                    }
                }
                if(this.props.customCloseFunction)
                {
                    if(this.props.defaultClose)
                        setTimeout(()=> this.props.customCloseFunction(), this.props.actionDelay);
                    else
                        this.props.customCloseFunction();
                }
                $(document).unbind(event)
            }

        })
    }


    private checkPropsType()
    {
        if(__DEV__)
        {
            const elementType = defaultMethods.getType(this.props.element);
            const methodType = defaultMethods.getType(this.props.method);
            const customCloseFunctionType = defaultMethods.getType(this.props.customCloseFunction);
            const defaultCloseType = defaultMethods.getType(this.props.defaultClose);
            const actionDelayType = defaultMethods.getType(this.props.actionDelay);
            const excludeElementsType = defaultMethods.getType(this.props.excludeElements);

            if(elementType === 'Null')
                throw new TypeError(`you must transfer "element" to bindGlobalClick method`);
            else if(elementType.slice(0, 4) !== 'HTML' && elementType !== 'String')
                throw new TypeError(`"element" type is ${elementType}, but it must be String or DOM element`);

            if(methodType !== 'String')
                throw new TypeError(`"method" type is ${methodType}, but it must be String`);

            if(customCloseFunctionType !== 'Null' && customCloseFunctionType !== 'Function')
                throw new TypeError(`"customCloseFunction" type is ${customCloseFunctionType}, but it must be Function`);

            if(defaultCloseType !== 'Boolean')
                throw new TypeError(`"defaultClose" type is ${defaultCloseType}, but it must be Boolean`);

            if(actionDelayType !== 'Number')
                throw new TypeError(`"actionDelay" type is ${actionDelayType}, but it must be Number`);

            // if(defaultMethods.getType(this.props.closeButton ) !== 'Null' && defaultMethods.getType(this.props.closeButton).slice(0, 4) !== 'HTML' &&
            //     defaultMethods.getType(this.props.closeButton) !== 'String')
            //     throw new TypeError(`"closeButton" type is ${defaultMethods.getType(this.props.closeButton)}, but it must be String or DOM element`);

            if(excludeElementsType !== 'Array')
            {
                throw new TypeError(`"excludeElements" type is ${excludeElementsType}, but it must be Array`);
            }
            else if(this.props.excludeElements.some((item) => defaultMethods.getType(item).slice(0, 4) !== 'HTML' &&
                defaultMethods.getType(item) !== 'String'))
            {
                throw new TypeError('"excludeElements" must consist of Strings or DOM elements');
            }
        }
    }

    /**
     * unbind event if window is closed without click
     */
    public static unbindCloseEvent()
    {
        if(GlobalCloseClass.event) $(document).unbind(GlobalCloseClass.event);
    }
}
