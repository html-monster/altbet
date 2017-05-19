/**
 * Created by Vlasakh on 08.02.2017.
 */

import React from 'react';


export class CheckBox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { ischecked: this.props.data.checked,};

        this.name = props.data.name;
    }

	/**
     * will update checkbox if checkbox alwaysUpdate parameter true
	 * @param nextProps
	 */
	componentWillUpdate(nextProps)
    {
        if(nextProps.data.alwaysUpdate && this.state.ischecked !== nextProps.data.checked) this.state.ischecked = nextProps.data.checked;
    }


    render()
    {
        const {className, name} = this.props.data;

        return <label className={className}>
                <input type="checkbox" checked={this.state.ischecked} onChange={::this._onChkChange}/>
                <input name={name} type="hidden" value={this.state.ischecked}/>
                <span>{}</span>
                {this.props.children}
            </label>;
    }

	/**
	 * @private
	 */
	_onChkChange(event)
    {
        if(this.props.onChange) this.props.onChange(event);
        this.state.ischecked = !this.state.ischecked;
        this.setState({...this.state});
    }
}