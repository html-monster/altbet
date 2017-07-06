/**
 * Created by Vlasakh on 06.07.2017.
 */

import React from 'react';
import Pager from 'react-pager';


/**
 * @param className - class name of the container
 */
export class PagerBox extends React.Component
{
    constructor(props)
    {
        super(props);


        const { total, current, visiblePage } = this.props;
        // this.state = {
        //     total:       total,
        //     current:     current,
        //     visiblePage: visiblePage,
        // };
    }


    render()
    {
        const { total, current, visiblePage } = this.props;


        return (
            <Pager
                total={total}
                current={current}
                visiblePages={visiblePage}
                titles={{ first: '<', last: '>' }}
                className="pagination-sm pull-right"
                onPageChanged={::this._onChange}
            />)
        // return <Pager name={name} options={items} /*autofocus*/ simpleValue clearable={clearable} disabled={disabled} value={selectValue} searchable={searchable} onChange={(newValue) => { afterChange( newValue ); this.setState({ selectValue: newValue }); }}/>;
    }

    /** @private */ _onChange(current)
    {
        this.props.onPageChange( current );
        // this.setState({ ...this.state, current });
    }
}