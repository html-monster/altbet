/**
 * Created by Htmlbook on 21.12.2016.
 */
class OddsConverter
{
    constructor(oddsSystem)
    {
        this.FRACTION = 'Fraction';
        this.DECIMAL = 'Decimal';
        this.AMERICAN = 'American';
		this.oddsSystem = oddsSystem;

        // switch (oddsSystem){
        //     case FRACTION:
        //         break;
        //     case DECIMAL:
        //         break;
        //     case AMERICAN:
        //         break;
			// default:
        //         this.calculation = ::this._impliedProbabilityCalculation;
        //         this.calcBeforeOrderAdd = ::this._impliedProbabilityCalcBeforeAdd;
        // }
    }

	convertToImpliedSystem(value)
	{
		switch (this.oddsSystem){
			case this.DECIMAL:{
				value = Math.round10(1 / value, -2);
				break;
			}
			case this.FRACTION:{
				let numerator = +value.split('/')[0];
				let denominator = +value.split('/')[1];
				// console.log(numerator);
				// console.log(denominator);
				value = Math.round10(denominator / (denominator + numerator), -2);
				break;
			}
			case this.AMERICAN:{
				if(value < 0) value = Math.round10(-value / (-value + 100), -2);
				else value = Math.round10(100 / (value + 100), -2);
				break;
			}
		}
		return value;
	}

    convertToOtherSystem(value)
	{
		if(value < 0.01 || value > 0.99) console.error('Conversion method expects value from 0.01 to 0.99');

		value = Math.round(value * 100);

		switch (this.oddsSystem){
			case this.DECIMAL:{
				value = Math.round10(100 / value, -2);
				break;
			}
			case this.FRACTION:{
				let initialValue = Math.round(value);
				value = ((100 - value) / value);
				if(defaultMethods.isInteger(value)) value = value + '/1';
				else
					value = this._fractionsReduction(100 - initialValue, initialValue);
				break;
			}
			case this.AMERICAN:{
				if (value > 50) 	 value = Math.round(-(value / (100 - value)) * 100);
				else if (value < 50) value = Math.round(((100 - value) / value) * 100);
				else 				 value = 100;
				break;
			}
			default:
				value = Math.round(value / 100);
		}
		return value;
	}

	getSystemName()
	{
		return this.oddsSystem;
	}

	_fractionsReduction(numerator, denominator)
	{
		let fraction = `${numerator}/${denominator}`;
		if(defaultMethods.isInteger(numerator / 2) && defaultMethods.isInteger(denominator / 2)){
			fraction = this._fractionsReduction(numerator / 2, denominator / 2);
		}
		else if(defaultMethods.isInteger(numerator / 3) && defaultMethods.isInteger(denominator / 3))
			fraction = this._fractionsReduction(numerator / 3, denominator / 3);
		else if(defaultMethods.isInteger(numerator / 5) && defaultMethods.isInteger(denominator / 5))
			fraction = this._fractionsReduction(numerator / 5, denominator / 5);
		else if(defaultMethods.isInteger(numerator / 7) && defaultMethods.isInteger(denominator / 7))
			fraction = this._fractionsReduction(numerator / 7, denominator / 7);
		// else{
		// 	return `${numerator}/${denominator}`
		// }
		return fraction;
	}

	/**
	 * Делает пересчет в полях ввода
	 * @param formData - react object
	 * @param inputContext - контекст вызова
	 * @private
	 */
// 	_impliedProbabilityCalculation(formData, inputContext, checkboxProp)
//     {
//         // console.log(formData, inputContext);
//         let priceInput = $(formData.refs.inputPrice),
//             volumeInput = $(formData.refs.inputQuantity),
//             sumInput = $(formData.refs.inputSum),
//             feesInput = $(formData.refs.inputFees),
//             riskInput = $(formData.refs.inputRisk),
//             profitInput = $(formData.refs.inputProfit),
//             price,
//             volume = +volumeInput.val(),
//             sum = +sumInput.val(),
//             fee = Math.round10(ABpp.config.takerFees * volume, -2);
// // console.log(priceInput);
//         if (checkboxProp) {
//             if (priceInput.parents('.sell-container').length) {
//                 price = 1 - priceInput.val();
//             }
//             else {
//                 price = priceInput.val();
//             }
// 			if (inputContext == 'price'){
// 				if (volume) {
// 					sum = Math.round10(price * volume, -2);
// 					sumInput.val(sum);
// 					feesInput.val(fee || '');
// 					riskInput.val(Math.round10(fee + sum, -2) || '');
// 					profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
// 					// console.log(fee + sum);
// 				}
// 			}
// 			if (inputContext == 'quantity'){
// 				if (price) {
// 					sum = Math.round10(price * volume, -2);
// 					sumInput.val(sum);
// 				}
// 				feesInput.val(fee || '');
// 				riskInput.val(Math.round10(fee + sum, -2) || '');
// 			}
// 			if (inputContext == 'sum'){
// 				if (price) {
// 					volume = Math.round10(sum / price) || '';
// 					volumeInput.val((volume == 'Infinity') ? '' : volume);
// 					fee = Math.round10(0.0086 * volume, -2);
// 					feesInput.val(fee || '');
// 					riskInput.val(Math.round10(fee + sum, -2) || '');
// 					profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
// 				}
// 			}
// 			else{
// 				if(price && volume && sum)
// 					profitInput.val(Math.round10((1 - price) * volume, -2));
// 				else
// 					profitInput.val('');
// 			}
//         }
//         else {
// 			switch (inputContext) {
// 				case 'quantity':
// 					feesInput.val(fee || '');
// 					sumInput.val('');
// 					riskInput.val('');
// 					profitInput.val('');
// 					break;
// 				case 'sum':
// 					volumeInput.val('');
// 					feesInput.val('');
// 			}
//         }
//     }

	/**
	 * Считает fees перед добавление ордера
	 * @param formData - react object
	 * @private
	 */
	// _impliedProbabilityCalcBeforeAdd(formData){
	// 	let volume = formData.props.data.Volume;
	// 	return Math.round10(ABpp.config.takerFees * volume, -2)
	// }
}
export let OddsConverterObj = new OddsConverter('Fraction');
