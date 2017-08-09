/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';
import classnames from 'classnames';


export class EditHomeEvent extends React.Component
{
    /**@private*/ editDialogWrapper;


    constructor(props)
    {
        super(props);

        const {vars} = this.props.data;

        // Hack for MVC code access
        window.DialogEdit = this;

        this.state = {vars, isshow: false};
    }


    /**
     * initDialog from external
     * @public
     */
    openDialog(props)
    {
        const { vars, afterInit } = props;
        __DEV__&&console.log( 'props', props );

        this.setState({vars});

        afterInit && afterInit(null, this.editDialogWrapper, {TypeEvent: vars.data.TypeEvent});

        this._show(true);
    }


    render()
    {
        const {data: {some}} = this.props;
        const {vars: {type, title, data: eventData}, isshow} = this.state;


        return <div class="js-dialog" data-edit-dialog>
            <div ref={(val) => this.editDialogWrapper = val} class={classnames("modal", type)} data-js="wrapper">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form>
                            <div class="modal-header">
                                <button type="button" class="close" data-js="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" data-js="BtnClose">×</span>
                                </button>
                                <h4 class="modal-title">{title}</h4>
                            </div>
                            <div class="modal-body">

                                <div class="js-info-mess"></div>

                                {/*<!-- input states -->*/}
                                <div class="btn-group" data-js="radio-btn">
                                    <button type="button" class="btn btn-default" data-id="0" data-rval="1">Short</button>
                                    <input data-js="valueStor" type="hidden" name="TypeEvent" value={eventData.TypeEvent} />
                                    <button type="button" class="btn btn-default" data-id="2" data-rval="2">Full</button>
                                </div>
                                <br />
                                <br />

                                <div class="js-form-group form-group" data-js="EdFullname" data-style="{{data.FullNameShow}}">
                                    <label class="control-label" for="FullName"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Full name</label>
                                    <input class="js-ed-fullname form-control" type="text" name="FullName" data-js="FullName" value={eventData.FullName} maxLength="100" data-field-check="name:Full name,max:100,ifthere:2,ifhere:{empty},elemthere:[data-js=valueStor]" onChange={(ee) => this._onEditChange("FullName", ee)}/>
                                    <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                </div>

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="js-form-group form-group">
                                            <label class="control-label" for="HomeName"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Side 1 name</label>
                                            <input class="form-control" name="HomeName" type="text" value={eventData.HomeName} maxLength="50" data-field-check="name:Side 1 name,empty,max:50" onChange={(ee) => this._onEditChange("HomeName", ee)} />
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>

                                    <div class="col-sm-6">
                                        <div class="js-form-group form-group">
                                            <label class="control-label" for="AwayName"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Side 2 name</label>
                                            <input class="form-control" name="AwayName" type="text" value={eventData.AwayName} maxLength="50" data-field-check="name:Side 2 name,empty,max:50" onChange={(ee) => this._onEditChange("AwayName", ee)}/>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="js-form-group form-group">
                                            <label class="control-label" for="HomeHandicap"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Side 1 handicap</label>
                                            <input class="form-control" name="HomeHandicap" type="text" value={eventData.HomeHandicap} data-js="HomeHandicap" maxLength="6" data-field-check="name:Side 1 handicap,max:6,custom:handicap" onChange={(ee) => this._onEditChange("HomeHandicap", ee)}/>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>

                                    <div class="col-sm-6">
                                        <div class="js-form-group form-group">
                                            <label class="control-label" for="AwayHandicap"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Side 2 handicap</label>
                                            <input class="form-control" name="AwayHandicap" type="text" value={eventData.AwayHandicap} data-js="AwayHandicap" maxLength="6" data-field-check="name:Side 2 handicap,max:6,custom:handicap" onChange={(ee) => this._onEditChange("AwayHandicap", ee)}/>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-4">
                                        <div class="js-js-form-group form-group js-form-group form-group">
                                            <label class="control-label" for="StartDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Start date</label>
                                            <div class="input-group date">
                                                <div class="input-group-addon" data-js="ChkStartDate">
                                                    <input type="checkbox" name="isStartDate" checked={eventData.ChkStartDate}/>
                                                </div>
                                                <input class="form-control js-dt-start-date" data-js="StartDate" name="StartDate" type="text" value={eventData.StartDate} data-field-check="name:,custom:datechk" disabled={!eventData.ChkStartDate} onChange={(ee) => this._onEditChange("ChkStartDate", ee)}/>
                                            </div>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <div class="js-form-group form-group">
                                            <label class="control-label" for="EndDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Timezone</label>
                                            <div class="input-group date" style={{width: "100%"}}>
                                                <select name="TimeZone" class="cb-timezones" data-js-cb-timezones=""/>
                                            </div>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>

                                    <div class="col-sm-4">
                                        <div class="js-js-form-group form-group js-form-group form-group">
                                            <label class="control-label" for="EndDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> End date</label>
                                            <div class="input-group date">
                                                <div class="input-group-addon" data-js="ChkEndDate">
                                                    <input type="checkbox" name="isEndDate" checked={eventData.ChkEndDate}/>
                                                </div>
                                                <input class="form-control js-dt-end-date" data-js="EndDate" id="EndDate" name="EndDate" type="text" value={eventData.EndDate} disabled={!eventData.ChkEndDate} onChange={(ee) => this._onEditChange("ChkEndDate", ee)}/>
                                            </div>
                                            <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                        </div>
                                    </div>
                                </div>

                                {eventData.isUrlShow ?
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="js-form-group form-group">
                                                <label class="control-label" for="UrlExchange"><i class="js-error-icon fa fa-times-circle-o" style={{display: 'none'}}/> Url</label>
                                                <input class="form-control" data-js="Url" name="UrlExchange" type="text" value={eventData.UrlExchange} maxLength="100" data-field-check="name:Url,empty,max:100" onChange={(ee) => this._onEditChange("UrlExchange", ee)}/>
                                                <span class="js-message help-block" style={{display: 'none'}}>{/*<!--Err mess-->*/}</span>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <input data-js="Url" name="UrlExchange" type="hidden" value={eventData.UrlExchange} onChange={(ee) => this._onEditChange("UrlExchange", ee)}/>
                                }

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default pull-left" data-js="cancel" data-dismiss="modal">Cancel</button>
                                <div class="loading-inline" data-js="loading"/>
                                <button type="button" class="btn btn-primary" data-js="ok">Save</button>
                            </div>
                        </form>
                    </div>
                    {/*<!-- /.modal-content -->*/}
                </div>
                {/*<!-- /.modal-dialog -->*/}
            </div>
        </div>;
    }


    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    /**@private*/ _show(isshow)
    {
        // this.setState({isshow});
        if (isshow)
            $(this.editDialogWrapper).fadeIn(400);
        else
            $(this.editDialogWrapper).fadeOut(200);
    }


    /**@private*/ _onEditChange(key, ee)
    {
        const { vars } = this.state;
        vars.data[key] = ee.target.value;
        this.setState({...vars, })
    }
}