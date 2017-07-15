import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react' ;

import BaseController from './BaseController';
import Actions from '../actions/GidxCashierActions.ts';
import {Framework} from '../common/Framework.ts';
import InputNumber from '../components/InputNumber';


class GidxCashier extends BaseController
{
    /**@private*/ T1; // timer
    /**@private*/ formElement;


    constructor(props)
    {
        super(props);

        // ABpp.controllers.EventPage

        // this.state = {data: props.data};
        __DEV__&&console.debug( 'GidxVerification props', props );

        // this.actions = props.eventPageActions;

        this.state = {errorMessageAmount: ''}
    }


    render()
    {
        const { data: {depositQuantity, validationMessage}, actions, } = this.props;
        const { errorMessageAmount, } = this.state;

        return <div className="withdraw-page">
			<div className="quantity_control">
				<strong>Select withdrawal amount</strong>
				<div className="controls">
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>10</button>
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>25</button>
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>50</button>
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>100</button>
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>250</button>
					<button className="btn wave" onClick={actions.actionOnButtonQuantityClick}>500</button>
                    <br />
					<InputNumber type="tel" value={depositQuantity} inputValidate="integer" hard="true" onChange={actions.actionOnInputQuantityChange} maxLength="7" autoFocus/>
					<span className="validation-errors">{errorMessageAmount}</span>
					<span className="label">$</span>
				</div>
                <br />
                <form ref={(elm) => this.formElement = elm} action="" method="get" onSubmit={::this._onSubmit}>
                    <input type="hidden" name="amount" value={depositQuantity}/>
                    <input type="hidden" name="direction" value="Payout"/>
				    <button type="submit" class="btn-md btn-h btn_yellow wave waves-effect waves-button">Withdraw</button>
                </form>
				<span class="answer_message validation-summary-errors">{validationMessage}</span>
			</div>
        </div>
    }


    /**
     * Begin withdraw
     */
    _onSubmit(ee)
    {
        ee.preventDefault();

        if( this.props.data.depositQuantity )
        {
            this.formElement.submit();
        }
        else
        {
            this._setError('Input withdraw amount, please', 'errorMessageAmount');
        } // endif
    }


    _setError(message, messageElement)
    {
        this.state[messageElement] = message;
        this.setState({...this.state,});

        clearTimeout(this.T1);
        this.T1 = setTimeout(() => {
            this.state[messageElement] = '';
            this.setState({...this.state,});
        }, 3000);
    }
}

// __DEV__&&console.debug( 'connect', connect );

export default () => connect(state => ({
    data: state.gidxCashier,
    // test: state.Ttest,
}),
dispatch => ({
	actions: bindActionCreators(Framework.initAction(Actions), dispatch),
})
)(GidxCashier)