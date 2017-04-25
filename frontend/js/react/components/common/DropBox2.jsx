/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react';
import Select from 'react-select';


/**
 * @param className - class name of the container
 */
export class DropBox2 extends React.Component
{
    valInput; // dropdown value input


    constructor(props)
    {
        super(props);

        const { clearable, searchable, disabled, value } = this.props;
        this.state = {
			disabled: disabled,
			searchable: searchable,
			selectValue: value,
			clearable: clearable,
		};

    }


    componentDidMount()
    {
        const { value, items, afterChange } = this.props;

        afterChange && afterChange( value, items.filter((val) => val['value'] === value) );
    }


    render()
    {
        const { name, items, placeholder, afterChange } = this.props;

        return (
            <div className="h-dropdown2">
                <Select placeholder={placeholder} options={items} /*autofocus*/ simpleValue clearable={this.state.clearable} disabled={this.state.disabled} value={this.state.selectValue} searchable={this.state.searchable} onChange={afterChange ? this._onChange.bind(this, afterChange, items) : null}/>
                <input type="hidden" name={name}  value={this.state.selectValue || ""} /*ref={(input) => { this.valInput = input; }}*//>
            </div>
        );
    }


    /**
     * @private
     */
    _onChange(afterChange, items, newValue)
    {
        afterChange( newValue, items.filter((val) => val['value'] == newValue) );

        this.setState({ selectValue: newValue });
    }
}