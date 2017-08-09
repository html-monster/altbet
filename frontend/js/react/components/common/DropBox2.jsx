/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import classnames from 'classnames';


/**
 * @param className - class name of the container
 * @param name - name of hidden field (for the forms)
 * @param items: object[] - list item data, necessary parameter is: value, label. Example: [{label: "United State", value: "US"}, {label: "Canada", value: "CA"}, ]
 * @param placeholder - select placeholder
 * @param hint - onHover tip
 * @param value - initial value
 * @param clearable - create button, that clear select value
 * @param searchable - gives able to enter the value in input
 * @param afterChange - callback for after dropbox item click
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
			searchable: searchable || false,
			selectValue: value,
			clearable: clearable || false,
		};

    }

	componentWillReceiveProps(nextProps)
	{
        if( nextProps.value !== this.props.value )
        {
		    this.setState({ selectValue: nextProps.value })
        } // endif
		// this.state.selectValue = nextProps.value;
	}

/*
    componentDidMount()
    {
        const { value, items, afterChange } = this.props;

        // afterChange && afterChange( value, items.filter((val) => val['value'] === value) );
    }
*/


    render()
    {
        const { name, className, items, placeholder, hint, afterChange } = this.props;

        return (
            <div className={classnames('h-dropdown2', className)} title={hint}>
                <Select placeholder={placeholder} options={items} /*autofocus*/ simpleValue clearable={this.state.clearable}
                        disabled={this.state.disabled} value={this.state.selectValue} searchable={this.state.searchable}
                        onChange={(newValue) => this._onChange({afterChange, items, newValue})}/>
                <input type="hidden" name={name}  value={this.state.selectValue || ""} /*ref={(input) => { this.valInput = input; }}*//>
            </div>
        );
    }


    /**
     * @private
     */
    _onChange(props)
    {
    	const { afterChange, items, newValue } = props;

		afterChange && afterChange( newValue, items.filter((val) => val['value'] === newValue) );

        this.setState({ selectValue: newValue });
    }
}


//	validate: React.PropTypes.func,
if(__DEV__)
{
	DropBox2.propTypes = {
		items: PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})).isRequired,
		className: PropTypes.string,
		name: PropTypes.string,
		placeholder: PropTypes.string,
		hint: PropTypes.string,
		value: PropTypes.string,
		clearable: PropTypes.bool,
		searchable: PropTypes.bool,
		afterChange: PropTypes.func,
	};
}







