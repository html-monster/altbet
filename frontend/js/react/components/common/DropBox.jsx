/**
 * Created by Vlasakh on 23.03.2017.
 */

import React from 'react';


/**
 * @param className - class name of the container
 * @param name - name of hidden field (for the forms)
 * @param items: {key - shows in dropbox items (notrequired if key==val), val - sets hidden field value, selected - initial selected item (notrequired)}
 * @param initLabel - if no selected items - sets the text of dropdown
 * @param hint - onHover tip
 * @param afterChoose - callback for after dropbox item click
 */
export class DropBox extends React.Component
{
    closeSlideFunc = null;
    currItem = null;
    initLabel = "Select item";


    constructor(props)
    {
        super(props);

        // find dropBox selected element
        var currItem = null;
        var $items = props.items;
        if (props.initLabel) this.initLabel = props.initLabel;

        if( $items.length )
        {
            // currItem = 0;
            for( let ii = 0, countii = $items.length; ii < countii; ii++ )
            {
                if (!$items[ii].key == undefined) $items[ii].key = $items[ii].val;
                if( $items[ii].selected ) { currItem = ii; }
            } // endfor
        } // endif

        this.state = { isopened: false, currItem: currItem };
    }


    componentDidMount()
    {
        // bind native change prop
        // $(this.refs.dboxVal).change((ee) => this.props.input.onChange(ee));
    }


    render()
    {
        const { name, items, input, hint, onCustomChange } = this.props;
        var dboxVal, dboxKey;

        if( input ) delete input.value;
        else input = {};

        var $currItem = this.state.currItem;
        // 0||console.log( '$currItem', $currItem );
        if ( $currItem != null ) {
            dboxVal = items[$currItem].val;
            dboxKey = items[$currItem].key;
        }
        else
        {
            dboxKey = this.initLabel;
        }
		onCustomChange(dboxVal);
console.log(input);
// 0||console.log( 'input', input );
        return <div className={`select ` + this.props.className + (this.state.isopened ? " -opened" : "")} title={hint}>
                    <input ref="dboxVal" type="hidden" name={name} value={dboxVal} {...input}/>
                    <span className="active_selection btn wave" onClick={this._listSlide.bind(this, true)}>{dboxKey}<i>{}</i></span>
                    <ul className="select_list" ref="dropList" onClick={this._listSlide.bind(this, false)}>
                        {
                            items.map((val, key) => <li className={key == $currItem ? "active" : ""} key={key} data-val={val.val} onClick={this._listSelect.bind(this, key)}>{val.key}</li>)
                        }
                    </ul>
                </div>
;
    }



    /**
     * @private
     */
    _listSlide(toggle, event)
	{
		// if ( event.target.nodeName.toLowerCase() != 'li' ) event.stopPropagation();
		// 0||console.log( 'ul click', event );

        // body click event
        if (!this.closeSlideFunc) this.closeSlideFunc = this._listSlide.bind(this, false);
        if( !this.state.isopened ) $('body').on('click', this.closeSlideFunc);
        else $('body').off('click', this.closeSlideFunc); // endif

        if ( event.target.nodeName.toLowerCase() != 'li' )
        {
            event.stopPropagation();
            this.setState({...this.state, isopened: !this.state.isopened});
            // 0||console.log( 'event.target.nodeName.toLowerCase()', event.target.nodeName.toLowerCase(), this.state.isopened );
        }


        this._listClose(toggle);
	}


    /**
     * @private
     * On dropbox item click
     */
    _listSelect(key, event)
	{
		// event.stopPropagation();

        // call onChange for hidden field for validation
/*        if( this.props.input && this.props.input.onChange )
        {
            this.refs.dboxVal.value = this.props.items[key].val;
            $(this.refs.dboxVal).change();
        }*/ // endif

        this.setState({...this.state, currItem: key, isopened: false});

        if( this.props.afterChoose )
        {
            this.props.afterChoose(this.props.items[key]);
        }
        else
        {
        } // endif

        this._listClose(false);
	}


    /**
     * @private
     */
	_listClose(toggle)
    {
        // 0||console.log( 'toggle', toggle, this.state.isopened );
		if( !this.state.isopened && toggle )
			$(this.refs.dropList).stop().slideDown(200);
		else
			$(this.refs.dropList).stop().slideUp(200);
    }
}