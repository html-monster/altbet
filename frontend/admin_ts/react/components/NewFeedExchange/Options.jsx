/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';


export class Options extends React.Component
{
    render()
    {
        const { Positions, TeamSize } = this.props.data;
        let jj = 0, kk = 1;
        // let Defence = {};
        // TimeEvent.forEach((val) => {
        //     if (TeamDefence.TeamId) Defence = {name: val.HomeTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
        //     if (TeamDefence.TeamId) Defence = {name: val.AwayTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
        // });
        //0||console.log( 'players', players, teamNum );

        return <div className="form-group">
            <label className="col-sm-3 control-label">Team size</label>
            <div class="col-sm-9 input-group">
                {do{
                    let data = this._checkTeamSize(Positions);
                    <select class="cb-size form-control" defaultValue={TeamSize} onChange={::this._onChangeTeamSize}>
                        {data.items}
                    </select>
                }}
            </div>
        </div>
        ;
    }


    /**@private*/ _checkTeamSize(Positions)
    {
        let len = 0, ret = [], vals = [];
        Positions.forEach((val) => len += val.Quantity);

        for( var ii = 0, countii = len-1; ii < countii; ii++ )
        {
            vals.push(ii+1);
            ret.push(<option key={ii}>{ii+1}</option>);
        } // endfor
        vals.push(ii+1);
        ret.push(<option key={ii}>{ii+1}</option>);

        return {values: vals, items: ret};
    }


    /**@private*/ _onChangeTeamSize(ee)
    {
        // __DEV__&&console.log( '{p1, p2,p3}', ee.target.value );
        this.props.actions.actionChangeTeamSize(ee.target.value);
    }
}