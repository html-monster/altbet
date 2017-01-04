/**
 * Created by Vlasakh on 04.01.2017.
 */

import React from 'react' ;


export default class BaseController extends React.Component
{
    constructor(props)
    {
        super(props);

        // set connected actions for call action from action
        props.actions.setConnectedActions(props.actions);
    }
}