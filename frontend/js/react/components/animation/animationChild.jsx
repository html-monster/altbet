import ReactCSSTransitionGroupChild from 'react/lib/ReactCSSTransitionGroupChild';

export default class AnimateOnUpdateChild extends ReactCSSTransitionGroupChild{
	shouldComponentUpdate(nextProps){
		let oldData = this.props.data[nextProps.children.props['data-verify']];
		let newData = nextProps.data[nextProps.children.props['data-verify']];
		if(oldData != newData && newData){
			this.transition('enter', null, this.props.enterTimeout);
		}
		return true;
	}
}