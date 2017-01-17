/**
 * Created by Htmlbook on 13.01.2017.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as formActions from '../actions/formValidation';
import * as inputActions from '../actions/formValidation/inputValidation';

class FormValidation extends React.Component{
	constructor(props)
	{
		super();

		// const {renderContent, ...rest} = props;
		// this.state = {
		// 	renderContent: renderContent,
		// 	data: rest
		// };
		// console.log(this);
	}
	// componentDidMount(){
	// 	console.log(this.props);
	// }

	onSubmit(e)
	{
		e.preventDefault();
		let props = this.props;
		// this.props.formActions.actionOnFormSubmit(false);
		// this.props.inputActions.actionOnFormSubmit();
		console.log(props);
		// setTimeout(()=>{console.log(props.formValidation)}, 500)
		props.handleSubmit(props[props.formId].values);
	}

	render()
	{
		const {renderContent, ...rest} = this.props;
		console.log(rest);
		return(
			// this.state.renderContent(this.state.data)
			renderContent({...rest, handleSubmit: this.onSubmit.bind(this)})
		);
	}
}

FormValidation.propTypes = {
	formId: React.PropTypes.string.isRequired,
	renderContent: React.PropTypes.any.isRequired,
	handleSubmit: React.PropTypes.func,
};

export default connect(state => ({
		formValidation: state.formValidation,
	}),
	dispatch => ({
		formActions: bindActionCreators(formActions, dispatch),
		inputActions: bindActionCreators(inputActions, dispatch)
	})
)(FormValidation)


