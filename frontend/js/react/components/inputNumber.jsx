/**
 * Created by Htmlbook on 14.02.2017.
 */

import React from 'react';

export default class InputNumber extends React.Component{
	constructor(props)
	{
		super();

		this.state = {
			value: props.value
		};
	}

	componentDidMount()
	{
		$(this.refs.input).keypress(::this.onKeyPress);
	}

	onKeyPress(event){
		const props = this.props;
		const code = event.which || event.charCode || event.keyCode;

		if(props.hard){
			if(props.inputValidate == 'integer'){
				if(code != 13){
					if(code == 48 && event.target.selectionStart == 0) return false;

					if(!(code >= 48 && code <= 57 || code >= 8 && code <= 9
						|| code == 27 || code == 37 || code == 39)) return false;
				}
			}
			else{
				if(code != 13){
					let selection = event.target.selectionStart;
					// console.log(event.target.value);
					// console.log(code >= 48 && code <= 57 && ((event.target.value == '' && /^[0]/gi.test(event.target.value))
					// 	&& !/^[0][.]/gi.test(event.target.value)));
					if(props.inputValidate == 'price' && !/^[$][0][.][0-9]{0,1}/gi.test(event.target.value)
						&& selection > 2) return false;
					if(code >= 48 && code <= 57 && ((event.target.value == '' && /^[0]/gi.test(event.target.value))
						&& !/^[0][.]/gi.test(event.target.value))){
						// console.log(2);
						return false;
					}
					if(code == 46 && /[.]/gi.test(event.target.value)) return false;
					if(/[.][0-9]{2}/gi.test(event.target.value) && selection > event.target.value.length - 3) return false;
					if(code == 46 && event.target.value == '') return false;

					if(!(code == 46 || code >= 48 && code <= 57 || code >= 8 && code <= 9
						|| code == 27 || code == 37 || code == 39)) return false;

				}
			}
		}
	}

	onInputChange(event)
	{
		if(this.props.onChange) this.props.onChange(event);
	}

	shouldComponentUpdate(nextProps)
	{
		const { value, inputValidate } = this.props;

		// if(nextProps.inputValidate == 'integer')
		if (nextProps.inputValidate == 'price' && !/^[0][.][0-9]{0,1}/gi.test(nextProps.value)) {
			if(!/^[0][.][0-9]{0,1}/gi.test(nextProps.value)) return true;
			// console.log(value);
			// console.log(nextProps.value);
			this.state.value = value;
			return true;
		}
		else if (nextProps.inputValidate == 'integer' && /[.]|^[0][0-9]]/gi.test(nextProps.value)) {
			if(/[.]|^[0][0-9]]/gi.test(nextProps.value)) return true;
			// console.log(value);
			// console.log(nextProps.value);
			this.state.value = value;
			return true;
		}
		else if((/[.][0-9]{3}|[.]{2}|[0-9]+[.][0-9]+[.]|^[0][0-9]|[^0-9.]+/gi.test(nextProps.value)
			|| nextProps.value == '.') && nextProps.value != ''){
			if(/[.][0-9]{3}|[.]{2}|[0-9]+[.][0-9]+[.]|^[0][0-9]|[^0-9.]+/gi.test(nextProps.value)) return true;
			this.state.value = value;
			return true;
		}
		this.state.value = nextProps.value;

		// if(nextProps.inputValidate == 'Sum'){
		// 	console.log(value);
		// 	console.log(nextProps.value);
		// }
		return true;
	}

	onContextMenu(event)
	{
		const { onContextMenu } = this.props;
		if(event.button == 2) event.preventDefault();
		if(onContextMenu) onContextMenu()
	}

	render()
	{
		const { onContextMenu, value, onChange, inputValidate, hard, label, ...rest } = this.props;
		return <input type="tel" ref={'input'} onChange={::this.onInputChange} onPaste={(event) => {event.preventDefault()}}
					  onContextMenu={::this.onContextMenu}
					  value={label && this.state.value ? '$' + this.state.value: this.state.value} {...rest} />
	}
}