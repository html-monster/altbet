/**
 * Created by Vlasakh on 08.02.2017.
 */

import React from 'react';


export class CheckBox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { ischecked: this.props.data.checked,}
    }


    /**
     * @private
     */
    _onChkChange()
    {
        this.state.ischecked = !this.state.ischecked;
        this.setState({...this.state});
    }



    render()
    {
        var {className, name} = this.props.data;

        return <label className={className}>
                <input type="checkbox" checked={this.state.ischecked} onChange={::this._onChkChange}/>
                <input name={name} type="hidden" value={this.state.ischecked ? "true" : "false"}/>
                <span></span>
                {this.props.children}
            </label>;
    }
}