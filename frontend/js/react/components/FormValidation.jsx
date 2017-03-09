/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';

export default class FormValidation extends React.Component
{
	constructor()
	{
		super();

		this.state = {
			submited: false,
			sending: false,
			// invalid: false,
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

		state.errors = {...state.errors, ...value};
	}

	serverValidation(data)
	{
		const {error, message, ...rest} = data;
		let state = this.state;

		state.submited = false;
		state.sending = false;
		if(error){
			// state.invalid = true;
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
			if(state.errors[elem]){
				// state.invalid = true;
				// this.setState(state);
				return false;
			}
		}
		// state.invalid = false;

		state.sending = true;
		this.setState(state);
		props.handleSubmit(this.state.values, serverValidation || e, (serverValidation) ? e : null);
	}

	render()
	{
		const state = this.state;
		const {renderContent, ...rest} = this.props;
		const onSubmit = this.props.serverValidation ? this.onSubmit.bind(this, ::this.serverValidation) : ::this.onSubmit;
		const input = {
			submited: state.submited,
			sending: state.sending,
			// invalid: state.invalid,
			errors: state.inputErrors,
			setValues: ::this.setValues,
			setErrors: ::this.setErrors,
		};
		// console.log(input.sending);
		return(
			renderContent({...rest, input: input, handleSubmit: onSubmit, error: state.errorMessage, successMessage: state.successMessage})
		);
	}
}

FormValidation.propTypes = {
	renderContent: React.PropTypes.any.isRequired,
	handleSubmit: React.PropTypes.func,
};


