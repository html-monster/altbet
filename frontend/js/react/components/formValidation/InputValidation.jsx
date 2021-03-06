/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import * as actions from '../../actions/formValidation';

/**
 * @param renderContent - function that return Dom object
 * @param validate: function || arrayOf(function) - validation function that returns string. Example: const emptyValidation = (value) => !value ? 'Required' : ''
 * @param input - params necessary for inputs, it is created by FormValidation
 */
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
		this.validate(props, this.state.value, false);
	}


	shouldComponentUpdate(nextProps)
	{
		let state = this.state;
		const props = this.props;
		const error = nextProps.input.errors[props.name];
		// __DEV__&&console.debug('value:', value);
		// console.log(nextProps.value);
		if(nextProps.value !== undefined){

			if(nextProps.value !== state.value && nextProps.validate)
				this.onChangeProgrammatically(state.value).bind(this);

			state.value = nextProps.value;
			if(nextProps.name) nextProps.input.setValues({[nextProps.name]: nextProps.value || ''});
		}

		if(props.validate && nextProps.input.submited)
		{
			state.meta.dirty = true;
		}

		if(props.name && error){
			state.meta.error = error;
			props.input.setErrors({[state.meta.inputId]: error});
		}

		this.validate(nextProps, state.value, false);
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
		// console.log('value:', value);
		state.meta.dirty = true;
		state.value = value;

		this.validate(this.props, value, true);
		this.setState(state);
		// console.log('state:', state);
	}

	onChange(event)
	{
		let state = this.state;
		const props = this.props;

		state.meta.dirty = true;
		state.value = event.target.value;

		this.validate(this.props, state.value, true);
		this.setState(state);
		if(props.name) props.input.setValues({[props.name]: state.value});
	}

	validate(props, value, updateForm)
	{
		if(props.name) props.input.setValues({[props.name]: value});

		if(props.validate) {
			let state = this.state;

			if(typeof props.validate === 'function')
			{
				check(props.validate);
			}
			else if(defaultMethods.getType(props.validate) === 'Array' && props.validate.length )
			{
				props.validate.some((item) => !!check(item));
			}
			else
			{
				state.meta.error = '';
				state.meta.invalid = true;
				props.input.setErrors({[state.meta.inputId]: ''}, updateForm);
			}

			function check(validate) {
				const error = validate(value);
				let errors = props.input.errors;

				delete errors[props.name];

				state.meta.error = error;

				if(error) state.meta.invalid = true;
				else state.meta.invalid = false;

				// console.log('error:', error);
				props.input.setErrors({[state.meta.inputId]: error}, updateForm);
				// console.log('error:', error);
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

//	validate: React.PropTypes.func,
if(__DEV__)
{
	InputValidation.propTypes = {
		renderContent: PropTypes.func.isRequired,
		validate: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.func), PropTypes.func]),
		input: PropTypes.object.isRequired,
	};
}

// export default connect(
// 	state => ({
// 		// meta: state.inputValidation
// 	}),
// 	dispatch => ({
// 		actions: bindActionCreators(actions, dispatch),
// 	})
// )(InputValidation)

