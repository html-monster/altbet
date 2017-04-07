/**
 * Created by Vlasakh on 07.04.2017.
 */

import * as React from "react";


export class Tabs extends React.PureComponent
{
    popup = null;

    constructor() {
        super();
    }


    componentDidMount()
    {
        // active
    }


    render()
    {
        return (
            <div className="h-rns h-tab1">

                <div className="h-rns__tabs tabs h-tab1__tabs">
                    {
                        function () { for (var ret = [], ii = 1, countii = this.props.children.length / 2; ii <= countii; ii++ )
                            ret.push(<div key={"tab" + ii} className={`h-tab1__tab`} onClick={::this._onTabClick}>{ this.props.children[ii-1] }</div>);
                        return ret; }.bind(this)()
                    }
                </div>

                <div className="h-rns__tab_content tab_content">
                    <div className="l-rules tab_item" style={{display: 'block'}}>
                        { this.props.children[2] }
                    </div>

                    <div className="l-scoring tab_item" data-js-entities="">
                        { this.props.children[3] }
                    </div>
                </div>

            </div>
        );
    }

    _onTabClick(ee)
    {
        let tabContainer = $(ee.target).parent();
        let itemContainer = tabContainer.next();

        if( !($(ee.target).attr('data-disabled')) )
        {
            tabContainer.children('.tab').removeClass("active").eq($(ee.target).index()).addClass("active");
            itemContainer.children('.tab_item').removeClass('active').hide().eq($(ee.target).index()).fadeIn();
        }
    }
}
