/**
 * Created by Htmlbook on 22.12.2016.
 */
/// <reference path="../../../.d/common.d.ts" />

import {
	ON_YOUR_ORDER_SOCKET_MESSAGE,
	ON_YOUR_ORDER_DELETE,
    ON_YOUR_ORDER_GROUP_INDEX,
} from "../../constants/ActionTypesYourOrders";
import BaseActions from '../BaseActions';
// import { orderForm } from '../../components/formValidation/validation';

class Actions extends BaseActions
{
	public actionOnSocketMessage(actions)
	{
		return (dispatch, getState) =>
		{
			window.ee.addListener('yourOrders.update', (newData) =>
			{
				const state = getState().yourOrders;
				// console.log(JSON.stringify(getState().yourOrders.yourOrders));
				// console.log('========');
				// console.log(JSON.stringify(newData));
				// console.log(JSON.stringify(getState().yourOrders.yourOrders) != JSON.stringify(newData));
				// console.log(defaultMethods.deepCompare(newData, getState().yourOrders.yourOrders));
				// if(defaultMethods.deepCompare(newData, getState().yourOrders.yourOrders)){
				if(JSON.stringify(state.yourOrdersData) != JSON.stringify(newData)){
					dispatch({
						type: ON_YOUR_ORDER_SOCKET_MESSAGE,
						payload: newData
					});
                    if(state.openGroupIndex !== 0) actions.collapseOrderGroup(0);
					__DEV__ && console.log('re-render');
				}
			});
		}
		let aaa = [{"ExtensionData":{},"ID":"IMUN-SARS-HC-8132017_IMUN-SARS-HC_USD","LastPrice":0.5,"LastSide":0,"Orders":[{"ExtensionData":{},"Category":"Fantasy Sport","ID":"54aca2b4-0992-4b5a-9d21-daaf224b69ec","Price":0.5,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-HC-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":0,"Name":"IMUN-SARS-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[{"ExtensionData":{},"Date":"/Date(1502463863009)/","ID":"83d3dbdf-17a3-4cdd-a5d4-fd678b9125f8","Price":0.5,"Quantity":1}],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-hc-8132017"},"Time":"/Date(1502463868495)/","Volume":1,"isMirror":0,"isPosition":1},{"ExtensionData":{},"Category":"Fantasy Sport","ID":"7eeead43-a209-41ee-8dbd-30326aa0ea90","Price":0.5,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-HC-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":0,"Name":"IMUN-SARS-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[{"ExtensionData":{},"Date":"/Date(1502463863009)/","ID":"83d3dbdf-17a3-4cdd-a5d4-fd678b9125f8","Price":0.5,"Quantity":1}],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-hc-8132017"},"Time":"/Date(1502463868493)/","Volume":2,"isMirror":0,"isPosition":0}],"Positions":1,"Symbol":"Team Ibrahimovic, MUN"},{"ExtensionData":{},"ID":"IMUN-SARS-OU-8132017_IMUN-SARS-OU_USD","LastPrice":0.5,"LastSide":1,"Orders":[{"ExtensionData":{},"Category":"Fantasy Sport","ID":"824eca1a-5340-436e-9de8-b456742587a4","Price":0.5,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-OU-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"IMUN-SARS-OU","OptionExchange":2,"PriceChangeDirection":1,"ResultExchange":"OU","SettlementDate":null,"SortingData":[{"ExtensionData":{},"Date":"/Date(1502463843827)/","ID":"57916d29-e0fa-4eb8-bff1-016aeadb48bc","Price":0.5,"Quantity":2}],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ou-8132017"},"Time":"/Date(1502463821519)/","Volume":3,"isMirror":0,"isPosition":0},{"ExtensionData":{},"Category":"Fantasy Sport","ID":"5c2ce0b1-1596-4be2-a9f3-44659e3a674b","Price":0.5,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-OU-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"IMUN-SARS-OU","OptionExchange":2,"PriceChangeDirection":1,"ResultExchange":"OU","SettlementDate":null,"SortingData":[{"ExtensionData":{},"Date":"/Date(1502463843827)/","ID":"57916d29-e0fa-4eb8-bff1-016aeadb48bc","Price":0.5,"Quantity":2}],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ou-8132017"},"Time":"/Date(1502457226800)/","Volume":1,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Ibrahimovic, MUN"},{"ExtensionData":{},"ID":"IMUN-SARS-ML-8132017_IMUN-SARS-ML_USD","LastPrice":0,"LastSide":null,"Orders":[{"ExtensionData":{},"Category":"Fantasy Sport","ID":"d2920fc5-e17f-48df-9a50-03ee02de3101","Price":0.75,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-ML-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.75,"LastPrice":0,"LastSide":null,"Name":"IMUN-SARS-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ml-8132017"},"Time":"/Date(1502463435498)/","Volume":2,"isMirror":0,"isPosition":0},{"ExtensionData":{},"Category":"Fantasy Sport","ID":"79cb8601-7b53-4a14-93e5-0fe39dd74aa0","Price":0.75,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-ML-8132017","FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.75,"LastPrice":0,"LastSide":null,"Name":"IMUN-SARS-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502629200000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ml-8132017"},"Time":"/Date(1502457167783)/","Volume":2,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Ibrahimovic, MUN"},{"ExtensionData":{},"ID":"CSD-QCHI-ML-8122017_CSD-QCHI-ML_USD","LastPrice":0,"LastSide":null,"Orders":[{"ExtensionData":{},"Category":"Fantasy Sport","ID":"9411cef5-21ac-4305-9c60-4487159d15fb","Price":0.3,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"CHI","AwayHandicap":12.5,"AwayName":"Team Quintana, CHI","AwayPoints":36.1,"AwayTeamId":null,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"CSD-QCHI-ML-8122017","FullName":"Team Cahill, SD_vs_Team Quintana, CHI","HomeAlias":"SD","HomeHandicap":-12.5,"HomeName":"Team Cahill, SD","HomePoints":31.1,"HomeTeamId":null,"LastAsk":1,"LastBid":0.3,"LastPrice":0,"LastSide":null,"Name":"CSD-QCHI-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1499130600000)/","StartDateStr":null,"Status":1,"StatusEvent":"live","TypeEvent":1,"UrlExchange":"team-cahill-sd-vs-team-quintana-chi-ml-742017"},"Time":"/Date(1502462085622)/","Volume":3,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Cahill, SD"},{"ExtensionData":{},"ID":"HHOU-LSA-HC-8122017_HHOU-LSA-HC_USD","LastPrice":0.5,"LastSide":1,"Orders":[{"ExtensionData":{},"Category":"Fantasy Sport","ID":"55cb9e59-96f3-4ce2-a29c-7dabccc6162e","Price":0.5,"Side":0,"Symbol":{"ExtensionData":{},"ApprovedDate":"/Date(1493894217787)/","AwayAlias":"SA","AwayHandicap":17.1,"AwayName":"Team Leonard, SA","AwayPoints":149.3,"AwayTeamId":null,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"HHOU-LSA-HC-8122017","FullName":"Team Harden, HOU_vs_Team Leonard, SA","HomeAlias":"HOU","HomeHandicap":-17.1,"HomeName":"Team Harden, HOU","HomePoints":151.3,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"HHOU-LSA-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502578800000)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-harden-hou-vs-team-leonard-sa-hc-8122017"},"Time":"/Date(1502445299173)/","Volume":1,"isMirror":0,"isPosition":1}],"Positions":1,"Symbol":"Team Harden, HOU"}]
		let bbb = [{"ID":"IMUN-SARS-HC-8132017_IMUN-SARS-HC_USD","LastPrice":0.5,"LastSide":0,"LimitUserData":{"CurrentEntryBalance":1.5,"EntryLimit":100,"SymbolName":"IMUN-SARS-HC"},"Orders":[{"Category":"Fantasy Sport","ID":"54aca2b4-0992-4b5a-9d21-daaf224b69ec","Price":0.5,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-HC-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":0,"Name":"IMUN-SARS-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[{"Date":"/Date(1502463863009)/","ID":"83d3dbdf-17a3-4cdd-a5d4-fd678b9125f8","Price":0.5,"Quantity":1}],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-hc-8132017"},"Time":"/Date(1502463868495)/","Volume":1,"isMirror":0,"isPosition":1},{"Category":"Fantasy Sport","ID":"7eeead43-a209-41ee-8dbd-30326aa0ea90","Price":0.5,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-HC-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":0,"Name":"IMUN-SARS-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[{"Date":"/Date(1502463863009)/","ID":"83d3dbdf-17a3-4cdd-a5d4-fd678b9125f8","Price":0.5,"Quantity":1}],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-hc-8132017"},"Time":"/Date(1502463868493)/","Volume":2,"isMirror":0,"isPosition":0}],"Positions":1,"Symbol":"Team Ibrahimovic, MUN"},{"ID":"IMUN-SARS-OU-8132017_IMUN-SARS-OU_USD","LastPrice":0.5,"LastSide":1,"LimitUserData":{"CurrentEntryBalance":2.5,"EntryLimit":100,"SymbolName":"IMUN-SARS-OU"},"Orders":[{"Category":"Fantasy Sport","ID":"824eca1a-5340-436e-9de8-b456742587a4","Price":0.5,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-OU-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"IMUN-SARS-OU","OptionExchange":2,"PriceChangeDirection":1,"ResultExchange":"OU","SettlementDate":null,"SortingData":[{"Date":"/Date(1502463843827)/","ID":"57916d29-e0fa-4eb8-bff1-016aeadb48bc","Price":0.5,"Quantity":2}],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ou-8132017"},"Time":"/Date(1502463821519)/","Volume":3,"isMirror":0,"isPosition":0},{"Category":"Fantasy Sport","ID":"5c2ce0b1-1596-4be2-a9f3-44659e3a674b","Price":0.5,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-OU-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"IMUN-SARS-OU","OptionExchange":2,"PriceChangeDirection":1,"ResultExchange":"OU","SettlementDate":null,"SortingData":[{"Date":"/Date(1502463843827)/","ID":"57916d29-e0fa-4eb8-bff1-016aeadb48bc","Price":0.5,"Quantity":2}],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ou-8132017"},"Time":"/Date(1502457226800)/","Volume":1,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Ibrahimovic, MUN"},{"ID":"IMUN-SARS-ML-8132017_IMUN-SARS-ML_USD","LastPrice":0,"LastSide":null,"LimitUserData":{"CurrentEntryBalance":1.5,"EntryLimit":100,"SymbolName":"IMUN-SARS-ML"},"Orders":[{"Category":"Fantasy Sport","ID":"d2920fc5-e17f-48df-9a50-03ee02de3101","Price":0.75,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-ML-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.75,"LastPrice":0,"LastSide":null,"Name":"IMUN-SARS-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ml-8132017"},"Time":"/Date(1502463435498)/","Volume":2,"isMirror":0,"isPosition":0},{"Category":"Fantasy Sport","ID":"79cb8601-7b53-4a14-93e5-0fe39dd74aa0","Price":0.75,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"ARS","AwayHandicap":5.5,"AwayName":"Team Sanchez, ARS","AwayPoints":30.1,"AwayTeamId":null,"CategoryId":"ff73369e-c374-455a-a9fb-afbdffcac949","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"IMUN-SARS-ML-8132017","ExchangeLimit":100,"FullName":"Team Ibrahimovic, MUN_vs_Team Sanchez, ARS","HomeAlias":"MUN","HomeHandicap":-5.5,"HomeName":"Team Ibrahimovic, MUN","HomePoints":29.4,"HomeTeamId":null,"LastAsk":1,"LastBid":0.75,"LastPrice":0,"LastSide":null,"Name":"IMUN-SARS-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502629200000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-ibrahimovic-mun-vs-team-sanchez-ars-ml-8132017"},"Time":"/Date(1502457167783)/","Volume":2,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Ibrahimovic, MUN"},{"ID":"CSD-QCHI-ML-8122017_CSD-QCHI-ML_USD","LastPrice":0,"LastSide":null,"LimitUserData":{"CurrentEntryBalance":1,"EntryLimit":100,"SymbolName":"CSD-QCHI-ML"},"Orders":[{"Category":"Fantasy Sport","ID":"9411cef5-21ac-4305-9c60-4487159d15fb","Price":0.3,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"CHI","AwayHandicap":12.5,"AwayName":"Team Quintana, CHI","AwayPoints":36.1,"AwayTeamId":null,"CategoryId":"27ce6e77-c184-4c6e-91e4-010c2b494e02","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"CSD-QCHI-ML-8122017","ExchangeLimit":100,"FullName":"Team Cahill, SD_vs_Team Quintana, CHI","HomeAlias":"SD","HomeHandicap":-12.5,"HomeName":"Team Cahill, SD","HomePoints":31.1,"HomeTeamId":null,"LastAsk":1,"LastBid":0.3,"LastPrice":0,"LastSide":null,"Name":"CSD-QCHI-ML","OptionExchange":1,"PriceChangeDirection":0,"ResultExchange":"ML","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1499130600000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"live","TypeEvent":1,"UrlExchange":"team-cahill-sd-vs-team-quintana-chi-ml-742017"},"Time":"/Date(1502462085622)/","Volume":3,"isMirror":0,"isPosition":0}],"Positions":0,"Symbol":"Team Cahill, SD"},{"ID":"HHOU-LSA-HC-8122017_HHOU-LSA-HC_USD","LastPrice":0.5,"LastSide":1,"LimitUserData":{"CurrentEntryBalance":0,"EntryLimit":100,"SymbolName":"HHOU-LSA-HC"},"Orders":[{"Category":"Fantasy Sport","ID":"55cb9e59-96f3-4ce2-a29c-7dabccc6162e","Price":0.5,"Side":0,"Symbol":{"ApprovedDate":"/Date(1493894217787+0300)/","AwayAlias":"SA","AwayHandicap":17.1,"AwayName":"Team Leonard, SA","AwayPoints":149.3,"AwayTeamId":null,"CategoryId":"433f9ebe-2309-47ff-bc28-0fb8bc9684f3","Currency":"USD","DelayTime":0,"EndDate":null,"EndDateStr":null,"EventId":null,"Exchange":"HHOU-LSA-HC-8122017","ExchangeLimit":100,"FullName":"Team Harden, HOU_vs_Team Leonard, SA","HomeAlias":"HOU","HomeHandicap":-17.1,"HomeName":"Team Harden, HOU","HomePoints":151.3,"HomeTeamId":null,"LastAsk":1,"LastBid":0.5,"LastPrice":0.5,"LastSide":1,"Name":"HHOU-LSA-HC","OptionExchange":0,"PriceChangeDirection":1,"ResultExchange":"HC","SettlementDate":null,"SortingData":[],"StartDate":"/Date(1502578800000+0300)/","StartDateStr":null,"Status":1,"StatusEvent":"scheduled","TypeEvent":1,"UrlExchange":"team-harden-hou-vs-team-leonard-sa-hc-8122017"},"Time":"/Date(1502445299173)/","Volume":1,"isMirror":0,"isPosition":1}],"Positions":1,"Symbol":"Team Harden, HOU"}]
	}

	public actionOrderDelete(order, indexGr)
	{
		return (dispatch, getState) =>
		{
			let orderId = order.ID;
			let newData = getState().yourOrders.yourOrdersData;

			newData[indexGr].Orders = newData[indexGr].Orders.filter((order) => order.ID !== orderId );
			if(!newData[indexGr].Orders.length) newData.splice(indexGr, 1);

			dispatch({
				type: ON_YOUR_ORDER_DELETE,
				payload: newData
			});
		}
	}

	public actionOrderDeleteAjax(context, event)
	{
		return () =>
		{
			event.preventDefault();
			const form = $(context.deleteForm);

			function BeforeAjax()
			{
				form.addClass('loading');
				form.find('[type=submit]').attr('disabled', 'true');
			}

			function onSuccessAjax(data)
			{
				data = data.split('_');
				let id = '#' + data[0] + '__order';

				if(data[1] === 'True'){
					console.log($(id).parents('.order_content').find('h3').text() + ' order is deleted');

					context.props.onDelete();
				}
				else{
					console.log($(id).parents('.order_content').find('h3').text() + ' order isn\'t deleted');
					form.find('[type=submit]').removeAttr('disabled');
					form.removeClass('loading');
					defaultMethods.showError('Server error, try again later');
				}
			}

			function onErrorAjax(x, y)
			{
				form.find('[type=submit]').removeAttr('disabled');
				form.removeClass('loading');
				__DEV__ && console.log('XMLHTTPRequest object: ', x);
				__DEV__ && console.log('textStatus: ',  y);
				defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
			}

			defaultMethods.sendAjaxRequest({
				httpMethod: 'POST',
				callback: onSuccessAjax,
				onError: onErrorAjax,
				beforeSend: BeforeAjax,
				url: ABpp.baseUrl + '/Order/Cancel',
				context: form});
		}
	}

	// public actionOnAjaxSend(formUrl, event)
	// {
	// 	return () =>
	// 	{
	// 		event.preventDefault();
    //
	// 		const form = event.currentTarget;
    //
	// 		// if(!orderForm(form)) return false;
    //
	// 		function OnBeginAjax()
	// 		{
	// 			$(form).find('[type=submit]').attr('disabled', 'true');
	// 		}
    //
	// 		function onSuccessAjax()
	// 		{
	// 			console.log('Order sending finished: ' + $(form).find('[name=ID]').val());
	// 		}
    //
	// 		function onErrorAjax()
	// 		{
	// 			$(form).find('[type=submit]').removeAttr('disabled');
	// 			defaultMethods.showError('The connection has been lost. Please check your internet connection or try again.');
	// 		}
    //
	// 		defaultMethods.sendAjaxRequest({
	// 			httpMethod: 'POST',
	// 			url: formUrl,
	// 			callback: onSuccessAjax,
	// 			onError: onErrorAjax,
	// 			beforeSend: OnBeginAjax,
	// 			context: $(form)
	// 		});
	// 	}
	// }

	// public actionOpenEditForm(id)
	// {
	// 	return () =>
	// 	{
	// 		id = `#${id}__order`;
	// 		const activeFirstTab = this._moveToElement(id, 'edit');
	// 		const scrollPos = $(id)[0].offsetTop + 150;
	// 		// console.log('1: ', scrollPos);
    //
	// 		if(this._checkOnLastElement(id)){
	// 			$(id).find('.form-container').slideToggle(200, ()=>{
	// 				if(activeFirstTab){
	// 					setTimeout(() => {
	// 						$('#current-orders').animate({scrollTop: scrollPos} , 200);
	// 					}, 450);
	// 				}
	// 				else
	// 					$('#current-orders').animate({scrollTop: scrollPos} , 200);
	// 			});
	// 		}
	// 		else{
	// 			setTimeout(() => {
	// 				$(id).find('.form-container').slideToggle(200);
	// 			}, 300);
	// 		}
	// 	}
	// }

    public collapseOrderGroup(index)
	{
        return (dispatch) =>
		{
            dispatch({
                type: ON_YOUR_ORDER_GROUP_INDEX,
                payload: index
            });
        }
    }

    /**
     * @param showPopup : boolean - show or hide popup
     * @param startDate : number || null - timestamp date when event starts
     * @param endDate : number || null - timestamp date when event starts
     * @param popupElement : string || Dom element - popup element, it can be order Id
     * @returns {() => any}
     */
	public actionDeleteFormToggle(showPopup, startDate, endDate, popupElement)
	{
		return () =>
		{
			if(showPopup)
			{
				const isEventStarted = moment().format('x') > startDate;
				const isEventFinished = moment().format('x') > endDate;

				if(!isEventStarted)
				{
					defaultMethods.showWarning('You can`t delete the order before the game starts');
					return;
				}

				if(endDate && isEventFinished)
				{
                    defaultMethods.showWarning('You can`t delete the order, this game is completed');
                    return;
				}
			}

            if(defaultMethods.getType(popupElement) === 'String' && showPopup) // отрабатывает на стр. my activity, когда нужно открыть форму удаления нативно
			{
				popupElement = `#${popupElement}__order`;
				this._moveToElement(popupElement, 'delete');
                setTimeout(() => {
                    $(popupElement).find('.pop_up').fadeIn();
                }, 300);
			}
			else
			{
				if(showPopup) $(popupElement).fadeIn();
				else $(popupElement).fadeOut();
			}

		}
	}

    /**
     * @param id : string - order id
     * @param handle : string - it can be 'edit' ro 'delete' (now isn`t using)
     * @private
     */
	private _moveToElement(id, handle) {
		const currentOrders = $('#current-orders');
		const tab = $('.left_order .tab');
		// const activeTadFirst = tab.eq(0).hasClass('active');
		const scrollPos = $(id)[0].offsetTop - 150;

		// console.log('2: ', scrollPos);
		// currentOrders.find('.form-container').slideUp(200);
		currentOrders.find('.pop_up').fadeOut();

		// if(activeTadFirst){
		// 	$('#order').hide();
		// 	tab.removeClass('active');
			// tab.eq(1).addClass('active');
			// currentOrders.fadeIn();
			// if(handle == 'edit' && !this._checkOnLastElement(id)){
			// 	setTimeout(()=>{
			// 		currentOrders.animate({scrollTop: scrollPos} , 200);
			// 	}, 450);
			// }
			// else if(handle == 'delete'){
			// 	setTimeout(()=>{
			// 		currentOrders.animate({scrollTop: scrollPos} , 200);
			// 	}, 450);
			// }
		// }
		// else{
			// if(handle == 'edit' && !this._checkOnLastElement(id)) currentOrders.animate({scrollTop: scrollPos} , 200);
			// else currentOrders.animate({scrollTop: scrollPos} , 200);
		// }
		currentOrders.animate({scrollTop: scrollPos} , 200);

		// return activeTadFirst;
	}

	// private _checkOnLastElement(id)
	// {
	// 	const lastOrders = $('#current-orders').find('.order_content:last-of-type .order_container');
	// 	const ids = [];
	// 	for(let ii = -4; ii <= -1; ii++){
	// 		ids.push('#' + lastOrders.eq(ii).attr('id'));
	// 	}
	// 	 return ids.some((item)=> item == id)
	// }
}



export default (new Actions()).export();