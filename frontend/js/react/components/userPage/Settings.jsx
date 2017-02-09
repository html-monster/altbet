/**
 * Created by tianna on 09.02.17.
 */

import React from 'react';


export class Settings extends React.PureComponent
{
    render()
    {
        var {header, active} = this.props.data;
        return <div className={"tab_item settings " + (active ? "active" : "")}>
                <h2>Settings</h2>
                {header}
            </div>;
    }
}