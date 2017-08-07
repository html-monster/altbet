/**
 * Created by Vlasakh on 23.03.2017.
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';


/**
 * @param className - class name of the container
 * @param name - name of hidden field (for the forms)
 * @param items: {key - shows in dropbox items (notrequired if key==val), val - sets hidden field value, selected - initial selected item (notrequired)}
 * @param initLabel - if no selected items - sets the text of dropdown
 * @param hint - onHover tip
 * @param afterChoose(listItem:object) - callback for after dropbox item click
 * @param onCustomChange(value:string) - input validation integration callback
 */
export class DropBox extends React.Component
{
    closeSlideFunc = null;
    currItem = null;
    initLabel = "Select item";

    options = {
        maxHeight: 250,
    };


    constructor(props)
    {
        super(props);

        // find dropBox selected element
        var currItem = null, currItemVal = '';
        var $items = props.items;
        if (props.initLabel) this.initLabel = props.initLabel;


        // prepare items
        [$items, currItem] = this._prepareItems($items);


        this.options = {...this.options, ...props.options};

        this.state = { isopened: false, currItem, items: $items, currItemVal };
    }


    componentDidMount()
    {
        // bind native change prop
        // $(this.refs.dboxVal).change((ee) => this.props.input.onChange(ee));

        var hUl = $(this.refs.dropList).outerHeight();
        var hLi = $(this.refs.dropList).find('li').outerHeight();
        var hh = parseInt(hUl / hLi) * hLi;
        __DEV__&&console.debug( 'hUl', hUl, hh, $(this.refs.dropList) );
    }


    render()
    {
        var { name, input, hint } = this.props;
        var { items, currItem, currItemVal } = this.state;
        var dboxKey;

        if( input ) delete input.value;
        else input = {};

        // 0||console.log( 'currItem', currItem );
        if ( currItem !== null ) {
            dboxKey = items[currItem].key;
        }
        else
        {
            dboxKey = this.initLabel;
        }

// 0||console.log( 'input', input );
        return <div className={classnames('select', this.props.className, {'-opened': this.state.isopened})} title={hint}>
                    <input ref="dboxVal" type="hidden" name={name} value={currItemVal} {...input}/>
                    <span className="active_selection btn wave" onClick={this._listSlide.bind(this, true)}>{dboxKey}<i>{}</i></span>
                    <ul className="select_list" ref="dropList" onClick={this._listSlide.bind(this, false)}>
                        {
                            items.map((val, key) => <li className={key == currItem ? "active" : ""} key={key} data-val={val.val} onClick={this._listSelect.bind(this, key)}>{val.key}</li>)
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

        if ( event.target.nodeName.toLowerCase() !== 'li' )
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
        var { onCustomChange, afterChoose } = this.props;

        // call onChange for hidden field for validation
/*        if( this.props.input && this.props.input.onChange )
        {
            this.refs.dboxVal.value = this.props.items[key].val;
            $(this.refs.dboxVal).change();
        }*/ // endif

        this.setState({...this.state, currItem: key, isopened: false, currItemVal: this.state.items[key].val});


        // validation integration
		onCustomChange && onCustomChange(this.state.items[key].val);


        // after click callback
        afterChoose && afterChoose(this.state.items[key]);

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



    /**
     * @private
     */
	_prepareItems(inItems)
    {
        let currItem = null, currItemVal = '';

        let $items = inItems;
        if( $items.length )
        {
            // currItem = 0;
            for( let ii = 0, countii = $items.length; ii < countii; ii++ )
            {
                if ($items[ii].key === undefined) $items[ii].key = $items[ii].val;
                if( $items[ii].selected ) {
                    currItem = ii;
                    currItemVal = $items[ii].val;
                }
            } // endfor
        } // endif

        return [$items, currItem];
    }
}

//	validate: React.PropTypes.func,
if(__DEV__)
{
	DropBox.propTypes = {
		items: PropTypes.array.isRequired,
		className: PropTypes.string,
		name: PropTypes.string,
		initLabel: PropTypes.string,
		hint: PropTypes.string,
		afterChoose: PropTypes.func,
		onCustomChange: PropTypes.func,
	};
}