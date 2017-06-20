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
    private state;

    constructor(props)
    {
        this.state = {
            element: null, //element: object || string - element what we want to close
            method: 'fadeOut', //method: string - jQuery method of closing
            customCloseFunction: null, //customCloseFunction: function - custom function, what we want bind to method
            defaultClose: true, //boolean - true, if we want use jQuery closing
            ...props
        }
    }


    public bindGlobalClick()
    {
        if(!this.state.element)
        {
            console.error('Global close error, we must element transfer to bindGlobalClick method');
            return false;
        }

        $(document).bind('click', (event) => {
            __DEV__ && console.log('element close');
            if($(event.target).closest(this.state.element).length !== 0)
                return false;


            if(this.state.defaultClose)
            {
                switch (this.state.method){
                    case this.SLIDEUP:
                        $(this.state.element).slideUp();
                        break;
                    default:
                        $(this.state.element).fadeOut();
                }
            }
            if(this.state.customCloseFunction)
            {
                if(this.state.defaultClose)
                    setTimeout(()=> this.state.customCloseFunction(), 400);
                else
                    this.state.customCloseFunction();
            }
            $(document).unbind(event)
        })
    }
}
