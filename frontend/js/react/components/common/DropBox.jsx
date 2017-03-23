/**
 * Created by Vlasakh on 23.03.2017.
 */

import React from 'react';


export class DropBox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { isopened: false }
    }


    /**
     * @private
     */
    _listSlide(toggle, event)
	{
		event.stopPropagation();

        this.setState({...this.state, ischecked: !this.state.isopened});

		if(toggle)
			$(this.refs.dropList).slideToggle(200);
		else
			$(this.refs.dropList).slideUp(200);
        0||console.log( 'this.state.isopened', this.state.isopened );
	}


    render()
    {
        // var {className, name} = this.props.data;

        return <div className={`select` + (this.state.isopened ? " opened" : "")}>
                    <span className="active_selection btn wave" onClick={this._listSlide.bind(this, true)}>test</span>
                    <ul className="select_list" ref="dropList" onClick={this._listSlide.bind(this, false)}>
                        <li>Implied</li>
                        <li>Decimal</li>
                        <li>American</li>
                        <li>Fractional</li>
                    </ul>
                </div>
;
    }
}