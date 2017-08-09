/**
 * Created by Htmlbook on 16.05.2017.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import mainMenuActions from '../actions/mainMenuActions';
import MenuItemsList from '../components/MainMenu/MenuItemsList';
import GlobalCloseClass from '../common/GlobalClose.ts';

class MainMenu extends React.Component
{
	componentDidMount()
	{
		this.globalClick = (new GlobalCloseClass({element: this.menu,
			customCloseFunction: this.props.actions.showHideSubMenu.bind(null, false),
			defaultClose: false,
			actionDelay: 0}));
	}

	componentDidUpdate(prevProps)
	{
		if(this.props.showSubmenu && !prevProps.showSubmenu) this.globalClick.bindGlobalClick();
	}


	render()
	{
		// const { Exchanges: exchanges, Menu: categoryMenu } = appData.menuData;
		const { actions, activeCat, menuData: { Exchanges: exchanges, Menu: categoryMenu }, currentData, showSubmenu } = this.props;

		// categoryMenu.forEach(function (item) {console.log('CatName:', item.CatName);})
		// onMouseLeave={actions.showHideSubMenu.bind(null, false)}
		return <div className={classnames('nav_bet', {opened: showSubmenu})} ref={(menu) => this.menu = menu}>
			{
				showSubmenu &&
				<CSSTransitionGroup
					component="div"
					transitionName={{
							appear: 'fadeInLeft',
						enter : 'fadeInLeft',
						leave : 'fadeOutLeft'
					}}
					transitionAppear={true}
					transitionLeave={true}
					transitionAppearTimeout={300}
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
					// transitionAppearTimeout={5300}
					// transitionEnterTimeout={5300}
					// transitionLeaveTimeout={5300}
				>
					<MenuItemsList
						actions={actions}
						currentData={currentData}
						// categoryItems={categoryMenu.filter((subItem) => subItem.CatParentId === item.CatId)}
						categoryMenu={categoryMenu}
						exchanges={exchanges}
						key={currentData.CatId}
					/>
				</CSSTransitionGroup>
			}
			<ul className="root_menu">
				<li className="main live_event" onClick={actions.showHideSubMenu.bind(null, false)}>
					<span className="main">In-Play</span>
				</li>
				{
					((categoryMenu.filter((item) => item.CatParentId === '00000000-0000-0000-0000-000000000000'))
						.sort((a, b)=> a.CatPosition - b.CatPosition)).map((item) =>
						<li className={`main ${item.CatIcon}` + (activeCat === item.CatId && showSubmenu ? ' active' : '')}
							key={item.CatId}
							onClick={actions.getMenuCategory.bind(null, actions, {...item, activeCat: item.CatId})}>
							<span className="main">{item.CatName}</span>
						</li>
					)
				}
			</ul>
		</div>
	}
}

export default connect(state => ({
		...state.mainMenu,
	}),
	dispatch => ({
		actions: bindActionCreators(mainMenuActions, dispatch),
	})
)(MainMenu)