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
		// this.props.dateFormat

		let input = $( this.textInput );
		input.keyup(() => false);
		input.keydown(() => false);
		input.keypress(() => false);
		input.datepicker({
			yearRange: "1901:c",
			dateFormat: "d M yy",
			maxDate: "0",
			minDate: new Date(1, 1 - 1, 1),
			changeMonth: true,
			changeYear: true,
			showAnim: 'slideDown',
			onClose: (text, dtObj) => {this.props.exdata.afterChange(text, `${dtObj.selectedYear}-${dtObj.currentMonth}-${dtObj.selectedDay}`)},
		});
    }



    render()
    {
        const { id, name, className, exdata, ...input } = this.props;

        return <input ref={(input) => { this.textInput = input; }} type="text" name={name} className={className} id={id} {...input}/>;
    }
}