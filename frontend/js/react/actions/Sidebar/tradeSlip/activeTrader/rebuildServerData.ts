/**
 * Created by Htmlbook on 30.01.2017.
 */
// declare className : string;
let spread = 'ask';

export default class RebuildServerData
{
    private Key: string;
    private Price: number;
    private QuantitySell: number;
    private QuantityBuy: number;
    private ParticularUserQuantitySell: number;
    private ParticularUserQuantityBuy: number;
    private Bid: boolean;
    private Ask: boolean;
    private BidValue: number;
    private AskValue: number;
    private Spread: string = 'ask';

    constructor(params)
    {
        const {backendData, data, price, isMirror} = params;

        // price = Math.round10(price, -2);
        this.Key = 'trader_' + price;
        this.Price = price;
        if(backendData && backendData[price]){
        // console.log(data.className);
        // data.className = 'lalal';
        // console.log(data.className);
            if(backendData[price].Side) {
                this.ParticularUserQuantitySell = backendData[price].ParticularUserQuantity;
                this.QuantitySell = backendData[price].Quantity;
            }
            else{
                this.ParticularUserQuantityBuy = backendData[price].ParticularUserQuantity;
                this.QuantityBuy = backendData[price].Quantity;
            }

            if(isMirror){
                if(data.Symbol && price == Math.round10(1 - data.Symbol.LastAsk, -2)) this.Bid = true;
                if(data.Symbol && price == Math.round10(1 - data.Symbol.LastBid, -2)) this.Ask = true;
            }
            else{
                if(data.Symbol && price == data.Symbol.LastBid) this.Bid = true;
                if(data.Symbol && price == data.Symbol.LastAsk) this.Ask = true;
            }
            if(this.Bid) {
                spread = 'bid';
            }
        }
        if(data.Symbol){
            if(isMirror){
                this.BidValue = data.Symbol.LastAsk === null ? null : Math.round10(1 - data.Symbol.LastAsk, -2);
                this.AskValue = data.Symbol.LastBid === null ? null : Math.round10(1 - data.Symbol.LastBid, -2);
            }
            else{
                this.BidValue = data.Symbol.LastBid;
                this.AskValue = data.Symbol.LastAsk;
            }
        }
        this.Spread = spread;
        if(!data.Symbol) {spread = 'mid'; }
        this.Spread = spread;
        if(this.Ask){
            if(data.Symbol.LastAsk && data.Symbol.LastBid)
                spread = 'mid';
            else
                spread = 'bid';
        }
        if(price == 0.01) spread = 'ask';
    }
}
