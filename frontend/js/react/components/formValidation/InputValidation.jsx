/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import * as actions from '../../actions/formValidation';

export default class InputValidation extends React.Component
{
	constructor(props)
	{
		super();

		this.state = {
			meta: {
				inputId: 'input' + (new Date).getTime(),
				error: '',
				dirty: false, // true когда поле было измененно или получило фокус или при submit
				touched: false, // true если поле потеряло фокус
				invalid: false
			},
			// onFocus: ::this.onFocus,
			onBlur: ::this.onBlur,
			onChange: ::this.onChange,
			value: props.initialValue || props.value || ''
		};
		this.validate(props, this.state.value);
	}


	shouldComponentUpdate(nextProps)
	{
		let state = this.state;
		const props = this.props;
		const error = nextProps.input.errors[props.name];
		// console.log(nextProps.value);
		// console.log(state.value);
		if(nextProps.value != undefined){

			if(nextProps.value != state.value && nextProps.validate)
				this.onChangeProgrammatically(nextProps.value);

			state.value = nextProps.value;
			if(nextProps.name) nextProps.input.setValues({[nextProps.name]: nextProps.value || ''});
		}

		if(props.validate && nextProps.input.submited) {
			this.validate(state.value);
			state.meta.dirty = true;
		}
		if(props.name && error){
			state.meta.error = error;
			props.input.setErrors({[state.meta.inputId]: error});
		}
		// console.log(nextProps.input.errors);
		return true;
	}

	// onFocus()
	// {
	// 	let state = this.state;
	//
	// 	state.meta.dirty = true;
	// 	this.setState(state)
	// }

	onBlur()
	{
		let state = this.state;

		state.meta.dirty = true;
		state.meta.touched = true;
		this.setState(state)
	}

	onChangeProgrammatically(value)
	{
		let state = this.state;
		// const props = this.props;

		state.meta.dirty = true;

		this.validate(this.props, value);
	}

	onChange(event)
	{
		let state = this.state;
		const props = this.props;

		state.meta.dirty = true;
		state.value = event.target.value;

		this.validate(this.props, state.value);
		this.setState(state);
		if(props.name) props.input.setValues({[props.name]: state.value});
	}

	validate(props, value)
	{
		if(props.name) props.input.setValues({[props.name]: value});

		if(props.validate) {
			let state = this.state;

			if(typeof props.validate == 'function')
				check(props.validate);
			else
				props.validate.some((item) => !!check(item));

			function check(validate) {
				const error = validate(value);
				let errors = props.input.errors;
				delete errors[props.name];

				state.meta.error = error;

				if(error) state.meta.invalid = true;
				else state.meta.invalid = false;

				props.input.setErrors({[state.meta.inputId]: error}, errors);

				return error;
			}
		}
	}

	render()
	{
		const {renderContent, input, initialValue, validate, actions: {...actions}, meta: {...metaProps}, ...rest} = this.props;
		const {meta: {...metaState}, ...state} = this.state;
		// const {value, ...state} = this.state;
		// console.log(rest);
		// console.log({meta: {...metaProps, ...metaState}, ...rest, ...state});
		// console.log({...actions, ...rest});
		// console.log(this.props);
		// console.log(this.state);

		{/*return <div>{this.props.children}</div>;*/}
		return (renderContent({meta: {onCustomChange: ::this.onChangeProgrammatically, ...metaProps, ...metaState}, ...rest, ...state}));
	}
}

	// validate: React.PropTypes.func,
// InputValidation.propTypes = {
// 	renderContent: React.PropTypes.any.isRequired,
// };

// export default connect(
// 	state => ({
// 		// meta: state.inputValidation
// 	}),
// 	dispatch => ({
// 		actions: bindActionCreators(actions, dispatch),
// 	})
// )(InputValidation)

