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
        excludeElements: [] //string[] || object[] - elements what we want to exclude from clicking
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
        if(!this.props.element)
        {
            // console.error('Global close error, we must element transfer to bindGlobalClick method');
            return false;
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
                        setTimeout(()=> this.props.customCloseFunction(), 400);
                    else
                        this.props.customCloseFunction();
                }
                $(document).unbind(event)
            }

        })
    }
}
