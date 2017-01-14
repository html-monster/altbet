import React from 'react' ;


export class TestCm extends React.Component
{
    render()
    {
        0||console.log( 'this.props.children', this.props.children );
        return <div className="here">{this.props.children}</div>;
    }
}