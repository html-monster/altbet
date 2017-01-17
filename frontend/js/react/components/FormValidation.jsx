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
		console.log(this);
		this.props.formActions.actionOnFormSubmit(false);
		this.props.inputActions.actionOnFormSubmit();
		console.log(this.props.formValidation);
		setTimeout(()=>{console.log(this.props.formValidation)}, 500)
		this.props.handleSubmit(this.props.values);
	}

	render()
	{
		const {renderContent, ...rest} = this.props;
		// console.log(rest);
		return(
			// this.state.renderContent(this.state.data)
			renderContent({...rest, handleSubmit: this.onSubmit.bind(this)})
		);
	}
}



export default connect(state => ({
		formValidation: state.formValidation,
	}),
	dispatch => ({
		formActions: bindActionCreators(formActions, dispatch),
		inputActions: bindActionCreators(inputActions, dispatch)
	})
)(FormValidation)


