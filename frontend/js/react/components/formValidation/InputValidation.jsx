/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../actions/formValidation';

class InputValidation extends React.Component{
	constructor(props)
	{
		super();

		// const {renderContent, actions, ...rest} = props;
		this.state = {
			// renderContent: renderContent,
			// actions: actions,
			// data: rest
			meta: {
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
		if(props.name) props.actions.actionOnInitialValues(props.formId, {[props.name]: props.initialValue || props.value});
		// console.log({[props.name]: props.initialValue || props.value});
		// console.log(props.label, props.initialValue || props.value);
	}

	// componentDidMount(){
	// 	this.validate(this.props.initialValue || this.props.value);
	// }
	// componentWillMount()
	// {
		// let state = this.state;
		// let meta = {
		// 	error: '',
		// 	dirty: false, // true когда поле было измененно или получило фокус или при submit
		// 	touched: false // true если поле потеряло фокус
		// };
		//
		// Object.assign(state.data, {
		// 	meta: meta,
		// 	onFocus: ::this.onFocus,
		// 	onBlur: ::this.onBlur,
		// 	onChange: ::this.onChange,
		// });
		// if(!state.data.defaultValue){
		// 	Object.assign(state.data, {
		// 		onChange: ::this.onChange,
		// 	});
		// }
	// }

	shouldComponentUpdate(nextProps){
		// console.log(this.props.label, this.state.value);
		// console.log(nextProps.label, nextProps.value);
		if(nextProps.value) this.state.value = nextProps.value;
		if(nextProps.meta.submit) {
			this.validate(this.state.value);


		}

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

	onChange(event)
	{
		let state = this.state;
		const props = this.props;

		state.meta.dirty = true;
		state.value = event.target.value;
		this.validate(this.props, state.value);
		this.setState(state);
		console.log(props);
		if(props.name) props.actions.actionOnInputChange(props.formId, {[props.name]: state.value});
	}

	validate(props, value, setState)
	{
		if(props.validate) {
			let state = this.state;
			let error = props.validate(value);
			// let invalid = state.meta.invalid;

			state.meta.error = error;
			// state.meta.dirty = true;

			if(error) state.meta.invalid = true;
			else state.meta.invalid = false;

			// if(state.meta.invalid) {
			props.actions.actionOnInputValidation(props.formId, state.meta.invalid);
			console.log(state.meta.invalid);
			// }
		// if(setState) this.setState(state)
		}
	}

	// formSubmit()
	// {
	// 	console.log('submit');
	// }

	render()
	{
		const {renderContent, initialValue, validate, actions: {...actions}, meta: {...metaProps}, ...rest} = this.props;
		const {meta: {...metaState}, ...state} = this.state;
		// const {value, ...state} = this.state;
		// console.log(metaState);
		// console.log({meta: {...metaProps, ...metaState}, ...rest, ...state});
		// console.log({...actions, ...rest});
		// console.log(this.props);
		// console.log(this.state);
		return(
			renderContent({meta: {...metaProps, ...metaState}, ...rest, ...state})
			// renderContent({...actions, ...rest})
		);
	}
}

InputValidation.propTypes = {
	renderContent: React.PropTypes.any.isRequired,
	validate: React.PropTypes.func,
};

export default connect(
	state => ({
		meta: state.inputValidation
	}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	})
)(InputValidation)

