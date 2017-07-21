/**
 * Created by Vlasakh on 07.07.2017.
 */

import React from 'react' ;

import {Common} from "common/Common.ts";
import {InfoMessages} from "common/InfoMessages.ts";


export class NewCategory extends React.Component
{
    /**@private*/ formNode;
    /**@private*/ inputUrl;
    /**@private*/ inputName;
/*
    constructor(props)
    {
        super(props);
    }
*/

    /**
     * Focus on input
     * @public
     */
    focus(index)
    {
        switch( index )
        {
            case 1 : $(this.inputName).focus();
        }
    }


    render()
    {
        const { afterCreate } = this.props;


        return (
            <div class="form-horizontal">
                <form ref={(val) => this.formNode = val}>
                    <div class="js-form-group form-group" /*has-error*/>
                        <label class="col-sm-2 control-label" for="Name"><i class="js-error-icon error-icon fa fa-times-circle-o"/> Name</label>
                        <div class="col-sm-10">
                            <input ref={(itm) => this.inputName = itm} type="text" className="js-ed-name form-control" name="Name" onBlur={::this._onNameBlur}/>
                        </div>
                        <span class="js-message help-block col-sm-10 col-sm-push-2">{/*<!--Err mess-->*/}</span>
                    </div>

                    <div class="js-form-group form-group">
                        <label class="col-sm-2 control-label" for="Url"><i class="js-error-icon error-icon fa fa-times-circle-o"/> Url</label>
                        <div class="col-sm-10">
                            <input ref={(itm) => this.inputUrl = itm} type="text" className="js-ed-url form-control" name="Url"/>
                        </div>
                        <span class="js-message help-block col-sm-10 col-sm-push-2">{/*<!--Err mess-->*/}</span>
                    </div>
                </form>

{/*
                    <div class="js-form-group form-group">
                        <label class="col-sm-2 control-label" for="Icon"><i class="js-error-icon error-icon fa fa-times-circle-o"/> Icon</label>
                        <div class="col-sm-10">
                            <select class="js-cb-icons cb-icons" name="Icon" style={{width: '200px'}}></select>
                        </div>
                        <span class="js-message help-block col-sm-10 col-sm-push-2"><!--Err mess--></span>
                    </div>
*/}

                    <div class="row">
                        <div class="col-sm-10 col-sm-push-2">
                            <input type="button" class="js-btn-save btn btn-info" value="Create" onClick={this._onOkClick.bind(this)}/> <button class="js-btn-cancel btn btn-default" type="button" onClick={this._onCancelClick.bind(this, afterCreate)}>Cancel</button>
                        </div>
                    </div>
            </div>
        );
    }


    /**@private*/ _onOkClick()
    {
        const { submitAction, afterCreate, data: {ParentId} } = this.props;
        let messageError, elm;

        if( $(elm = this.inputName).val() === '' )
        {
            messageError = "Please fill the category name";
        }
        else if( $(elm = this.inputUrl).val() === '' )
        {
            messageError = "Please fill the category url";
        } // endif


        if( messageError )
        {
            (new InfoMessages).show({
                title: 'Error create category',
                message: messageError,
                color: InfoMessages.WARN,
            });

            $(elm).focus();
        }
        else
        {
            submitAction && submitAction({callback: afterCreate, ParentId, formData: $(this.formNode).serializeArray()});
        } // endif

    }


    /**@private*/ _onCancelClick(callback)
    {
        callback && callback();
    }


    /**@private*/ _onNameBlur(ee)
    {
        $(this.inputUrl).val(Common.createUrlAlias($(ee.target).val()));
    }
}