/**
 * Created by tianna on 08.02.17.
 */

import React from 'react';

import {CheckBox} from '../common/CheckBox';


export default class Preferences extends React.PureComponent
{
    /**
     * @private
     */
    _onChkChange(opt, ee)
    {
        // 0||console.log( 'ee', ee.target, ee.target.dataset, this.state );
        // 0||console.log( 'this.state.filters[ee.target.dataset.filter]', this.state.filters[ee.target.dataset.filter], this.state );
        this.state[opt] = !this.state[opt];
        this.setState({...this.state});
    }



    render()
    {
        const {IsMode, IsBettor, IsTrade} = appData.pageAccountData.Account;
        const {header, active} = this.props.data;

        return <div className={"tab_item preferences " + (active ? "active" : "")}>
                <h2>Preferences</h2>
                {header}
                <div className="section">
                    <h3 className="section_user">General</h3>
                    <hr/>
                    <ul className="preferences_list color_scheme_switch">
                        <li>
                            <label className="checkbox change-color">
                                <strong>Theme color:</strong>
                                <button className="dark color_pick" title="dark theme">{}</button>&nbsp;
                                <button className="light color_pick" title="light theme">{}</button>
                            </label>
                        </li>
                    </ul>
                    <form action={appData.pageAccountPreferencesUrl} id="form0" method="post" noValidate="novalidate"
                            data-ajax="true"
                            data-ajax-failure="ajaxPreferencesClass.onErrorAjax"
                            data-ajax-success="ajaxPreferencesClass.onSuccessAjax"
                            data-ajax-url={appData.pageAccountPreferencesUrl}>
                        <ul className="preferences_list">
                            <li>
                                {/*<input id="IsMode" type="checkbox" checked={this.state.IsMode} onChange={this._onChkChange.bind(this, "IsMode")}/>*/}
                                {/*@Html.CheckBoxFor(m=>m.IsMode, new { @checked = Model.IsMode })*/}
                                <CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsMode", checked: IsMode}}>
                                    <strong>Expert mode on:</strong>
                                </CheckBox>
                            </li>
                            <li>
                                <CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsBettor", checked: IsBettor}}>
                                    <strong>Active bettor on:</strong>
                                </CheckBox>
                            </li>
                            <li>
                                <CheckBox data={{className: "checkbox checkbox_horizontal", name: "IsTrade", checked: IsTrade}}>
                                    <strong>Auto trade on:</strong>
                                </CheckBox>
                            </li>
                        </ul>
                        <div className="input_animate input--yoshiko">
                            <input type="submit" value="Submit" className="btn wave"/>
                            <span className="answer_message">{}</span>
                        </div>
                    </form>
                </div>
            </div>;
    }
}