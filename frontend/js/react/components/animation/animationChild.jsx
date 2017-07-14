import ReactCSSTransitionGroupChild from 'react/lib/ReactCSSTransitionGroupChild';
import React from 'react';


export default class AnimateOnUpdateChild extends ReactCSSTransitionGroupChild{
	getClass(obj)
	{
		return {}.toString.call(obj).slice(8, -1);
	}

	shouldComponentUpdate(nextProps)
	{
		let key = nextProps.children.props['data-verify'];

		if(this.getClass(key) == 'Array'){
			key.forEach((item) => {
				compareValue(this, item);
			});
		}
		else
			compareValue(this, key);

		function compareValue(context, keyValue)
		{
			let oldData, newData;

			if(!context.props.data) return false;

			oldData = context.props.data[keyValue];
			newData = nextProps.data[keyValue];
			// console.log('oldData:', oldData);
			// console.log('newData:', newData);
			if(!!(oldData != newData && newData)){
				context.transition('enter', null, context.props.enterTimeout);
			}
		}
		return true;
	}

/*    render() {
		0||console.log( 'this.props.children', this.props.children );
		if( this.props.options && this.props.options.nowrapp )
		{
        	return <div className="here">{this.props.children}</div>;
		}
		else
		{
        	return this.props.children;
		} // endif
    }*/
}