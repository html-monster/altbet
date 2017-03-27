/**
 * Created by Htmlbook on 27.01.2017.
 */

import {
	TRADER_ON_SOCKET_MESSAGE,
	TRADER_ON_EXCHANGE_CHANGE,
	TRADER_ON_QUANTITY_CHANGE,
	TRADER_ON_SPREAD_CHANGE,
	TRADER_ON_ADD_ORDER,
	TRADER_ON_DELETE_ORDER,
	TRADER_ON_SPREAD_HIGHLIGHT,
	TRADER_ON_DRAG
} from '../../../constants/ActionTypesActiveTrader';
import {RebuildServerData} from '../../../actions/Sidebar/tradeSlip/activeTrader/rebuildServerData';

const initialState = {
	data: {},
	dragPrevPrice: 0,
	isMirror: 0,
	rebuiltServerData:[],
	spread: '',
	spreadHighLight: [],
	quantity: '',
	orderInfo: {
		activeString: null,
		direction: null,
		limit: true,
		price: null,
		showSpreadOrder: false,
		showDefaultOrder: false,
		showDirectionConfirm: false
	},
};
let price = 0.99;
for(let ii = 1; ii <= 99; ii++)
{
	initialState.rebuiltServerData.push(new RebuildServerData({price, data: initialState.data}));
	price = Math.round10(price - 0.01, -2);
}

export default function activeTrader(state = initialState, action)
{
	let orderInfo;
	switch (action.type)
	{
		case TRADER_ON_QUANTITY_CHANGE:
			return {...state, quantity: action.payload};

		case TRADER_ON_SPREAD_CHANGE:
			return {...state, spread: action.payload};

		case TRADER_ON_SOCKET_MESSAGE:
			return {...state, data: action.payload.data, rebuiltServerData: action.payload.rebuiltServerData };

		case TRADER_ON_EXCHANGE_CHANGE:
			let newState = Object.assign(state, action.payload);
			return {...newState};

		case TRADER_ON_ADD_ORDER:
			orderInfo = Object.assign(state.orderInfo, {...action.payload});
			return {...state, orderInfo: {...orderInfo} };

		case TRADER_ON_DELETE_ORDER:
			orderInfo = Object.assign(state.orderInfo, {...action.payload});
			return {...state, orderInfo: {...orderInfo}};

		case TRADER_ON_SPREAD_HIGHLIGHT:
			return {...state, spreadHighLight: action.payload};

		case TRADER_ON_DRAG:
			return {...state, ...action.payload};

		default:
			return state
	}

}

/*
document.onmousedown = function(e) {

	var dragElement = e.target;

	if (!dragElement.classList.contains('draggable')) return;

	var coords, shiftX, shiftY;

	startDrag(e.clientX, e.clientY);

	document.onmousemove = function(e) {
		moveAt(e.clientX, e.clientY);
	};

	dragElement.onmouseup = function() {
		finishDrag();
	};


	// -------------------------

	function startDrag(clientX, clientY) {

		shiftX = clientX - dragElement.getBoundingClientRect().left;
		shiftY = clientY - dragElement.getBoundingClientRect().top;

		dragElement.style.position = 'fixed';

		document.body.appendChild(dragElement);

		moveAt(clientX, clientY);
	};

	function finishDrag() {
		// конец переноса, перейти от fixed к absolute-координатам
		dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		dragElement.style.position = 'absolute';

		document.onmousemove = null;
		dragElement.onmouseup = null;
	}

	function moveAt(clientX, clientY) {
		// новые координаты
		var newX = clientX - shiftX;
		var newY = clientY - shiftY;

		// ------- обработаем вынос за нижнюю границу окна ------
		// новая нижняя граница элемента
		var newBottom = newY + dragElement.offsetHeight;

		// если новая нижняя граница вылезает вовне окна - проскроллим его
		if (newBottom > document.documentElement.clientHeight) {
			// координата нижней границы документа относительно окна
			var docBottom = document.documentElement.getBoundingClientRect().bottom;

			// scrollBy, если его не ограничить - может заскроллить за текущую границу документа
			// обычно скроллим на 10px
			// но если расстояние от newBottom до docBottom меньше, то меньше
			var scrollY = Math.min(docBottom - newBottom, 10);

			// ошибки округления при полностью прокрученной странице
			// могут привести к отрицательному scrollY, что будет означать прокрутку вверх
			// поправим эту ошибку
			if (scrollY < 0) scrollY = 0;

			window.scrollBy(0, scrollY);

			// резким движением мыши элемент можно сдвинуть сильно вниз
			// если он вышел за нижнюю границу документа -
			// передвигаем на максимально возможную нижнюю позицию внутри документа
			newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
		}


		// ------- обработаем вынос за верхнюю границу окна ------
		if (newY < 0) {
			// проскроллим вверх на 10px, либо меньше, если мы и так в самом верху
			var scrollY = Math.min(-newY, 10);
			if (scrollY < 0) scrollY = 0; // поправим ошибку округления

			window.scrollBy(0, -scrollY);
			// при резком движении мыши элемент мог "вылететь" сильно вверх, поправим его
			newY = Math.max(newY, 0);
		}


		// зажать в границах экрана по горизонтали
		// здесь прокрутки нет, всё просто
		if (newX < 0) newX = 0;
		if (newX > document.documentElement.clientWidth - dragElement.offsetHeight) {
			newX = document.documentElement.clientWidth - dragElement.offsetHeight;
		}

		dragElement.style.left = newX + 'px';
		dragElement.style.top = newY + 'px';
	}

	// отменим действие по умолчанию на mousedown (выделение текста, оно лишнее)
	return false;
}*/
