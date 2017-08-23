/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import classNames from 'classnames';

export class DefenceChoose extends React.Component
{
    constructor(props)
    {
        super(props);

        // this.state = {data: Players, filters, posFilters};
    }


/*
    componentWillUpdate(newData, props)
    {
        if( newData.data.CurrEvtId !== this.props.data.CurrEvtId )
        {
            const { Players, positions, uplayerdata } = newData.data;

            this.setState({...this.state, data: newData.data.Players, filters: this._prepareTeamFilters(Players), posFilters: this._preparePosFilters(positions, uplayerdata)})
        } // endif
    }
*/


    render()
    {
        const { CurrentEventObj, FormData, actions } = this.props.data;
        let res;

        const addT1Disabled = !!FormData.Team1Defense.TeamId;
        const addT2Disabled = !!FormData.Team2Defense.TeamId;


        return <table className="table">
            <tbody>
                <tr>
                    <td>{CurrentEventObj.HomeTeam}</td>
                    {(res = this._checkDefenceTeam(CurrentEventObj, FormData, 1)) ?
                        <td>
                            <button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamDefence.bind(null, {team: res.team})} title={`Remove team ${res.team} defense`}><i className="fa fa-remove -red"/> remove</button>&nbsp;&nbsp;
                            <abbr title={CurrentEventObj.HomeTeam}>Team {res.team}</abbr>
                        </td>
                        :
                        <td>
                            &nbsp;
                            <button type="button" class="btn btn-default -btn-default btn-xs" title="Add to team 1 defense" disabled={addT1Disabled} onClick={actions.actionAddTeamDefence.bind(null, {TeamId: CurrentEventObj.HomeId, team: 1, EventId: CurrentEventObj.EventId})}><i class="fa fa-plus"/> Add T1</button>
                            &nbsp;
                            <button type="button" class="btn btn-default -btn-default btn-xs" title="Add to team 2 defense" disabled={addT2Disabled} onClick={actions.actionAddTeamDefence.bind(null, {TeamId: CurrentEventObj.HomeId, team: 2, EventId: CurrentEventObj.EventId})}><i class="fa fa-plus"/> Add T2</button>
                        </td>
                    }
                </tr>
                <tr>
                    <td>{CurrentEventObj.AwayTeam}</td>
                    {(res = this._checkDefenceTeam(CurrentEventObj, FormData, 2)) ?
                        <td>
                            <button className="btn btn-default -btn-default btn-xs" onClick={actions.actionDelTeamDefence.bind(null, {team: res.team})} title={`Remove team ${res.team} defense`}><i className="fa fa-remove -red"/> remove</button>&nbsp;&nbsp;
                            <abbr title={CurrentEventObj.AwayTeam}>Team {res.team}</abbr>
                        </td>
                        :
                        <td>
                            &nbsp;
                            <button type="button" class="btn btn-default -btn-default btn-xs" title="Add to team 1 defense" disabled={addT1Disabled} onClick={actions.actionAddTeamDefence.bind(null, {TeamId: CurrentEventObj.AwayId, team: 1, EventId: CurrentEventObj.EventId})}><i class="fa fa-plus"/> Add T1</button>
                            &nbsp;
                            <button type="button" class="btn btn-default -btn-default btn-xs" title="Add to team 2 defense" disabled={addT2Disabled} onClick={actions.actionAddTeamDefence.bind(null, {TeamId: CurrentEventObj.AwayId, team: 2, EventId: CurrentEventObj.EventId})}><i class="fa fa-plus"/> Add T2</button>
                        </td>
                    }
                </tr>
            </tbody>
        </table>;
    }


    _checkDefenceTeam(CurrentEventObj, FormData, team)
    {
        let $TeamId = FormData[`Team${team}Defense`].TeamId;
        if( $TeamId && team === 1 )
        {
            return {team: 1};
        }
        else if( $TeamId && team === 2 )
        {
            return {team: 2};
        } // endif

        return false;
    }
}