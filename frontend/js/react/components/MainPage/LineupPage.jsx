import React from 'react';

// import {Popup} from "../../models/Popup.ts"
import {Popup} from "../common/Popup"
import {Tabs} from "../common/Tabs"


export class LineupPage extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = { isPopupVisible: false };

        // debug data
        this.entities = [
            'csuram88',
            'jalfassa',
            'jcaljr',
            'jcaljr',
            'johnwlsgt',
            'teachmehi',
            'cdub1120',
            'trulyfeballa',
            'titaniumman',
            'titaniumman',

            'bob_blanton',
            'bob_blanton',
            'bob_blanton',
            'roccnessmonster',
            'baggadouche',
            'linker123',
            'linker123',
            'awesemo',
            'awesemo',
            'awesemo',
        ]
    }


    render()
    {
        const { className, exdata, data: { HomeTeam, AwayTeam, HomeTotals, AwayTotals }, HomeName, AwayName } = this.props;
        return <div className={"l-lup " + className} data-js-team="" ref={'container'}>
                    <div className="lineup_container">
                        <div className="l-team1 team_table" key="tab1content">
                            <div className="l-lup__rules"><a href="#" className="l-lup__link text_decoration" onClick={::this._onRaSClick}>Rules & Scoring</a></div>

                            <div className="l-team">
                                <div className="l-team__title">{AwayTeam.Name}, ({AwayTeam.Points})</div>
                                <div className="l-team__team-wrapper">
                                    <table className="l-team__team">
                                        <thead>
                                            <tr>
                                                <th>{}</th>
                                                <th className="pl">Name</th>
                                                <th>Status</th>
                                                <th>FPPG</th>
                                                <th>EPPG</th>
                                                <th>Score</th>
                                                <th title="Estimated Time Remaining">ETR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            AwayTeam.Items.map((itm, key) => {
                                                // itm.Description = ['asdasd asdasd', 'asdada', 'asdasdasdasdadas asd ad asd as da', 'asdasd', 'asda as dasd a', 'asdasd asd as', 'asdasd asd as', 'asdasd asd as', 'asdasd asd as', 'asdasd asd as', 'asdasd asd as']
                                                return 	<tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td className="pl">
                                                        <strong>{itm.Name}</strong>
                                                        <div className="b-pl-info">
                                                            <div className="b-pl-info__main-inf">{AwayTeam.Alias} vs {HomeTeam.Alias}</div>
                                                            {
                                                                itm.Description && itm.Description.map((item, index) => <div className="b-pl-info__statistic" key={index}>{item}</div>)
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>{itm.Status}</td>
                                                    <td>{itm.FPPG}</td>
                                                    <td>{itm.EPPG}</td>
                                                    <td><strong>{itm.Score || "-"}</strong></td>
                                                    <td title="Estimated Time Remaining">{itm.ETR}</td>
                                                </tr>
                                            })
                                        }
                                        <tr className="totals">
                                            <td colSpan={3}>Totals</td>
                                            <td>{AwayTotals.FPPG}</td>
                                            <td>{AwayTotals.EPPG}</td>
                                            <td>{AwayTotals.Score}</td>
                                            <td>{AwayTotals.ETR}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="l-team2 team_table" key="tab2content">
                            {/*<div className="l-lup__rules"><a href="#" className="l-lup__link text_decoration" onClick={::this._onRaSClick}>Rules & Scoring</a></div>*/}

                            <div className="l-team">
                                <div className="l-team__title">{HomeTeam.Name}, ({HomeTeam.Points})</div>
                                <div className="l-team__team-wrapper">
                                    <table className="l-team__team">
                                        <thead>
                                            <tr>
                                                <th>{}</th>
                                                <th className="pl">Name</th>
                                                <th>Status</th>
                                                <th>FPPG</th>
                                                <th>EPPG</th>
                                                <th>Score</th>
                                                <th title="Estimated Time Remaining">ETR</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            HomeTeam.Items.map((itm, key) => <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td className="pl">
                                                    <strong>{itm.Name}</strong>
                                                    <div className="b-pl-info">
                                                        <div className="b-pl-info__main-inf">{AwayTeam.Alias} vs {HomeTeam.Alias}</div>
                                                        {
                                                            itm.Description && itm.Description.map((item, index) => <div className="b-pl-info__statistic" key={index}>{item}</div>)
                                                        }
                                                    </div>

                                                </td>
                                                <td>{itm.Status}</td>
                                                <td>{itm.FPPG}</td>
                                                <td>{itm.EPPG}</td>
                                                <td><strong>{itm.Score || "-"}</strong></td>
                                                <td title="Estimated Time Remaining">{itm.ETR}</td>
                                            </tr>)
                                        }
                                        <tr className="totals">
                                            <td colSpan={3}>Totals</td>
                                            <td>{HomeTotals.FPPG}</td>
                                            <td>{HomeTotals.EPPG}</td>
                                            <td>{HomeTotals.Score}</td>
                                            <td>{HomeTotals.ETR}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                { this.state.isPopupVisible &&
                    <Popup closeFunc={::this._onClose}>
                        <Tabs className="h-rns" tabsClass="h-tab1">
                            {
                                [
                                    "Info",
                                    "Entries",
                                    <div key="tab1content" className="page_wrapper">
                                        <h1>Terms and Conditions</h1>

                                        <p>
                                            If you have any questions or concerns take a look at our
                                            <a href={`${ABpp.baseUrl}/eng/footer/Help`} target="_blank"> frequently asked questions </a>
                                            or get in touch with us.
                                        </p>
                                        <div id="introduction">
                                            <h2>Introduction</h2>
                                            <div>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                                                    ante nunc, mollis sit amet aliquam auctor, varius vel sem. Duis sit
                                                    amet tortor maximus, egestas arcu iaculis, volutpat elit. Vivamus
                                                    consequat ante in dui hendrerit, quis fringilla nulla interdum.
                                                    Etiam non interdum sem. Nunc eget libero nisi. Fusce varius
                                                    convallis lacus vel venenatis. Ut laoreet lorem sit amet nisi
                                                    aliquam, ut posuere mi rutrum. Ut in justo ante. Nulla ante massa,
                                                    suscipit ac aliquam ac, molestie sit amet massa.</p>

                                                <p>Aliquam vitae tincidunt lorem. Duis pharetra mi vel ex convallis, et
                                                    gravida nibh aliquam. Proin rhoncus lobortis euismod. Mauris neque
                                                    quam, gravida quis lacus vel, porta euismod orci. Phasellus lobortis
                                                    sodales dolor nec hendrerit. Mauris ac pellentesque ante.
                                                    Suspendisse nec tristique dui. Quisque libero risus, scelerisque nec
                                                    interdum id, maximus ac lectus. Donec condimentum mollis magna.
                                                    Praesent vel eros ipsum. Suspendisse eleifend nunc non elit rhoncus,
                                                    ut faucibus felis aliquam. Aenean ullamcorper in velit eu porttitor.
                                                    Maecenas sit amet arcu odio.</p>

                                                <p>Ut accumsan eget mi vitae aliquet. Nam vel felis iaculis, condimentum
                                                    quam et, tristique diam. Curabitur tincidunt dignissim urna, vitae
                                                    viverra risus rhoncus et. Phasellus urna ante, ullamcorper in odio
                                                    eu, porttitor dapibus dolor. In ac leo tempus, dapibus purus rutrum,
                                                    porttitor dolor. Aenean accumsan suscipit urna, sed ullamcorper
                                                    risus. In hac habitasse platea dictumst. Pellentesque gravida
                                                    ultrices vulputate. Suspendisse id lobortis mauris. Nunc ullamcorper
                                                    libero ac iaculis auctor. Mauris feugiat lorem vitae quam
                                                    condimentum, nec posuere neque lacinia.</p>

                                                <p>Morbi sed ligula sed nulla vulputate congue. Nunc consequat dolor
                                                    nulla, ac iaculis elit tincidunt vitae. Pellentesque habitant morbi
                                                    tristique senectus et netus et malesuada fames ac turpis egestas.
                                                    Curabitur justo turpis, sodales sit amet posuere et, volutpat sed
                                                    purus. Etiam bibendum ultrices enim sit amet volutpat. Praesent ut
                                                    vestibulum felis. Vestibulum at massa in erat aliquam venenatis.</p>

                                                <p>Quisque condimentum nulla et velit fermentum scelerisque. Nullam
                                                    placerat risus sit amet eros tincidunt, in laoreet leo mollis.
                                                    Curabitur ut volutpat purus, in tempus erat. Suspendisse nec metus
                                                    non lacus volutpat euismod et quis mauris. Nullam nisi quam, commodo
                                                    quis tristique vel, semper pellentesque tortor. Nulla lacus orci,
                                                    pellentesque non tempus non, molestie eu erat. Ut imperdiet nisl at
                                                    sem mollis, nec consectetur turpis posuere. Nam facilisis quis leo
                                                    in iaculis. Nunc interdum id enim et fringilla. Mauris pretium est
                                                    sem, nec eleifend nulla interdum luctus.</p>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                                                    ante
                                                    nunc, mollis sit amet aliquam auctor, varius vel sem. Duis sit amet
                                                    tortor maximus, egestas arcu iaculis, volutpat elit. Vivamus
                                                    consequat
                                                    ante in dui hendrerit, quis fringilla nulla interdum. Etiam non
                                                    interdum
                                                    sem. Nunc eget libero nisi. Fusce varius convallis lacus vel
                                                    venenatis.
                                                    Ut laoreet lorem sit amet nisi aliquam, ut posuere mi rutrum. Ut in
                                                    justo ante. Nulla ante massa, suscipit ac aliquam ac, molestie sit
                                                    amet
                                                    massa.</p>

                                                <p>Aliquam vitae tincidunt lorem. Duis pharetra mi vel ex convallis, et
                                                    gravida nibh aliquam. Proin rhoncus lobortis euismod. Mauris neque
                                                    quam, gravida quis lacus vel, porta euismod orci. Phasellus lobortis
                                                    sodales dolor nec hendrerit. Mauris ac pellentesque ante.
                                                    Suspendisse nec tristique dui. Quisque libero risus, scelerisque nec
                                                    interdum id, maximus ac lectus. Donec condimentum mollis magna.
                                                    Praesent vel eros ipsum. Suspendisse eleifend nunc non elit rhoncus,
                                                    ut faucibus felis aliquam. Aenean ullamcorper in velit eu porttitor.
                                                    Maecenas sit amet arcu odio.</p>

                                                <p>Ut accumsan eget mi vitae aliquet. Nam vel felis iaculis, condimentum
                                                    quam et, tristique diam. Curabitur tincidunt dignissim urna, vitae
                                                    viverra risus rhoncus et. Phasellus urna ante, ullamcorper in odio
                                                    eu, porttitor dapibus dolor. In ac leo tempus, dapibus purus rutrum,
                                                    porttitor dolor. Aenean accumsan suscipit urna, sed ullamcorper
                                                    risus. In hac habitasse platea dictumst. Pellentesque gravida
                                                    ultrices vulputate. Suspendisse id lobortis mauris. Nunc ullamcorper
                                                    libero ac iaculis auctor. Mauris feugiat lorem vitae quam
                                                    condimentum, nec posuere neque lacinia.</p>

                                                <p>Morbi sed ligula sed nulla vulputate congue. Nunc consequat dolor
                                                    nulla, ac iaculis elit tincidunt vitae. Pellentesque habitant morbi
                                                    tristique senectus et netus et malesuada fames ac turpis egestas.
                                                    Curabitur justo turpis, sodales sit amet posuere et, volutpat sed
                                                    purus. Etiam bibendum ultrices enim sit amet volutpat. Praesent ut
                                                    vestibulum felis. Vestibulum at massa in erat aliquam venenatis.</p>

                                                <p>Quisque condimentum nulla et velit fermentum scelerisque. Nullam
                                                    placerat risus sit amet eros tincidunt, in laoreet leo mollis.
                                                    Curabitur ut volutpat purus, in tempus erat. Suspendisse nec metus
                                                    non lacus volutpat euismod et quis mauris. Nullam nisi quam, commodo
                                                    quis tristique vel, semper pellentesque tortor. Nulla lacus orci,
                                                    pellentesque non tempus non, molestie eu erat. Ut imperdiet nisl at
                                                    sem mollis, nec consectetur turpis posuere. Nam facilisis quis leo
                                                    in iaculis. Nunc interdum id enim et fringilla. Mauris pretium est
                                                    sem, nec eleifend nulla interdum luctus.</p>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                                                    ante nunc, mollis sit amet aliquam auctor, varius vel sem. Duis sit
                                                    amet tortor maximus, egestas arcu iaculis, volutpat elit. Vivamus
                                                    consequat ante in dui hendrerit, quis fringilla nulla interdum.
                                                    Etiam non interdum sem. Nunc eget libero nisi. Fusce varius
                                                    convallis lacus vel venenatis. Ut laoreet lorem sit amet nisi
                                                    aliquam, ut posuere mi rutrum. Ut in justo ante. Nulla ante massa,
                                                    suscipit ac aliquam ac, molestie sit amet massa.</p>

                                                <p>Aliquam vitae tincidunt lorem. Duis pharetra mi vel ex convallis, et
                                                    gravida nibh aliquam. Proin rhoncus lobortis euismod. Mauris neque
                                                    quam, gravida quis lacus vel, porta euismod orci. Phasellus lobortis
                                                    sodales dolor nec hendrerit. Mauris ac pellentesque ante.
                                                    Suspendisse nec tristique dui. Quisque libero risus, scelerisque nec
                                                    interdum id, maximus ac lectus. Donec condimentum mollis magna.
                                                    Praesent vel eros ipsum. Suspendisse eleifend nunc non elit rhoncus,
                                                    ut faucibus felis aliquam. Aenean ullamcorper in velit eu porttitor.
                                                    Maecenas sit amet arcu odio.</p>

                                                <p>Ut accumsan eget mi vitae aliquet. Nam vel felis iaculis, condimentum
                                                    quam et, tristique diam. Curabitur tincidunt dignissim urna, vitae
                                                    viverra risus rhoncus et. Phasellus urna ante, ullamcorper in odio
                                                    eu, porttitor dapibus dolor. In ac leo tempus, dapibus purus rutrum,
                                                    porttitor dolor. Aenean accumsan suscipit urna, sed ullamcorper
                                                    risus. In hac habitasse platea dictumst. Pellentesque gravida
                                                    ultrices vulputate. Suspendisse id lobortis mauris. Nunc ullamcorper
                                                    libero ac iaculis auctor. Mauris feugiat lorem vitae quam
                                                    condimentum, nec posuere neque lacinia.</p>

                                                <p>Morbi sed ligula sed nulla vulputate congue. Nunc consequat dolor
                                                    nulla, ac iaculis elit tincidunt vitae. Pellentesque habitant morbi
                                                    tristique senectus et netus et malesuada fames ac turpis egestas.
                                                    Curabitur justo turpis, sodales sit amet posuere et, volutpat sed
                                                    purus. Etiam bibendum ultrices enim sit amet volutpat. Praesent ut
                                                    vestibulum felis. Vestibulum at massa in erat aliquam venenatis.</p>

                                                <p>Quisque condimentum nulla et velit fermentum scelerisque. Nullam
                                                    placerat risus sit amet eros tincidunt, in laoreet leo mollis.
                                                    Curabitur ut volutpat purus, in tempus erat. Suspendisse nec metus
                                                    non lacus volutpat euismod et quis mauris. Nullam nisi quam, commodo
                                                    quis tristique vel, semper pellentesque tortor. Nulla lacus orci,
                                                    pellentesque non tempus non, molestie eu erat. Ut imperdiet nisl at
                                                    sem mollis, nec consectetur turpis posuere. Nam facilisis quis leo
                                                    in iaculis. Nunc interdum id enim et fringilla. Mauris pretium est
                                                    sem, nec eleifend nulla interdum luctus.</p>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                                                    ante
                                                    nunc, mollis sit amet aliquam auctor, varius vel sem. Duis sit amet
                                                    tortor maximus, egestas arcu iaculis, volutpat elit. Vivamus
                                                    consequat
                                                    ante in dui hendrerit, quis fringilla nulla interdum. Etiam non
                                                    interdum
                                                    sem. Nunc eget libero nisi. Fusce varius convallis lacus vel
                                                    venenatis.
                                                    Ut laoreet lorem sit amet nisi aliquam, ut posuere mi rutrum. Ut in
                                                    justo ante. Nulla ante massa, suscipit ac aliquam ac, molestie sit
                                                    amet
                                                    massa.</p>

                                                <p>Aliquam vitae tincidunt lorem. Duis pharetra mi vel ex convallis, et
                                                    gravida nibh aliquam. Proin rhoncus lobortis euismod. Mauris neque
                                                    quam, gravida quis lacus vel, porta euismod orci. Phasellus lobortis
                                                    sodales dolor nec hendrerit. Mauris ac pellentesque ante.
                                                    Suspendisse nec tristique dui. Quisque libero risus, scelerisque nec
                                                    interdum id, maximus ac lectus. Donec condimentum mollis magna.
                                                    Praesent vel eros ipsum. Suspendisse eleifend nunc non elit rhoncus,
                                                    ut faucibus felis aliquam. Aenean ullamcorper in velit eu porttitor.
                                                    Maecenas sit amet arcu odio.</p>

                                                <p>Ut accumsan eget mi vitae aliquet. Nam vel felis iaculis, condimentum
                                                    quam et, tristique diam. Curabitur tincidunt dignissim urna, vitae
                                                    viverra risus rhoncus et. Phasellus urna ante, ullamcorper in odio
                                                    eu, porttitor dapibus dolor. In ac leo tempus, dapibus purus rutrum,
                                                    porttitor dolor. Aenean accumsan suscipit urna, sed ullamcorper
                                                    risus. In hac habitasse platea dictumst. Pellentesque gravida
                                                    ultrices vulputate. Suspendisse id lobortis mauris. Nunc ullamcorper
                                                    libero ac iaculis auctor. Mauris feugiat lorem vitae quam
                                                    condimentum, nec posuere neque lacinia.</p>

                                                <p>Morbi sed ligula sed nulla vulputate congue. Nunc consequat dolor
                                                    nulla, ac iaculis elit tincidunt vitae. Pellentesque habitant morbi
                                                    tristique senectus et netus et malesuada fames ac turpis egestas.
                                                    Curabitur justo turpis, sodales sit amet posuere et, volutpat sed
                                                    purus. Etiam bibendum ultrices enim sit amet volutpat. Praesent ut
                                                    vestibulum felis. Vestibulum at massa in erat aliquam venenatis.</p>

                                                <p>Quisque condimentum nulla et velit fermentum scelerisque. Nullam
                                                    placerat risus sit amet eros tincidunt, in laoreet leo mollis.
                                                    Curabitur ut volutpat purus, in tempus erat. Suspendisse nec metus
                                                    non lacus volutpat euismod et quis mauris. Nullam nisi quam, commodo
                                                    quis tristique vel, semper pellentesque tortor. Nulla lacus orci,
                                                    pellentesque non tempus non, molestie eu erat. Ut imperdiet nisl at
                                                    sem mollis, nec consectetur turpis posuere. Nam facilisis quis leo
                                                    in iaculis. Nunc interdum id enim et fringilla. Mauris pretium est
                                                    sem, nec eleifend nulla interdum luctus.</p>
                                            </div>
                                        </div>

                                    </div>,
                                    <div key="tab2content">
                                        <div className="list">
                                            <ul>
                                                { do { for (var ret = [], ii = 1, countii = this.entities.length / 2; ii <= countii; ii++ )
                                                    ret.push(<li key={"li1" + ii}>{ii}. {this.entities[ii-1]}</li>);
                                                ret }}
                                            </ul>
                                        </div>
                                        <div className="list">
                                            <ul>
                                                { do { for (var ret = [], countii = this.entities.length, ii = countii / 2 + 1; ii <= countii; ii++ )
                                                    ret.push(<li key={"li2" + ii}>{ii}. {this.entities[ii-1]}</li>);
                                                ret }}
                                            </ul>
                                        </div>
                                    </div>
                                ]
                            }
                        </Tabs>
                    </Popup>
                }
            </div>;
    }


    _onRaSClick(ee)
    {
        ee.preventDefault();
        const body = $('body');

        this.setState({...this.state, currentScrollPos: body.scrollTop(), isPopupVisible: true});

        body.addClass('blocked'); //убираем скрол
/*
        var contentHtml = $("[data-js-rules]").html();


        // contentHtml.find('[data-js-entities]').html();

        new Popup({
            render: true,
            vars: {
                contentHtml: contentHtml,
            },
            afterInit: (that, context) => (new tabsClass).apply(context),
	    });*/
    }



    _onClose()
    {
		$('body').removeClass('blocked').scrollTop(this.state.currentScrollPos); //возвращаем скрол и ставим на предыдущую позицию

		this.setState({...this.state, isPopupVisible: false})
    }
}