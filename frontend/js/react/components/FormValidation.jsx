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


		// const {renderContent, ...rest} = props;
		this.state = {
			submited: false,
			values: {},
			errors: {}
		};
		// console.log(this);
		// props.formActions.actionOnFormInitial(props.formId);
	}
	// componentDidMount(){
	// 	console.log(this.props);
	// }
	// componentWillMount(){
	// 	this.props.formActions.actionOnFormInitial(this.props.formId)
	// }
	//
	// shouldComponentUpdate(){
	// 	console.log(this.props.formActions[this.props.formId]);
	// 	if(!this.props.formActions[this.props.formId])
	// 		return false;
	//
	// 	return true;
	// }

	// componentDidMount(){
	// 	setTimeout(() => {
	// 		console.log(this.props);
	// 	}, 500)
	// }
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

	onSubmit(e)
	{
		e.preventDefault();
		let props = this.props;
		let state = this.state;

		state.submited = true;
		this.setState(state);
		for (let elem in state.errors) {
			if(state.errors[elem]) return false;
		}
		// setTimeout(()=>{console.log(props.formValidation)}, 500)
		props.handleSubmit(this.state.values);
	}

	render()
	{
		const input = {
			submited: this.state.submited,
			setValues: ::this.setValues,
			setErrors: ::this.setErrors,
		};
		const {renderContent, ...rest} = this.props;
		// console.log(this.props);
		// console.log(rest);
		return(
			// this.state.renderContent(this.state.data)
			// handleSubmit: this.onSubmit.bind(this)
			renderContent({...rest, input: input, handleSubmit: ::this.onSubmit})
		);
	}
}

	// formId: React.PropTypes.string.isRequired,
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


