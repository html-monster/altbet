/**
 * Created by Vlasakh on 07.04.2017.
 */

import * as React from "react";


export class Tabs extends React.PureComponent
{
    popup = null;

    uniq = (new Date()).getTime();

    constructor() {
        super();
    }


    componentDidMount()
    {
        $(this.refs.tab1).addClass("active");
        $(this.refs.tab_item1).addClass("active");
    }


    render()
    {
        const { className, tabsClass } = this.props;

        return (
            <div className={`${className} ${tabsClass}`} data-js-tabs={this.uniq}>

                <div className={`${tabsClass}__tabs tabs`}>
                    {
                        function () { for (var ret = [], ii = 1, countii = this.props.children.length / 2; ii <= countii; ii++ )
                            ret.push(<div key={"tab" + ii} ref={"tab" + ii} className={`${tabsClass}__tab tab js-tab`} onClick={::this._onTabClick}>{ this.props.children[ii-1] }</div>);
                        return ret; }.bind(this)()
                    }
                </div>

                <div className={`${tabsClass}__tab_content tab_content`}>
                    {
                        function () { for (var ret = [], jj = 1, countii = this.props.children.length, ii = countii / 2 + 1; ii <= countii; ii++, jj++ )
                            ret.push(<div key={"tab_item" + jj} ref={"tab_item" + jj} className={`${tabsClass}__tab_item tab_item tab_item${jj} js-tab_item`}>{ this.props.children[ii-1] }</div>);
                        return ret; }.bind(this)()
                    }
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
            tabContainer.children('.js-tab').removeClass("active").eq($(ee.target).index()).addClass("active");
            itemContainer.children('.js-tab_item').removeClass('active').hide().eq($(ee.target).index()).show();
        }
    }
}
