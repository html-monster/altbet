/**
 * Created by Htmlbook on 21.12.2016.
 */
class OddsConverter
{
    constructor(oddsSystem)
    {
        const FRACTION = 'fraction';
        const DECIMAL = 'decimal';
        const AMERICAN = 'american';
        const IMPLIED_PROBABILITY = 'implied_probability';

        switch (oddsSystem){
            case FRACTION:
                break;
            case DECIMAL:
                break;
            case AMERICAN:
                break;
			default:
                this.calculation = ::this._impliedProbabilityCalculation;
                this.calcBeforeOrderAdd = ::this._impliedProbabilityCalcBeforeAdd;
        }
    }

	/**
	 * Делает пересчет в полях ввода
	 * @param formData - react object
	 * @param inputContext - контекст вызова
	 * @private
	 */
	_impliedProbabilityCalculation(formData, inputContext, checkboxProp)
    {
        // console.log(formData, inputContext);
        let priceInput = $(formData.refs.inputPrice),
            volumeInput = $(formData.refs.inputQuantity),
            sumInput = $(formData.refs.inputSum),
            feesInput = $(formData.refs.inputFees),
            riskInput = $(formData.refs.inputRisk),
            profitInput = $(formData.refs.inputProfit),
            price,
            volume = +volumeInput.val(),
            sum = +sumInput.val(),
            fee = Math.round10(ABpp.config.takerFees * volume, -2);
console.log(priceInput);
        if (checkboxProp) {
            if (priceInput.parents('.sell-container').length) {
                price = 1 - priceInput.val();
            }
            else {
                price = priceInput.val();
            }
			if (inputContext == 'price'){
				if (volume) {
					sum = Math.round10(price * volume, -2);
					sumInput.val(sum);
					feesInput.val(fee || '');
					riskInput.val(Math.round10(fee + sum, -2) || '');
					profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
					// console.log(fee + sum);
				}
			}
			if (inputContext == 'quantity'){
				if (price) {
					sum = Math.round10(price * volume, -2);
					sumInput.val(sum);
				}
				feesInput.val(fee || '');
				riskInput.val(Math.round10(fee + sum, -2) || '');
			}
			if (inputContext == 'sum'){
				if (price) {
					volume = Math.round10(sum / price) || '';
					volumeInput.val((volume == 'Infinity') ? '' : volume);
					fee = Math.round10(0.0086 * volume, -2);
					feesInput.val(fee || '');
					riskInput.val(Math.round10(fee + sum, -2) || '');
					profitInput.val(Math.round10((1 - price) * ((volume == 'Infinity') ? '' : volume), -2) || '');
				}
			}
			else{
				if(price && volume && sum)
					profitInput.val(Math.round10((1 - price) * volume, -2));
				else
					profitInput.val('');
			}
        }
        else {
			switch (inputContext) {
				case 'quantity':
					feesInput.val(fee || '');
					sumInput.val('');
					riskInput.val('');
					profitInput.val('');
					break;
				case 'sum':
					volumeInput.val('');
					feesInput.val('');
			}
        }
    }

	/**
	 * Считает fees перед добавление ордера
	 * @param formData - react object
	 * @private
	 */
    _impliedProbabilityCalcBeforeAdd(formData){
		let volume = formData.props.data.Volume;
		return Math.round10(ABpp.config.takerFees * volume, -2)
	}
}
export let OddsConverterObj = new OddsConverter('implied_probability');
