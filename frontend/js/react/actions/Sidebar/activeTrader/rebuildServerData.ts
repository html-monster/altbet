/**
 * Created by Htmlbook on 30.01.2017.
 */
// declare className : string;
// className = 'ask';

export default class RebuildServerData
{
    private Key: string;
    private Price: number;
    private QuantitySell: number;
    private QuantityBuy: number;
    private ParticularUserQuantitySell: number;
    private ParticularUserQuantityBuy: number;
    private Bid: string;
    private Ask: string;
    // private ClassName: string;

    constructor(params)
    {
        const {backendData, data, price, isMirror} = params;

        // price = Math.round10(price, -2);
        this.Key = 'trader_' + price;
        this.Price = price;
        if(backendData && backendData[price]){
            if(backendData[price].Side) {
                this.ParticularUserQuantitySell = backendData[price].ParticularUserQuantity;
                this.QuantitySell = backendData[price].Quantity;
            }
            else{
                this.ParticularUserQuantityBuy = backendData[price].ParticularUserQuantity;
                this.QuantityBuy = backendData[price].Quantity;
            }

            if(isMirror){
                if(data.Symbol && price == Math.round10(1 - data.Symbol.LastAsk, -2)) this.Bid = Math.round10(1 - data.Symbol.LastAsk, -2);
                if(data.Symbol && price == Math.round10(1 - data.Symbol.LastBid, -2)) this.Ask = Math.round10(1 - data.Symbol.LastBid, -2);
            }
            else{
                if(data.Symbol && price == data.Symbol.LastBid) this.Bid = data.Symbol.LastBid;
                if(data.Symbol && price == data.Symbol.LastAsk) this.Ask = data.Symbol.LastAsk;
            }
            // if(this.Bid) params.className = 'bid';
        }
        // if(!data.Symbol) {params.className = 'mid'; }
        // this.ClassName = params.className;
        // if(this.Ask){
        //     if(data.Symbol.LastAsk && data.Symbol.LastBid)
        //         params.className = 'mid';
        //     else
        //         params.className = 'bid';
        // }
    }
}
