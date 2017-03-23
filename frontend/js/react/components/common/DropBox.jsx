/**
 * Created by Vlasakh on 23.03.2017.
 */

import React from 'react';


export class DropBox extends React.Component
{
    closeSlideFunc = null;

    constructor(props)
    {
        super(props);

        this.state = { isopened: false };
    }


    /**
     * @private
     */
    _listSlide(toggle, event)
	{
		event.stopPropagation();

        // body click event
        if (!this.closeSlideFunc) this.closeSlideFunc = this._listSlide.bind(this, true);
        if( !this.state.isopened ) $('body').on('click', this.closeSlideFunc);
        else $('body').off('click', this.closeSlideFunc); // endif

        this.setState({...this.state, isopened: !this.state.isopened});


		if(toggle)
			$(this.refs.dropList).stop().slideToggle(200);
		else
			$(this.refs.dropList).stop().slideUp(200);
	}


    render()
    {
        // todo: сделать анимашку треугольника

        // var {className, name} = this.props.data;

        return <div className={`select ` + this.props.className + (this.state.isopened ? " opened" : "")}>
                    <span className="active_selection btn wave select__field" onClick={this._listSlide.bind(this, true)}>test</span>
                    <ul className="select_list" ref="dropList" onClick={this._listSlide.bind(this, false)}>
                        {
                            this.props.items.map((val, key) => <li key={key}>{val}</li>)
                        }
                    </ul>
                </div>
;
    }
}