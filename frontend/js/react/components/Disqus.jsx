/**
 * Created by Htmlbook on 13.07.2017.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import { Framework } from '../common/Framework';
import disqusActions from '../actions/disqusActions';

class Disqus extends React.PureComponent
{
	componentDidMount()
	{
		/**
		 *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
		 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
		(function() { // DON'T EDIT BELOW THIS LINE
			var d = document, s = d.createElement('script');
			s.src = '//altbet.disqus.com/embed.js';
			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
		})();
	}

	componentDidUpdate(prevProps)
	{
		const { identifier, url } = this.props;
		// console.log('prevProps:', prevProps);
		// console.log('this.props:', this.props);

		if (url && identifier && url !== prevProps.url && identifier !== prevProps.identifier) {
			DISQUS && DISQUS.reset({
				reload: true,
				config: function () {
					this.page.identifier = identifier;
					this.page.url = `http://${location.host}${ABpp.baseUrl}${url}`;
				}
			});
		} // endif
	}

	render()
	{
		const { appearance, url, identifier } = this.props;

		return <div className="disqus" style={!appearance ? {display: 'none'} : {}}>
			{
				url && identifier ?
					<div id="disqus_thread">{}</div>
					:
					<p className="default_order_info animated">{"Click on the game to see event comments"}</p>
			}
		</div>
	}
}

Disqus.propTypes = {
	appearance: React.PropTypes.bool,
};

export default connect(state => ({
		...state.disqus,
	}),
	dispatch => ({
		actions: bindActionCreators(Framework.initAction(disqusActions), dispatch),
	})
)(Disqus)