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


    render()
    {
        const { name, items, placeholder, afterChange } = this.props;

        return <Select placeholder={placeholder} name={name} options={items} /*autofocus*/ simpleValue clearable={this.state.clearable} disabled={this.state.disabled} value={this.state.selectValue} searchable={this.state.searchable} onChange={(newValue) => { afterChange( newValue ); this.setState({ selectValue: newValue }); }}/>;
    }
}