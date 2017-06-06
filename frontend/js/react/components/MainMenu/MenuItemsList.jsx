/**
 * Created by Htmlbook on 16.05.2017.
 */
import React from 'react';

export default class MenuItemsList extends React.Component
{
	constructor()
	{
		super();
	}

	render()
	{
		const { actions, categoryMenu, exchanges, currentData, } = this.props;

		// categoryMenu.forEach(function (item) {console.log('CatName:', item.CatName);})
		// console.log('categoryItems:', categoryItems);
		let linkAnchor = `${currentData.CatName}`;
		let maxLetters, windowWidth = $(window).width();
		let parentCategory = (categoryMenu.filter((item) => currentData.CatParentId === item.CatId));
		if(parentCategory.length) parentCategory = parentCategory[0];
		const isRootCategory = currentData.CatParentId === '00000000-0000-0000-0000-000000000000';

		if(windowWidth > 1900) maxLetters = isRootCategory ? 35 : 32;
		else if(windowWidth > 1590) maxLetters = isRootCategory ? 26 : 24;
		else maxLetters = isRootCategory ? 22 : 20;

		return <ul className="active animated dur3 child_list lv0">
			<li>
				{	!isRootCategory &&
					<button className="return" title={`Return to ${parentCategory.CatName}`}
							onClick={actions.getMenuCategory.bind(null, actions, parentCategory)}>{}</button>
				}
				<a href={`${ABpp.baseUrl}/eng/home/${currentData.CatUrlChain}`} className="showAll" title={'Show all ' + linkAnchor}
					style={!isRootCategory ? {paddingLeft: 15} : {}}>
					{
						linkAnchor.length > maxLetters ? linkAnchor.slice(0, maxLetters - 2) + '...' : linkAnchor
					}
				</a>
			</li>
			{
				exchanges.some((item) => currentData.CatId === item.CategoryId) ?
					(exchanges.filter((item) => item.CategoryId === currentData.CatId)).map((item) =>
						<li key={item.ExchangeUrl}>
							<a href={`${ABpp.baseUrl}/eng/event/${item.CategoryUrl}?exchange=${item.ExchangeUrl}`}>{(item.FullName).replace('_vs_', ' - ')}</a>
						</li>
					)
					:
					((categoryMenu.filter((item) => item.CatParentId === currentData.CatId)).sort((a, b) => a.CatPosition - b.CatPosition)).map((item) =>
						<li key={item.CatId} onClick={actions.getMenuCategory.bind(null, actions, item)}>
							<span>{item.CatName}</span>
						</li>
					)
			}
		</ul>
	}
}



