/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import * as formActions from '../actions/formValidation';
// import * as inputActions from '../actions/formValidation/inputValidation';

export default class FormValidation extends React.Component{
	constructor(props)
	{
		super();

		this.state = {
			submited: false,
			values: {},
			errors: {},
			inputErrors: {},
			errorMessage: '',
			successMessage: ''
		};
	}

	setValues(value)
	{
		let state = this.state;

		state.values = {...state.values, ...value}
	}

	setErrors(value)
	{
		let state = this.state;

		state.errors = {...state.errors, ...value}
	}

	serverValidation(data)
	{
		const {error, message, ...rest} = data;
		let state = this.state;
		if(error){
			state.errorMessage = error;
			this.setState(state);
		}
		if(message){
			state.successMessage = message;
			this.setState(state);
		}
		if(JSON.stringify(rest) != '{}'){
			state.inputErrors = rest;
			this.setState(state);
		}
		// console.log(JSON.stringify(rest));
	}

	onSubmit(serverValidation, e)
	{
		e.preventDefault();
		let props = this.props;
		let state = this.state;

		state.submited = true;
		state.errorMessage = '';
		state.successMessage = '';
		this.setState(state);
		for (let elem in state.errors) {
			if(state.errors[elem]) return false;
		}
		props.handleSubmit(this.state.values, serverValidation || null);
	}

	render()
	{
		const state = this.state;
		const {renderContent, ...rest} = this.props;
		const onSubmit = this.props.serverValidation ? this.onSubmit.bind(this, ::this.serverValidation) : ::this.onSubmit;
		const input = {
			submited: state.submited,
			errors: state.inputErrors,
			setValues: ::this.setValues,
			setErrors: ::this.setErrors,
		};
		return(
			renderContent({...rest, input: input, handleSubmit: onSubmit, error: state.errorMessage, successMessage: state.successMessage})
		);
	}
}

FormValidation.propTypes = {
	renderContent: React.PropTypes.any.isRequired,
	handleSubmit: React.PropTypes.func,
};

// export default connect(state => ({
// 		formValidation: state.formValidation,
// 	}),
// 	dispatch => ({
// 		formActions: bindActionCreators(formActions, dispatch),
// 		inputActions: bindActionCreators(inputActions, dispatch)
// 	})
// )(FormValidation)


