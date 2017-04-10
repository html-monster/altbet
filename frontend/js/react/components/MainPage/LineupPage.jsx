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
        const { className, exdata, data } = this.props;
        var date;


        return <div className={"l-lup " + className} data-js-team="">
                <div className="l-lup__rules"><a href="#" className="l-lup__link text_decoration" onClick={::this._onRaSClick}>Rules & scoring</a></div>
                <div className="l-team">
                    <div className="l-team__title">Arsenal (+27.1)</div>
                    <table className="l-team__team">
                        <tbody>
                            <tr>
                                <th>{}</th>
                                <th>Pos</th>
                                <th className="pl">Name</th>
                                <th>Status</th>
                                <th>FPPG</th>
                                <th>Score</th>
                                <th title="Estimated Time Remaining">ETR</th>
                            </tr>
                            {
                                data.team1.map((itm, key) =>
                                <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td className="pos">
                                        {itm.pos}
                                        <div className="b-pl-info">
                                            <div className="b-pl-info__main-inf">{`${exdata.HomeAlias} vs ${exdata.AwayAlias} ${((date = exdata.StartDate) ? date.unixToLocalDate({format: 'h:mm a MMM DD, Y'}) : "")}`}</div>
                                            <div className="b-pl-info__statistic">{itm.plInfo.action}</div>
                                        </div>
                                    </td>
                                    <td className="pl"><strong>{itm.name} ({itm.team.toUpperCase()})</strong></td><td>{itm.status}</td><td>{itm.fppg}</td><td><strong>{itm.score}</strong></td>
                                    <td title="Estimated Time Remaining">{moment(moment(itm.timeEnd).diff(Date.now())).format("HH:mm")}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
                <div className="l-team">
                    <div className="l-team__title">Chelsea (-27.1)</div>
                    <table className="l-team__team">
                        <tbody>
                            <tr>
                                <th>{}</th>
                                <th>Pos</th>
                                <th className="pl">Name</th>
                                <th>Status</th>
                                <th>FPPG</th>
                                <th>Score</th>
                                <th title="Estimated Time Remaining">ETR</th>
                            </tr>
                            {
                                data.team2.map((itm, key) => <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td className="pos">
                                        {itm.pos}
                                        <div className="b-pl-info">
                                            <div className="b-pl-info__main-inf">{`${exdata.HomeAlias} vs ${exdata.AwayAlias} ${((date = exdata.StartDate) ? date.unixToLocalDate({format: 'h:mm a MMM DD, Y'}) : "")}`}</div>
                                            <div className="b-pl-info__statistic">{itm.plInfo.action}</div>
                                        </div>
                                    </td>
                                    <td className="pl"><strong>{itm.name} ({itm.team.toUpperCase()})</strong></td><td>{itm.status}</td><td>{itm.fppg}</td><td><strong>{itm.score}</strong></td>
                                    <td title="Estimated Time Remaining">{moment(moment(itm.timeEnd).diff(Date.now())).format("HH:mm")}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>

                <div className="b-clear">{}</div>
                <div className="l-team">
                    <div className="l-team__total">
                        Total score: <b>{data.t1TotScore}</b><br />
                        Difference: <b>{data.t1Diff}</b>
                    </div>
                </div>
                <div className="l-team">
                    <div className="l-team__total">
                        Total score: <b>{data.t2TotScore}</b><br />
                        Difference: <b>{data.t2Diff}</b>
                    </div>
                </div>
                <div className="b-clear">{}</div>

                { this.state.isPopupVisible &&
                    <Popup closeFunc={::this._onClose}>
                        <Tabs className="h-rns" tabsClass="h-tab1">
                            {
                                [
                                    "Info",
                                    "Entities",
                                    <div key="tab1content" className="page_wrapper">
                                        <h1>Terms and Conditions</h1>

                                        <p>
                                            If you have any questions or concerns take a look at our <a href="faq.html">
                                            frequently asked
                                            questions
                                        </a>
                                            or get in touch with us.
                                        </p>
                                        <ul className="page_content_plan">
                                            <li>
                                                <a href="#introduction">
                                                    <strong>1. Introduction</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#account">
                                                    <strong>2. Account Rules</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#inactive">
                                                    <strong>3. Inactive Accounts</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#deposits">
                                                    <strong>4. Deposits, Transfers and Withdrawals</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#betting">
                                                    <strong>5. Betting Rules</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#currency">
                                                    <strong>6. Multi-currency</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#usage">
                                                    <strong>7. Data Usage</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#responsible">
                                                    <strong>8. Responsible Gaming</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#copyrights">
                                                    <strong>9. Copyrights</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#liability">
                                                    <strong>10.Liability</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#privacy">
                                                    <strong>11.Privacy Policy</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#difficulties">
                                                    <strong>12.Technical Difficulties</strong>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#complaints">
                                                    <strong>13.Complaints</strong>
                                                </a>
                                            </li>
                                        </ul>

                                        <div id="introduction">
                                            <h2>Introduction</h2>
                                            <p>
                                                <strong>alt.bet</strong> Exchange B.V is a company registered on the 6 May 2016 under the
                                                laws of
                                                Curacao; Registration
                                                number: 140039; Registered address: Xecutive Corporate Management B.V., Orionweg 10C,
                                                Willemstad, Curacao. <strong>alt.bet</strong> Exchange B.V is trading
                                                under the name
                                                <strong>alt.bet</strong>. Accordingly any reference to <strong>alt.bet</strong> shall be
                                                construed as
                                                constituting a reference to <strong>alt.bet</strong>
                                                Exchange B.V.
                                            </p>
                                            <p>
                                                <strong>alt.bet</strong> Exchange B.V was granted a 8048/JAZ2016-034license by Antelliphone,
                                                NV(8048.JAZ) The Curacao Gaming
                                                Authority is responsible for the regulation of this license. Date of Issuance.08/9/2016.
                                                Valid through
                                                06/14/2017.
                                            </p>

                                            <p>
                                                The <strong>alt.bet</strong> platform is designed and maintained by <strong>alt.bet</strong>
                                                Exchange
                                                B.V.
                                            </p>

                                            <p>
                                                The contractual relationship between the registered user (known as an ‘account holder’,
                                                ‘you’, ‘your’,
                                                ‘customer’, or ‘client’) and <strong>alt.bet</strong> is governed by this document (the
                                                ‘terms and
                                                conditions’) and by the
                                                Laws of Curacao.
                                            </p>

                                            <p>
                                                Each person is required to accept these terms and conditions when registering for an account
                                                with
                                                <strong>alt.bet</strong>
                                                and is bound by them throughout the existence of the relationship.
                                            </p>

                                            <p>
                                                <strong>alt.bet</strong> reserves the right to change these terms and conditions including
                                                any of the
                                                Betting Rules at any
                                                time.
                                            </p>

                                            <p>
                                                Any changes in Terms and Conditions made by <strong>alt.bet</strong> will notified to the
                                                customer in
                                                advance or at the
                                                earliest, reasonable opportunity. You reserve the right to accept and proceed, or decline
                                                and stop using
                                                <strong>alt.bet</strong> services upon notification of any changes.
                                            </p>

                                            <p>
                                                Should you, due to any possible changes to the terms and conditions, not wish to continue
                                                using the
                                                services
                                                of <strong>alt.bet</strong> anymore, you must withdraw all available funds and close the
                                                account at the
                                                earliest opportunity.
                                            </p>

                                            <p>
                                                In the case of any conflict between the English language version of the terms and conditions
                                                and
                                                versions in
                                                other languages, the English language version shall prevail.
                                            </p>

                                            <p>
                                                If you require clarification of any of the terms and conditions, rules or settlement then
                                                please contact
                                                support through either; <a href="mailTo:support@alt.bet">support@alt.bet</a>, by using the
                                                live chat on
                                                site, or by email <a href="mailTo:support@alt.bet">support@alt.bet</a>.
                                            </p>
                                        </div>

                                        <div id="account">
                                            <h2>Account Rules </h2>
                                            <p>
                                                Any account holder applying for an account must be at least eighteen years old. There may be
                                                some
                                                jurisdictions in which the minimum legal age for participation in gambling activities is
                                                higher than
                                                eighteen. It is solely your responsibility to comply with such requirements in your
                                                jurisdiction.
                                            </p>

                                            <p>
                                                Persons who are residents of; or persons who are located in countries where real money
                                                betting with
                                                <strong>alt.bet</strong>
                                                is prohibited (including, but not necessarily limited to France, The United Kingdom, the
                                                United States,
                                                Italy, Portugal; cannot register as account holders with blt.bet United States residents
                                                cannot register
                                                an
                                                account for real money betting with <strong>alt.bet</strong>, even if they are located in
                                                another
                                                jurisdiction. <strong>alt.bet</strong> may
                                                refuse access to its services from any particular jurisdiction, at any time.
                                            </p>

                                            <p>
                                                The account holders of <strong>alt.bet</strong> agree to abide by these terms and conditions
                                                at all
                                                times:
                                            </p>

                                            <p> Not acting in the interests of any third party;</p>

                                            <p> Not utilizing funds originating from any criminal or illegal activity or activities;</p>

                                            <p> Not utilizing bank accounts, debit cards, credit cards they are not authorized to use;</p>

                                            <p> Not going to attempt to gain unauthorized access to the website or alter its software in any
                                                way;</p>

                                            <p>
                                                Not going to take part in or organize any criminal actions against <strong>alt.bet</strong>,
                                                its
                                                affiliates,
                                                and its account
                                                holders.
                                            </p>

                                            <p>
                                                You are prohibited from selling, transferring and/or acquiring accounts for or from other
                                                account
                                                holders.
                                            </p>

                                            <p>
                                                You must not collude with other players or in any way distort normal game play. In the event
                                                that you
                                                breach
                                                any provision in these terms and conditions, <strong>alt.bet</strong> reserves the right to
                                                close your
                                                account and may
                                                confiscate any available funds. In certain cases, where required by law, such funds shall be
                                                forfeited
                                                to
                                                the CGA.
                                            </p>

                                            <p>
                                                It is your responsibility to verify that when opening an account and conducting business
                                                with <strong>alt.bet</strong>
                                                you
                                                are not breaching any applicable laws in your jurisdiction. You must submit the correct
                                                information
                                                during
                                                your registration. This information should include, but is not limited to; your full name as
                                                per your
                                                official identification documents, your full and current residential address, personal
                                                telephone number
                                                and/or email address as required. You also agree to update this information at the earliest
                                                and most
                                                reasonable opportunity should there be any changes to the personal data that you have
                                                provided.
                                            </p>

                                            <p> You may only open and maintain one account, and you must open this account personally.</p>

                                            <p>
                                                <strong>alt.bet</strong> may, at its own discretion and without having to provide any
                                                justification,
                                                refuse
                                                to open an
                                                account or close an existing account, including but not limited when we have reasonable
                                                suspicion that
                                                any
                                                account is traced to the same address, IP address or computer. We may also freeze any
                                                winnings on such
                                                accounts. Any existing contractual obligations will be honored, except in the cases where we
                                                suspect
                                                that
                                                the accounts are connected to under age gambling and/or involved in criminal acts, including
                                                money
                                                laundering.
                                            </p>

                                            <p> All accounts are opened in and all transactions are made in US$.</p>

                                            <p>
                                                Account holders shall not treat <strong>alt.bet</strong> as a financial institution. No
                                                interest is paid
                                                on
                                                any funds,
                                                irrespective of the amount, held in your account.
                                            </p>

                                            <p>
                                                If you reside in a jurisdiction where winnings are taxable, it will be your own
                                                responsibility to keep
                                                track
                                                of those winnings and report them to the proper authorities.
                                            </p>
                                            <p>
                                                During the registration process you will be able to choose your login email and password.
                                                You can change
                                                this password at any time.
                                            </p>
                                            <p>
                                                You must keep your login credentials secret at all times, and you remain solely responsible
                                                for the
                                                security
                                                and confidentiality of your account.
                                            </p>
                                            <p>
                                                If you use third party applications to connect to <strong>alt.bet</strong> you are aware
                                                that this may
                                                not
                                                display full
                                                information about the account or betting activity.
                                            </p>

                                            <p>
                                                If a bet is placed using your username and password, the bet will be considered to have been
                                                made by you
                                                and
                                                therefore once accepted by us, it shall be considered valid.
                                            </p>

                                            <p>
                                                <strong>alt.bet</strong> retains the right to examine and confirm your identity. When deemed
                                                necessary,
                                                <strong>alt.bet</strong> will request
                                                that documentation proving your identity and residency is forwarded to its offices. Examples
                                                of
                                                documentation requested could be certified copies of photo identification cards, bank
                                                statements,
                                                references, last utility bill or photocopy of credit card. In the event that you do not
                                                provide us with
                                                sufficient identification information, in accordance with <strong>alt.bet</strong> internal
                                                procedures
                                                or
                                                those required by
                                                regulatory authorities, <strong>alt.bet</strong> may suspend the account and all account
                                                functionality,
                                                including but not
                                                limited to bet management and withdrawal of funds or close the account.
                                            </p>

                                            <p>
                                                <strong>alt.bet</strong> retains the right to make any queries regarding the source of any
                                                funds
                                                deposited
                                                with <strong>alt.bet</strong>.
                                                Should you fail to provide satisfactory responses to our queries, <strong>alt.bet</strong>
                                                may suspend
                                                the
                                                account and all
                                                account functionality, including but not limited to bet management and withdrawal of funds
                                                or close the
                                                account. <strong>alt.bet</strong> may pass on such information, as it deems necessary to the
                                                relevant
                                                authorities.
                                            </p>

                                            <p>
                                                You may close your account, at any time, by withdrawing all funds and emailing us at <a
                                                href="mailTo:support@alt.bet">support@alt.bet</a>
                                            </p>

                                            <p>
                                                Following termination, suspension or exclusion of your account, <strong>alt.bet</strong>
                                                will, in the
                                                normal
                                                course of
                                                business, return any funds in your account and again following the settlement of any open
                                                bets. We do,
                                                however, reserve the right to withhold the funds in your account from you pending the result
                                                of any
                                                investigation where:
                                            </p>

                                            <p>
                                                i. We suspect you have acted in breach of these Terms, including where we suspect the
                                                account has been
                                                linked with fraudulent or dishonest activity; and/or
                                            </p>

                                            <p>
                                                ii. We have to withhold the funds in your account by law or to comply with any advice,
                                                request or
                                                instruction from any governmental, regulatory or enforcement authority.
                                            </p>

                                            <p>
                                                Following the result of any such investigation we reserve the right to seize some or all of
                                                the funds in
                                                your account if we are satisfied that you have acted in breach of these Terms or any other
                                                relevant
                                                agreement on site such as the betting rules.
                                            </p>
                                        </div>

                                    </div>,
                                    <div key="tab2content">
                                        <div className="list">
                                            <ul>
                                                {
                                                    function () { for (var ret = [], ii = 1, countii = this.entities.length / 2; ii <= countii; ii++ )
                                                        ret.push(<li key={"li1" + ii}>{ii}. {this.entities[ii-1]}</li>);
                                                    return ret; }.bind(this)()
                                                }
                                            </ul>
                                        </div>
                                        <div className="list">
                                            <ul>
                                                {
                                                    function () { for (var ret = [], countii = this.entities.length, ii = countii / 2 + 1; ii <= countii; ii++ )
                                                        ret.push(<li key={"li2" + ii}>{ii}. {this.entities[ii-1]}</li>);
                                                    return ret; }.bind(this)()
                                                }
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

        this.setState({...this.state, isPopupVisible: true})
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
        this.setState({...this.state, isPopupVisible: false})
    }
}