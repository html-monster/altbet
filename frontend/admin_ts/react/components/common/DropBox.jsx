/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react';
import Select from 'react-select';


/**
 * @param className - class name of the container
 */
export class DropBox extends React.Component
{
/*
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
*/


    render()
    {
        const { name, items, afterChange, clearable, searchable, disabled, value } = this.props;
        // const { disabled, searchable, selectValue, clearable } = this.state;


        return <Select name={name} options={items} /*autofocus*/ simpleValue clearable={clearable} disabled={disabled} value={value} searchable={searchable} onChange={(newValue) => { afterChange( newValue ); this.setState({ selectValue: newValue }); }}/>;
    }
}