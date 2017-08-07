/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';


export class NewHomeEvent extends React.Component
{
    /**@private*/ tablTeam;
/*
    constructor(props)
    {
        super(props);
    }
*/


    render()
    {
        const {data: {CategoryUrl}} = this.props.data;


        return <div class="box box-success collapsed-box">
            <div class="box-header with-border">
                <h3 class="box-title">Add new exchange</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse">
                        <i class="fa fa-plus"/>
                    </button>
                </div>
                {/*<!-- /.box-tools -->*/}
            </div>
            {/*<!-- /.box-header -->*/}
            <div class="box-body">
                <div id="addExchange">
                    <br />
                    <form action="/Home/CreateExchange" class="F1addExch">
                        <input type="hidden" name="Category" defaultValue={CategoryUrl}/>
                        <div class="js-info-mess"></div>

                        {/*<!-- input states -->*/}
                        <div class="btn-group" data-js="radio-btn">
                            <button type="button" class="btn btn-default" data-rval="1">Short</button>
                            <input data-js="valueStor" type="hidden" value="1" name="TypeEvent" />
                            <button type="button" class="btn btn-default" data-rval="2">Full</button>
                        </div>
                        <br/>
                        <br/>

                        <div class="js-form-group form-group" data-js="EdFullname" style={{display: "none"}}>
                            <label class="control-label" for="FullName"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Full name</label>
                            <input type="text" className="js-ed-fullname form-control" name="FullName" data-js="FullName" maxLength="100"  data-field-check="name:Full name,max:100,ifthere:2,ifhere:{empty},elemthere:[data-js=valueStor]"/>
                            <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="HomeName"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side1 name</label>
                                    <input type="text" className="form-control" name="HomeName" data-js="EdHomeName" maxLength="50"  data-field-check="name:Side 1 name,empty,max:50"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="AwayName"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side2 name</label>
                                    <input type="text" className="form-control" name="AwayName" data-js="AwayName" maxLength="50"  data-field-check="name:Side 2 name,empty,max:50"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="HomeAlias"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side1 alias</label>
                                    <input type="text" className="form-control" name="HomeAlias" data-js="HomeAlias" maxLength="20"  data-field-check="name:Side 1 alias,empty,max:20"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="AwayAlias"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side2 alias</label>
                                    <input type="text" className="form-control" name="AwayAlias" data-js="AwayAlias" maxLength="20"  data-field-check="name:Side 2 alias,empty,max:20"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="HomeHandicap"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side1 handicap</label>
                                    <input type="text" className="form-control" name="HomeHandicap" data-js="HomeHandicap" maxLength="6"  data-field-check="name:Side 1 handicap,max:6,custom:handicap"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="AwayHandicap"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Side2 handicap</label>
                                    <input type="text" className="form-control" name="AwayHandicap" data-js="AwayHandicap" maxLength="6"  data-field-check="name:Side 2 handicap,max:6,custom:handicap"/>
                                   <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-4">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="StartDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Start date</label>
                                    <div class="input-group date">
                                        <div class="input-group-addon" data-js="ChkStartDate">
                                            <input type="checkbox" name="isStartDate"/>
                                        </div>
                                        <input type="text" className="pull-right form-control js-dt-start-date" name="StartDate" data-js="StartDate" disabled={true}   data-field-check="name:,custom:datechk"/>
                                    </div>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="EndDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Timezone</label>
                                    <div class="input-group date" style={{width: "100%"}}>
                                        <select name="TimeZone" class="cb-timezones" data-js-cb-timezones="">
                                        </select>
                                    </div>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="EndDate"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> End date</label>
                                    <div class="input-group date">
                                        <div class="input-group-addon" data-js="ChkEndDate">
                                            <input type="checkbox" name="isEndDate" />
                                        </div>
                                        <input type="text" className="pull-right form-control js-dt-end-date" name="EndDate" data-js="EndDate" disabled={true}   data-field-check="name:,custom:datechk"/>
                                    </div>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="js-form-group form-group">
                                    <label class="control-label" for="UrlExchange"><i class="js-error-icon fa fa-times-circle-o" style={{display: "none"}}/> Url</label>
                                    <input type="text" className="form-control" name="UrlExchange" data-js="Url" maxLength={100}   data-field-check="name:Url,empty,max:100"/>
                                    <span class="js-message help-block" style={{display: "none"}}>{/*<!--Err mess-->*/}</span>
                                </div>
                            </div>
                        </div>

                        <button type="button" data-js="btn-create" class="btn btn-info">Create</button><div class="loading-inline" data-js="loading"/>
                    </form>
                </div>
            </div>
            {/*<!-- /.box-body -->*/}
        </div>;
    }


    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    // /**@private*/ _onPPGChange({player, team, type}, num, p1)
    /**@private*/ _onPPGChange(props, num, p1)
    {
        // if (num) this.props.actions.actionPPGValues({player, team, type, num});
        if (num) this.props.data.actions.actionPPGValues({...props, num});
    }
}