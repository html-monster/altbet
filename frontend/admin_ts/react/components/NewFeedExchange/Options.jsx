/**
 * Created by Vlasakh on 20.04.2017.
 */

import React from 'react' ;
import NumericInput from 'react-numeric-input';
import classnames from 'classnames';


export class Options extends React.PureComponent
{
    constructor(props)
    {
        super();

        // this.state = {Spread: false, MoneyLine: false, TotalPoints: false}
    }

    render()
    {
        const { data: {Positions, TeamSize, IsEditFeedExchange, FormData: {OptionExchanges: {Spread, MoneyLine, TotalPoints}, ExchangeLimit}, Exchanges}, actions } = this.props;
        let jj = 0, kk = 1;
        // let Defence = {};
        // TimeEvent.forEach((val) => {
        //     if (TeamDefence.TeamId) Defence = {name: val.HomeTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
        //     if (TeamDefence.TeamId) Defence = {name: val.AwayTeam, event: `${val.HomeTeam} vs ${val.AwayTeam}`}
        // });

        return <div className="">
            <div className="row">
                <div className="col-sm-4">
                    <div class="form-group">
                        <label>Team size</label>
                        {do{
                            let data = this._checkTeamSize(Positions);
                            <select class="cb-size form-control" defaultValue={TeamSize} onChange={::this._onChangeTeamSize}>
                                {data.items}
                            </select>
                        }}
                    </div>
                </div>
                <div className="col-sm-8">
                    {IsEditFeedExchange ?
                        <div class="form-group">
                            <label>Event types</label>
                            <div class="">
                                {do{ let ret;
                                    switch( Exchanges[0].Symbol.OptionExchange )
                                    {
                                        case 0: ret = 'Spread'; break;
                                        case 1: ret = 'Money Line'; break;
                                        case 2: ret = 'Total Points'; break;
                                    }
                                    ret;
                                }}
                            </div>
                        </div>
                        :
                        <div class="form-group">
                            <label>Event types</label>
                            <div class="btn-group" role="group" aria-label="..." style={{display: 'block'}}>
                                <button type="button" class={classnames("btn", {'btn-default': !Spread.checked, 'btn-primary active': Spread.checked})} onClick={actions.actionEventTypeClick.bind(null, 'Spread')}>Spread</button>
                                <button type="button" class={classnames("btn", {'btn-default': !MoneyLine.checked, 'btn-primary active': MoneyLine.checked})} onClick={actions.actionEventTypeClick.bind(null, 'MoneyLine')}>Money Line</button>
                                <button type="button" class={classnames("btn", {'btn-default': !TotalPoints.checked, 'btn-primary active': TotalPoints.checked})} onClick={actions.actionEventTypeClick.bind(null, 'TotalPoints')}>Total Points</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div class="form-group">
                            <label>Exchange Limit</label>
                            <div class="">
                                <NumericInput className="exchange-limit" value={ExchangeLimit} precision={2} onChange={(num) => actions.actionExchangeLimit(num)} style={ false } />
                            </div>
                        </div>
                </div>
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


    /**@private*/ _onExchangeLimitClick(props, num, p1)
    {
        // if (num) this.props.actions.actionPPGValues({player, team, type, num});
        if (num) this.props.data.actions.actionPPGValues({...props, num});
    }
}