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
        actionDelay: 400 //number - delay of action executing
    };
    private props;

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

        $(document).bind('click', (event) => {
            // __DEV__ && console.log('document click');
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
        if(!this.props.element)
            throw new TypeError(`you must transfer "element" to bindGlobalClick method`);

        else if(defaultMethods.getType(this.props.element).slice(0, 4) !== 'HTML' &&
        defaultMethods.getType(this.props.element) !== 'String')
            throw new TypeError(`"element" type is ${defaultMethods.getType(this.props.element)}, but it must be String or DOM element`);

        if(this.props.method && typeof this.props.method !== 'string')
            throw new TypeError(`"method" type is ${defaultMethods.getType(this.props.method)}, but it must be String`);

        if(this.props.customCloseFunction && typeof this.props.customCloseFunction !== 'function')
            throw new TypeError(`"customCloseFunction" type is ${defaultMethods.getType(this.props.customCloseFunction)}, but it must be Function`);

        if(this.props.defaultClose && typeof this.props.defaultClose !== 'boolean')
            throw new TypeError(`"defaultClose" type is ${defaultMethods.getType(this.props.defaultClose)}, but it must be Boolean`);

        if(this.props.actionDelay && typeof this.props.actionDelay !== 'number')
            throw new TypeError(`"actionDelay" type is ${defaultMethods.getType(this.props.actionDelay)}, but it must be Number`);

        if(this.props.excludeElements && defaultMethods.getType(this.props.excludeElements) !== 'Array')
        {
            throw new TypeError(`"excludeElements" type is ${defaultMethods.getType(this.props.excludeElements)}, but it must be Array`);
        }
        else if(this.props.excludeElements && this.props.excludeElements.some((item) => defaultMethods.getType(item).slice(0, 4) !== 'HTML' &&
            defaultMethods.getType(item) !== 'String'))
        {
            throw new TypeError('"excludeElements" must consist of Strings or DOM elements');
        }
    }
}
