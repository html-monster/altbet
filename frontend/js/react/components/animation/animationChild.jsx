import ReactCSSTransitionGroupChild from 'react/lib/ReactCSSTransitionGroupChild';

export default class AnimateOnUpdateChild extends ReactCSSTransitionGroupChild{
	getClass(obj){
		return {}.toString.call(obj).slice(8, -1);
	}

	shouldComponentUpdate(nextProps){
		let key = nextProps.children.props['data-verify'];

		if(this.getClass(key) == 'Array'){
			key.forEach((item) => {
				compareValue(this, item);
			});
		}
		else
			compareValue(this, key);

		function compareValue(context, keyValue) {
			let oldData, newData;

			oldData = context.props.data[keyValue];
			newData = nextProps.data[keyValue];
			if(!!(oldData != newData && newData)){
				context.transition('enter', null, context.props.enterTimeout);
			}
		}
		return true;
	}
}