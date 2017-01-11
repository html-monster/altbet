import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import AnimateOnUpdateChild from './animation/animationChild.jsx';

export default class AnimateOnUpdate extends ReactCSSTransitionGroup{
	_wrapChild(child) {

		return React.createElement(
			AnimateOnUpdateChild,
			{
				name: this.props.transitionName,
				appear: this.props.transitionAppear,
				enter: this.props.transitionEnter,
				leave: this.props.transitionLeave,
				appearTimeout: this.props.transitionAppearTimeout,
				enterTimeout: this.props.transitionEnterTimeout,
				leaveTimeout: this.props.transitionLeaveTimeout,
				data: this.props.data
			},
			child
		);
	};
}

module.exports = AnimateOnUpdate;