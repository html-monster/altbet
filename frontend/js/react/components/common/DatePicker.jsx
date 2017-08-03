/**
 * Created by Vlasakh on 25.04.2017.
 */

import React from "react";


export class DatePicker extends React.PureComponent
{
    textInput;

/*
	constructor(pp)
	{
		super(pp);

		0||console.log( 'this.props.afterChange', this.props.afterChange );
	}
*/

    componentDidMount()
    {
		const { exdata:{afterChange}, value } = this.props;

		let input = $( this.textInput );
		input.keyup(() => false);
		input.keydown(() => false);
		input.keypress(() => false);
		input.datepicker({
			yearRange: "1901:c",
			maxDate: "0",
			minDate: new Date(1, 1 - 1, 1),
			changeMonth: true,
			changeYear: true,
			showAnim: 'slideDown',
			onClose: (text, dtObj) => {afterChange(text, `${dtObj.selectedYear}-${dtObj.currentMonth+1}-${dtObj.selectedDay}`)},
		});


        // init first value
        let $dt = moment(value);
        // __DEV__&&console.warn( 'value', value, $dt, $dt.getFullYear);
        // __DEV__&&console.warn( 'value ffff', $dt.format("Y-MM-DD") );
		afterChange && afterChange(value, $dt.format("Y-MM-DD"));
    }



    render()
    {
        const { id, name, className, exdata, ...input } = this.props;

        return <input ref={(input) => { this.textInput = input; }} type="text" name={name} className={className} id={id} {...input}/>;
    }
}