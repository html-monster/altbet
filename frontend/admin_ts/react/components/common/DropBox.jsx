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
    constructor(props)
    {
        super(props);


        const { value, } = this.props;
        this.state = {
			value,
		};
    }


/*
    shouldComponentUpdate(nextProp)
    {
        __DEV__&&console.log( 'nextProp', nextProp.value );
        const { value, items } = nextProp;

        if( JSON.stringify(items) !== JSON.stringify(this.state.items) )
        {
            this.setState({...this.state, value, items});
        } // endif

        return true;
    }
*/


    render()
    {
        const { name, afterChange, clearable, searchable, disabled, items } = this.props;
        const { value, } = this.state;

        return <Select name={name} options={items} /*autofocus*/ simpleValue clearable={clearable} disabled={disabled} value={value} searchable={searchable} onChange={(newValue) => { afterChange( newValue ); this.setState({ value: newValue }); }}/>;
    }
}