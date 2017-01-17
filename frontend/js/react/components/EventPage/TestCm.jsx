import React from 'react' ;


export class TestCm extends React.Component
{
    constructor(props)
    {
        super();

        this.noClass = true;
        this.className = false;
        this.state = {val: props.transitionLoading ? true : props.data, className: false, noClass: !props.transitionLoading};
    }


    shouldComponentUpdate(props, state)
    {
        if( props.data != state.val )
        {
            // state.className = !state.className;
            // state.val = props.data;
            // this.state = {...state, val: props.data, className: !state.className, noClass: false};
            this.setState({...state, val: props.data, className: !state.className, noClass: false});
            this.noClass = false;
            this.className = !state.className;
        0||console.debug( 'props, nextProps', this.props.key, props, this.state, this );
        }
        else
        {
        } // endif

        return true;
    }


    render()
    {
        // 0||console.log( 'this.props.children', this.props.children );
        return <div className={!this.noClass ? (this.className ? "cm-test" : "cm-test2") : ""}>{this.props.children}</div>;
    }
}