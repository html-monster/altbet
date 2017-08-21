/**
 * Created by Htmlbook on 01.08.2017.
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';

import { Framework } from '../common/Framework';
import OddsConverterActions from '../actions/OddsConverterActions'
import {DropBox2} from '../components/common/DropBox2';
import OddsConverter from '../models/oddsConverter';

class OddsConverterComp extends React.Component
{
	/**@private*/ _OddsConverterObj;

	constructor()
	{
		super();

		this._OddsConverterObj = new OddsConverter();
	}

	render()
	{
		const { actions, currentOddSystem } = this.props;

		return <DropBox2 className="odds_converter select" name={'odds'} value={currentOddSystem} items={[
			{value: 'Implied', label: 'Implied'},
			{value: 'Decimal', label: 'Decimal'},
			{value: 'American', label: 'American'},
			{value: 'Fractional', label: 'Fractional'}]}
			afterChange={actions.setOddsSystem}
			hint="This feature shows values in different odds, while pointing at the values in Trade Slip or Active Player"
		/>;
	}
}

export default connect(state => ({
		...state.oddsReducer,
	}),
	dispatch => ({
		actions: bindActionCreators(Framework.initAction(OddsConverterActions), dispatch),
	})
)(OddsConverterComp)

//	validate: React.PropTypes.func,
// if(__DEV__)
// {
// 	OddsConverterComp.propTypes = {
// 		items: PropTypes.arrayOf(PropTypes.shape({
// 			value: PropTypes.string,
// 			label: PropTypes.string,
// 		})).isRequired,
// 		className: PropTypes.string,
// 		name: PropTypes.string,
// 		placeholder: PropTypes.string,
// 		value: PropTypes.string,
// 		clearable: PropTypes.bool,
// 		searchable: PropTypes.bool,
// 		afterChange: PropTypes.func,
// 	};
// }