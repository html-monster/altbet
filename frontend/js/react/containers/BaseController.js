/**
 * Created by Vlasakh on 04.01.2017.
 */

import React from 'react' ;


export default class BaseController extends React.Component
{
    constructor(props)
    {
        super(props);

        /** @public */
        this.actions = {};


        this.init();
    }



    /**
     * @private
     */
    init()
    {
        // set connected actions for call action from action
        /// props.actions.setConnectedActions(props.actions);

        // actions of the controller
        /// if (this.props.actions) this.actions = this.props.actions;
    }
}